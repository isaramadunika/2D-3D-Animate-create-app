import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CharacterConfig } from '../../types/character';
import { buildCharacter, disposeObject, RenderMode } from '../../utils/characterModel';

export type EnvironmentPreset = 'studio' | 'sky' | 'sunset' | 'grid' | 'transparent';

export interface CanvasApi {
  zoomBy: (factor: number) => void;
  setRotation: (radians: number) => void;
  nudgeRotation: (radians: number) => void;
  resetView: () => void;
  toDataURL: (type: 'image/png' | 'image/jpeg', transparent: boolean) => string;
  getRotation: () => number;
}

interface Props {
  config: CharacterConfig;
  mode: RenderMode;
  interactive?: boolean;
  idle?: boolean;
  environment?: EnvironmentPreset;
  lighting?: number;
  showShadow?: boolean;
  className?: string;
  onReady?: (api: CanvasApi) => void;
  onInteract?: () => void;
}

const ENV_COLORS: Record<EnvironmentPreset, [string, string]> = {
  studio: ['#eef2ff', '#ffffff'],
  sky: ['#67e8f9', '#e0f2fe'],
  sunset: ['#fbbf24', '#fda4af'],
  grid: ['#f8fafc', '#e2e8f0'],
  transparent: ['#ffffff', '#ffffff']
};

