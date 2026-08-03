import * as THREE from 'three';
import { CharacterConfig } from '../types/character';

export type RenderMode = '2d' | '3d';

interface Ctx {
  mode: RenderMode;
  group: THREE.Group;
}

function material(color: string, mode: RenderMode): THREE.Material {
  if (mode === '3d') {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.45,
      metalness: 0.05
    });
  }
  return new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
}

function add(
ctx: Ctx,
geometry3d: () => THREE.BufferGeometry,
geometry2d: () => THREE.BufferGeometry,
color: string,
position: [number, number, number],
rotation: [number, number, number] = [0, 0, 0])
: THREE.Mesh {
  const geo = ctx.mode === '3d' ? geometry3d() : geometry2d();
  const mesh = new THREE.Mesh(geo, material(color, ctx.mode));
  mesh.position.set(position[0], position[1], ctx.mode === '3d' ? position[2] : position[2] * 0.02);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  mesh.castShadow = ctx.mode === '3d';
  mesh.receiveShadow = ctx.mode === '3d';
  ctx.group.add(mesh);
  return mesh;
}

function ball(ctx: Ctx, r: number, color: string, pos: [number, number, number]) {
  return add(
    ctx,
    () => new THREE.SphereGeometry(r, 40, 32),
    () => new THREE.CircleGeometry(r, 56),
    color,
    pos
  );
}

function box(
ctx: Ctx,
w: number,
h: number,
d: number,
color: string,
pos: [number, number, number],
rot: [number, number, number] = [0, 0, 0])
{
  return add(
    ctx,
    () => new THREE.BoxGeometry(w, h, d),
    () => new THREE.PlaneGeometry(w, h),
    color,
    pos,
    rot
  );
}

function capsule(
ctx: Ctx,
r: number,
len: number,
color: string,
pos: [number, number, number],
rot: [number, number, number] = [0, 0, 0])
{
  return add(
    ctx,
    () => new THREE.CapsuleGeometry(r, len, 16, 24),
    () => new THREE.CapsuleGeometry(r, len, 4, 24),
    color,
    pos,
    rot
  );
}

const BODY_SHAPE: Record<string, {w: number;h: number;}> = {
  round: { w: 1, h: 1 },
  tall: { w: 0.82, h: 1.34 },
  square: { w: 1.12, h: 1.02 },
  pear: { w: 1.18, h: 1.06 }
};

export interface CharacterParts {
  root: THREE.Group;
  head: THREE.Group;
  body: THREE.Group;
  limbs: THREE.Group;
}

/**
 * Builds a stylised cartoon character out of primitives.
 * The same builder powers the flat 2D orthographic view and the lit 3D view,
 * so both viewports always show exactly the same character.
 */
export function buildCharacter(config: CharacterConfig, mode: RenderMode): CharacterParts {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  const headGroup = new THREE.Group();
  const limbs = new THREE.Group();
  root.add(bodyGroup, headGroup, limbs);

  const shape = BODY_SHAPE[config.bodyShape] ?? BODY_SHAPE.round;
  const bodyR = 0.92 * config.bodySize;
  const bodyW = bodyR * shape.w;
  const bodyH = bodyR * shape.h;
  const headR = 0.72 * config.headSize;
  const headY = bodyH + headR * 0.82;

  const bodyCtx: Ctx = { mode, group: bodyGroup };
  const headCtx: Ctx = { mode, group: headGroup };
  const limbCtx: Ctx = { mode, group: limbs };

  // ---- Body ----
  const bodyMesh = ball(bodyCtx, bodyR, config.bodyColor, [0, bodyH * 0.55, 0]);
  bodyMesh.scale.set(shape.w, shape.h, mode === '3d' ? shape.w : 1);
  if (config.bodyShape === 'pear') bodyMesh.scale.y *= 0.92;

  // ---- Clothes ----
  if (config.clothesStyle === 'tshirt') {
    const shirt = ball(bodyCtx, bodyR * 0.98, config.clothesColor, [0, bodyH * 0.42, 0.02]);
    shirt.scale.set(shape.w * 1.02, shape.h * 0.66, mode === '3d' ? shape.w * 1.02 : 1);
  } else if (config.clothesStyle === 'overalls') {
    const overall = ball(bodyCtx, bodyR * 0.95, config.clothesColor, [0, bodyH * 0.32, 0.02]);
    overall.scale.set(shape.w * 1.04, shape.h * 0.58, mode === '3d' ? shape.w * 1.04 : 1);
    box(bodyCtx, bodyR * 0.2, bodyR * 0.7, 0.16, config.clothesColor, [
    -bodyR * 0.32,
    bodyH * 0.85,
    bodyR * 0.75]
    );
    box(bodyCtx, bodyR * 0.2, bodyR * 0.7, 0.16, config.clothesColor, [
    bodyR * 0.32,
    bodyH * 0.85,
    bodyR * 0.75]
    );
  } else if (config.clothesStyle === 'cape') {
    const cape = box(bodyCtx, bodyW * 1.9, bodyH * 1.5, 0.12, config.clothesColor, [
    0,
    bodyH * 0.55,
    -bodyR * 0.8]
    );
    cape.rotation.x = mode === '3d' ? 0.12 : 0;
  }

  // ---- Limbs (arms + feet) ----
  const armY = bodyH * 0.62;
  capsule(limbCtx, bodyR * 0.16, bodyR * 0.5, config.bodyColor, [-bodyW * 1.02, armY, 0], [0, 0, 0.5]);
  capsule(limbCtx, bodyR * 0.16, bodyR * 0.5, config.bodyColor, [bodyW * 1.02, armY, 0], [0, 0, -0.5]);
  ball(limbCtx, bodyR * 0.22, config.bodyColor, [-bodyW * 0.45, -0.02, bodyR * 0.2]);
  ball(limbCtx, bodyR * 0.22, config.bodyColor, [bodyW * 0.45, -0.02, bodyR * 0.2]);

  // ---- Head ----
  headGroup.position.y = headY;
  const head = ball(headCtx, headR, config.headColor, [0, 0, 0]);
  head.scale.set(1.04, 1, 1);

  // Type specific head features
  if (config.type === 'animal') {
    const ear = (x: number) => {
      const e = ball(headCtx, headR * 0.34, config.headColor, [x, headR * 0.86, -0.02]);
      e.scale.set(0.7, 1.15, 0.7);
      return e;
    };
    ear(-headR * 0.62);
    ear(headR * 0.62);
    ball(headCtx, headR * 0.2, config.bodyColor, [-headR * 0.62, headR * 0.88, 0.24]);
    ball(headCtx, headR * 0.2, config.bodyColor, [headR * 0.62, headR * 0.88, 0.24]);
  } else if (config.type === 'plant') {
    const leaf = (x: number, rot: number) => {
      const l = ball(headCtx, headR * 0.36, config.hairColor === 'none' ? '#22C55E' : config.hairColor, [
      x,
      headR * 0.95,
      -0.02]
      );
      l.scale.set(1.5, 0.5, 0.5);
      l.rotation.z = rot;
      return l;
    };
    leaf(-headR * 0.72, 0.6);
    leaf(headR * 0.72, -0.6);
    capsule(headCtx, headR * 0.07, headR * 0.4, '#16A34A', [0, headR * 1.02, 0]);
  }

  // Hair
  if (config.hairStyle === 'short') {
    const h = ball(headCtx, headR * 1.02, config.hairColor, [0, headR * 0.28, -0.02]);
    h.scale.set(1.02, 0.62, 1.02);
  } else if (config.hairStyle === 'curly') {
    const positions: [number, number][] = [
    [-0.62, 0.6],
    [-0.22, 0.86],
    [0.22, 0.86],
    [0.62, 0.6],
    [0, 1.0]];

    positions.forEach(([x, y]) =>
    ball(headCtx, headR * 0.3, config.hairColor, [x * headR, y * headR, 0])
    );
  } else if (config.hairStyle === 'spiky') {
    for (let i = -2; i <= 2; i++) {
      const spike = add(
        { mode, group: headGroup },
        () => new THREE.ConeGeometry(headR * 0.18, headR * 0.6, 20),
        () => new THREE.ConeGeometry(headR * 0.18, headR * 0.6, 3),
        config.hairColor,
        [i * headR * 0.32, headR * 0.95, 0]
      );
      spike.rotation.z = -i * 0.22;
    }
  } else if (config.hairStyle === 'ponytail') {
    const h = ball(headCtx, headR * 1.02, config.hairColor, [0, headR * 0.3, -0.02]);
    h.scale.set(1.02, 0.6, 1.02);
    const tail = ball(headCtx, headR * 0.36, config.hairColor, [headR * 1.0, headR * 0.35, -0.1]);
    tail.scale.set(0.8, 1.4, 0.8);
  }

  // ---- Face ----
  const eyeR = 0.15 * config.eyeSize * config.headSize;
  const eyeX = headR * 0.38;
  const eyeZ = headR * 0.92;
  const eyeGeoScale: Record<string, [number, number]> = {
    round: [1, 1],
    oval: [0.82, 1.25],
    happy: [1.1, 0.55],
    sleepy: [1.15, 0.34]
  };
  const [sx, sy] = eyeGeoScale[config.eyeStyle] ?? [1, 1];
  [-1, 1].forEach((side) => {
    const white = ball(headCtx, eyeR * 1.5, '#FFFFFF', [side * eyeX, headR * 0.16, eyeZ]);
    white.scale.set(sx, sy, mode === '3d' ? 0.6 : 1);
    const pupil = ball(headCtx, eyeR * 0.78, config.eyeColor, [
    side * eyeX,
    headR * 0.16,
    eyeZ + eyeR * 0.9]
    );
    pupil.scale.set(sx, Math.max(sy, 0.6), mode === '3d' ? 0.6 : 1);
  });

  // Nose
  if (config.noseStyle === 'button') {
    ball(headCtx, 0.09 * config.noseSize * config.headSize, '#0F172A', [0, -headR * 0.06, eyeZ + 0.08]);
  } else if (config.noseStyle === 'snout') {
    const snout = ball(headCtx, headR * 0.32 * config.noseSize, '#FFFFFF', [0, -headR * 0.14, eyeZ * 0.86]);
    snout.scale.set(1.25, 0.85, mode === '3d' ? 0.8 : 1);
    ball(headCtx, 0.08 * config.noseSize, '#0F172A', [0, -headR * 0.08, eyeZ + 0.14]);
  }

  // Mouth
  const mouthY = -headR * 0.4;
  const mw = 0.3 * config.mouthSize * config.headSize;
  if (config.mouthStyle === 'smile' || config.mouthStyle === 'grin') {
    const torus = add(
      headCtx,
      () => new THREE.TorusGeometry(mw, mw * 0.16, 12, 32, Math.PI),
      () => new THREE.TorusGeometry(mw, mw * 0.16, 4, 32, Math.PI),
      '#0F172A',
      [0, mouthY + mw * 0.2, eyeZ * 0.94],
      [0, 0, Math.PI]
    );
    if (config.mouthStyle === 'grin') {
      const teeth = box(headCtx, mw * 1.5, mw * 0.28, 0.08, '#FFFFFF', [
      0,
      mouthY + mw * 0.14,
      eyeZ * 0.95]
      );
      teeth.renderOrder = 1;
      void torus;
    }
  } else if (config.mouthStyle === 'open') {
    const m = ball(headCtx, mw * 0.6, '#0F172A', [0, mouthY, eyeZ * 0.95]);
    m.scale.set(1.1, 0.9, mode === '3d' ? 0.5 : 1);
  } else {
    box(headCtx, mw * 1.4, mw * 0.16, 0.08, '#0F172A', [0, mouthY, eyeZ * 0.95]);
  }

  // ---- Accessories ----
  if (config.accessory === 'hat') {
    const brim = add(
      headCtx,
      () => new THREE.CylinderGeometry(headR * 1.32, headR * 1.32, headR * 0.1, 32),
      () => new THREE.PlaneGeometry(headR * 2.64, headR * 0.16),
      config.accessoryColor,
      [0, headR * 0.86, 0]
    );
    void brim;
    add(
      headCtx,
      () => new THREE.CylinderGeometry(headR * 0.72, headR * 0.8, headR * 0.72, 32),
      () => new THREE.PlaneGeometry(headR * 1.5, headR * 0.72),
      config.accessoryColor,
      [0, headR * 1.24, 0]
    );
  } else if (config.accessory === 'glasses') {
    ;[-1, 1].forEach((side) => {
      add(
        headCtx,
        () => new THREE.TorusGeometry(eyeR * 1.9, eyeR * 0.18, 10, 28),
        () => new THREE.TorusGeometry(eyeR * 1.9, eyeR * 0.18, 4, 28),
        config.accessoryColor,
        [side * eyeX, headR * 0.16, eyeZ + eyeR * 1.3]
      );
    });
    box(headCtx, eyeX * 0.7, eyeR * 0.24, 0.06, config.accessoryColor, [
    0,
    headR * 0.16,
    eyeZ + eyeR * 1.3]
    );
  } else if (config.accessory === 'bowtie') {
    const l = box(headCtx, headR * 0.4, headR * 0.3, 0.1, config.accessoryColor, [
    -headR * 0.26,
    -headR * 1.0,
    headR * 0.6]
    );
    l.rotation.z = 0.35;
    const r = box(headCtx, headR * 0.4, headR * 0.3, 0.1, config.accessoryColor, [
    headR * 0.26,
    -headR * 1.0,
    headR * 0.6]
    );
    r.rotation.z = -0.35;
    ball(headCtx, headR * 0.11, config.accessoryColor, [0, -headR * 1.0, headR * 0.66]);
  } else if (config.accessory === 'headphones') {
    add(
      headCtx,
      () => new THREE.TorusGeometry(headR * 1.06, headR * 0.08, 12, 32, Math.PI),
      () => new THREE.TorusGeometry(headR * 1.06, headR * 0.08, 4, 32, Math.PI),
      config.accessoryColor,
      [0, 0, 0]
    );
    [-1, 1].forEach((side) => {
      const cup = ball(headCtx, headR * 0.24, config.accessoryColor, [side * headR * 1.04, 0, 0]);
      cup.scale.set(0.6, 1.1, 1);
    });
  }

  return { root, head: headGroup, body: bodyGroup, limbs };
}

export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());else
    if (mat) mat.dispose();
  });
}