function gradientTexture(from: string, to: string) {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 256;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, from);
    g.addColorStop(1, to);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 8, 256);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function CharacterCanvas({
  config,
  mode,
  interactive = true,
  idle = true,
  environment = 'studio',
  lighting = 1,
  showShadow = true,
  className = '',
  onReady,
  onInteract
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const headRef = useRef<THREE.Group | null>(null);
  const shadowRef = useRef<THREE.Mesh | null>(null);
  const lightsRef = useRef<{dir: THREE.DirectionalLight;amb: THREE.AmbientLight;rim: THREE.PointLight;} | null>(null);
  const frameRef = useRef<number>(0);
  const idleRef = useRef(idle);
  const modeRef = useRef<RenderMode>(mode);

  const view = useRef({
    theta: 0,
    phi: Math.PI / 2 - 0.12,
    dist: 8,
    baseDist: 8,
    zoom: 1,
    target: new THREE.Vector3(0, 1.6, 0),
    baseTarget: new THREE.Vector3(0, 1.6, 0),
    spin: 0,
    baseFit: 1
  });

  idleRef.current = idle;
  modeRef.current = mode;

  const applyCamera = useCallback(() => {
    const cam = cameraRef.current;
    const host = hostRef.current;
    if (!cam || !host) return;
    const v = view.current;
    if (cam instanceof THREE.PerspectiveCamera) {
      const d = v.dist / v.zoom;
      cam.position.set(
        v.target.x + d * Math.sin(v.phi) * Math.sin(v.theta),
        v.target.y + d * Math.cos(v.phi),
        v.target.z + d * Math.sin(v.phi) * Math.cos(v.theta)
      );
      cam.lookAt(v.target);
    } else {
      cam.position.set(v.target.x, v.target.y, 10);
      cam.zoom = v.baseFit * v.zoom;
      cam.lookAt(v.target.x, v.target.y, 0);
      cam.updateProjectionMatrix();
    }
  }, []);

  const fitToObject = useCallback(() => {
    const model = modelRef.current;
    const cam = cameraRef.current;
    const host = hostRef.current;
    if (!model || !cam || !host) return;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const v = view.current;
    v.target.copy(center);
    v.baseTarget.copy(center);

    if (cam instanceof THREE.PerspectiveCamera) {
      const radius = Math.max(size.x, size.y, size.z) * 0.5;
      const fov = cam.fov * Math.PI / 180;
      // 1.9 padding factor guarantees the entire character is inside the viewport
      const dist = radius / Math.sin(fov / 2) * 1.9;
      const aspectPad = cam.aspect < 1 ? 1 / cam.aspect : 1;
      v.dist = dist * aspectPad;
      v.baseDist = v.dist;
      cam.near = 0.1;
      cam.far = v.dist * 8;
      cam.updateProjectionMatrix();
    } else {
      const h = host.clientHeight || 1;
      const w = host.clientWidth || 1;
      const fitY = h / (size.y * 1.28);
      const fitX = w / (size.x * 1.28);
      v.baseFit = Math.min(fitX, fitY);
    }
    applyCamera();
  }, [applyCamera]);

  // ---- one time setup ----
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const amb = new THREE.AmbientLight(0xffffff, 0.85);
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(4, 8, 6);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.near = 0.5;
    dir.shadow.camera.far = 40;
    const rim = new THREE.PointLight(0x06b6d4, 0.8, 30);
    rim.position.set(-6, 3, -4);
    scene.add(amb, dir, rim);
    lightsRef.current = { amb, dir, rim };

    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.ShadowMaterial({ opacity: 0.22 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.26;
    shadow.receiveShadow = true;
    scene.add(shadow);
    shadowRef.current = shadow;

    const clock = new THREE.Clock();
    const loop = () => {
      frameRef.current = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      const model = modelRef.current;
      if (model) {
        model.rotation.y = view.current.spin;
        if (idleRef.current) {
          model.position.y = Math.sin(t * 1.6) * 0.05;
          if (headRef.current) {
            headRef.current.rotation.z = Math.sin(t * 1.1) * 0.045;
            headRef.current.rotation.x = Math.sin(t * 0.8) * 0.03;
          }
        } else {
          model.position.y = 0;
        }
      }
      const cam = cameraRef.current;
      if (cam) renderer.render(scene, cam);
    };
    frameRef.current = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      const cam = cameraRef.current;
      if (cam instanceof THREE.PerspectiveCamera) {
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      } else if (cam instanceof THREE.OrthographicCamera) {
        cam.left = -w / 2;
        cam.right = w / 2;
        cam.top = h / 2;
        cam.bottom = -h / 2;
        cam.updateProjectionMatrix();
      }
      fitToObject();
    });
    ro.observe(host);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      if (modelRef.current) disposeObject(modelRef.current);
      shadow.geometry.dispose();
      (shadow.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [fitToObject]);

  // ---- camera per mode ----
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const w = host.clientWidth || 600;
    const h = host.clientHeight || 400;
    let cam: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    if (mode === '3d') {
      cam = new THREE.PerspectiveCamera(34, w / h, 0.1, 100);
      view.current.theta = 0;
      view.current.phi = Math.PI / 2 - 0.14;
    } else {
      cam = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100);
    }
    view.current.zoom = 1;
    view.current.spin = 0;
    cameraRef.current = cam;
    rendererRef.current?.setSize(w, h, false);
    if (shadowRef.current) shadowRef.current.visible = mode === '3d' && showShadow;
    fitToObject();
  }, [mode, showShadow, fitToObject]);

  // ---- model rebuild ----
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (modelRef.current) {
      scene.remove(modelRef.current);
      disposeObject(modelRef.current);
    }
    const parts = buildCharacter(config, mode);
    modelRef.current = parts.root;
    headRef.current = parts.head;
    scene.add(parts.root);
    fitToObject();
  }, [config, mode, fitToObject]);

  // ---- environment ----
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (environment === 'transparent') {
      scene.background = null;
    } else {
      const [a, b] = ENV_COLORS[environment];
      scene.background = gradientTexture(a, b);
    }
    if (shadowRef.current) {
      shadowRef.current.visible = mode === '3d' && showShadow && environment !== 'transparent';
    }
  }, [environment, mode, showShadow]);

  // ---- lighting ----
  useEffect(() => {
    const l = lightsRef.current;
    if (!l) return;
    l.dir.intensity = 1.5 * lighting;
    l.amb.intensity = 0.55 + 0.4 * lighting;
    l.rim.intensity = 0.8 * lighting;
  }, [lighting]);

  // ---- interaction: rotate / pan / zoom ----
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !interactive) return;
    let dragging = false;
    let panning = false;
    let lastX = 0;
    let lastY = 0;

    const down = (e: PointerEvent) => {
      dragging = true;
      panning = e.button === 1 || e.button === 2 || e.shiftKey || modeRef.current === '2d';
      lastX = e.clientX;
      lastY = e.clientY;
      host.setPointerCapture(e.pointerId);
      host.style.cursor = panning ? 'grabbing' : 'ew-resize';
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      const v = view.current;
      const cam = cameraRef.current;
      if (panning) {
        if (cam instanceof THREE.PerspectiveCamera) {
          const scale = v.dist / v.zoom * 0.0016;
          const right = new THREE.Vector3();
          const up = new THREE.Vector3();
          cam.matrixWorld.extractBasis(right, up, new THREE.Vector3());
          v.target.addScaledVector(right, -dx * scale);
          v.target.addScaledVector(up, dy * scale);
        } else if (cam instanceof THREE.OrthographicCamera) {
          const scale = 1 / (v.baseFit * v.zoom);
          v.target.x -= dx * scale;
          v.target.y += dy * scale;
        }
      } else {
        v.theta -= dx * 0.008;
        v.phi = Math.min(Math.PI - 0.25, Math.max(0.25, v.phi - dy * 0.006));
      }
      applyCamera();
      onInteract?.();
    };
    const up = (e: PointerEvent) => {
      dragging = false;
      panning = false;
      host.style.cursor = 'grab';
      if (host.hasPointerCapture(e.pointerId)) host.releasePointerCapture(e.pointerId);
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = view.current;
      v.zoom = Math.min(4, Math.max(0.35, v.zoom * (e.deltaY > 0 ? 0.92 : 1.08)));
      applyCamera();
      onInteract?.();
    };
    const ctx = (e: Event) => e.preventDefault();

    host.style.cursor = 'grab';
    host.addEventListener('pointerdown', down);
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerup', up);
    host.addEventListener('pointercancel', up);
    host.addEventListener('wheel', wheel, { passive: false });
    host.addEventListener('contextmenu', ctx);
    return () => {
      host.removeEventListener('pointerdown', down);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerup', up);
      host.removeEventListener('pointercancel', up);
      host.removeEventListener('wheel', wheel);
      host.removeEventListener('contextmenu', ctx);
    };
  }, [interactive, applyCamera, onInteract]);

  // ---- imperative api ----
  useEffect(() => {
    if (!onReady) return;
    const api: CanvasApi = {
      zoomBy: (factor) => {
        view.current.zoom = Math.min(4, Math.max(0.35, view.current.zoom * factor));
        applyCamera();
      },
      setRotation: (rad) => {
        view.current.spin = rad;
      },
      nudgeRotation: (rad) => {
        view.current.spin += rad;
      },
      getRotation: () => view.current.spin,
      resetView: () => {
        const v = view.current;
        v.zoom = 1;
        v.spin = 0;
        v.theta = 0;
        v.phi = Math.PI / 2 - 0.14;
        v.target.copy(v.baseTarget);
        fitToObject();
      },
      toDataURL: (type, transparent) => {
        const renderer = rendererRef.current;
        const scene = sceneRef.current;
        const cam = cameraRef.current;
        if (!renderer || !scene || !cam) return '';
        const prevBg = scene.background;
        if (transparent && type === 'image/png') scene.background = null;
        renderer.render(scene, cam);
        const url = renderer.domElement.toDataURL(type, 0.95);
        scene.background = prevBg;
        return url;
      }
    };
    onReady(api);
  }, [onReady, applyCamera, fitToObject]);

  return (
    <div
      ref={hostRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      role="img"
      aria-label={`${mode === '3d' ? '3D' : '2D'} preview of the character`}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={(e) => {
        if (!interactive) return;
        const v = view.current;
        if (e.key === 'ArrowLeft') v.theta -= 0.15;else
        if (e.key === 'ArrowRight') v.theta += 0.15;else
        if (e.key === 'ArrowUp') v.phi = Math.max(0.25, v.phi - 0.1);else
        if (e.key === 'ArrowDown') v.phi = Math.min(Math.PI - 0.25, v.phi + 0.1);else
        if (e.key === '+' || e.key === '=') v.zoom = Math.min(4, v.zoom * 1.1);else
        if (e.key === '-') v.zoom = Math.max(0.35, v.zoom * 0.9);else
        return;
        e.preventDefault();
        applyCamera();
      }} />);


}