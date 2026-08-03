import React, { useCallback, useRef, useState } from 'react';
import {
  BoxIcon,
  MaximizeIcon,
  MinimizeIcon,
  MoveIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  RotateCwIcon,
  ShapesIcon,
  ZoomInIcon,
  ZoomOutIcon } from
'lucide-react';
import { CharacterConfig } from '../../types/character';
import { CanvasApi, CharacterCanvas, EnvironmentPreset } from './CharacterCanvas';
import { Tooltip } from '../ui/Tooltip';
import { Badge } from '../ui/Badge';

interface Props {
  config: CharacterConfig;
  mode: '2d' | '3d';
  title: string;
  environment?: EnvironmentPreset;
  lighting?: number;
  showShadow?: boolean;
  className?: string;
  canvasClassName?: string;
  onApiReady?: (api: CanvasApi) => void;
  expandable?: boolean;
}

export function ViewportCard({
  config,
  mode,
  title,
  environment = 'studio',
  lighting = 1,
  showShadow = true,
  className = '',
  canvasClassName = '',
  onApiReady,
  expandable = true
}: Props) {
  const apiRef = useRef<CanvasApi | null>(null);
  const [idle, setIdle] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const handleReady = useCallback(
    (api: CanvasApi) => {
      apiRef.current = api;
      onApiReady?.(api);
    },
    [onApiReady]
  );

  const tools = [
  { label: 'Zoom in', icon: ZoomInIcon, action: () => apiRef.current?.zoomBy(1.18), shortcut: '+' },
  { label: 'Zoom out', icon: ZoomOutIcon, action: () => apiRef.current?.zoomBy(0.85), shortcut: '-' },
  { label: 'Rotate left', icon: RotateCcwIcon, action: () => apiRef.current?.nudgeRotation(-0.4) },
  { label: 'Rotate right', icon: RotateCwIcon, action: () => apiRef.current?.nudgeRotation(0.4) },
  { label: 'Reset view', icon: MoveIcon, action: () => apiRef.current?.resetView(), shortcut: 'R' }];


  return (
    <section
      className={[
      'glass flex flex-col overflow-hidden rounded-3xl shadow-glass',
      expanded ? 'fixed inset-6 z-50' : className].
      join(' ')}
      aria-label={title}>
      
      <header className="flex items-center gap-3 border-b border-white/70 px-4 py-3">
        <span
          className={`grid h-8 w-8 place-items-center rounded-xl ${
          mode === '3d' ? 'bg-primary-50 text-primary' : 'bg-secondary-50 text-secondary-600'}`
          }>
          
          {mode === '3d' ? <BoxIcon className="h-4 w-4" /> : <ShapesIcon className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-[13px] font-semibold text-slate-800">{title}</h2>
          <p className="truncate text-[11px] text-slate-400">
            {mode === '3d' ? 'Drag to orbit · Shift-drag to pan · Scroll to zoom' : 'Drag to pan · Scroll to zoom'}
          </p>
        </div>
        <Badge tone={mode === '3d' ? 'primary' : 'secondary'} className="ml-auto hidden shrink-0 sm:flex">
          {mode === '3d' ? 'WebGL 3D' : 'WebGL 2D'}
        </Badge>
      </header>

      <div className={`relative min-h-0 flex-1 ${canvasClassName}`}>
        <CharacterCanvas
          config={config}
          mode={mode}
          environment={environment}
          lighting={lighting}
          showShadow={showShadow}
          idle={idle}
          interactive
          onReady={handleReady} />
        
      </div>

      <footer className="flex items-center gap-1 border-t border-white/70 px-3 py-2">
        {tools.map((tool) =>
        <Tooltip key={tool.label} label={tool.label} shortcut={tool.shortcut} side="top">
            <button
            onClick={tool.action}
            aria-label={tool.label}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-all hover:bg-white hover:text-primary active:scale-95">
            
              <tool.icon className="h-4 w-4" />
            </button>
          </Tooltip>
        )}
        <div className="mx-1 h-5 w-px bg-slate-200" />
        <Tooltip label={idle ? 'Pause idle animation' : 'Play idle animation'} side="top">
          <button
            onClick={() => setIdle((v) => !v)}
            aria-label={idle ? 'Pause idle animation' : 'Play idle animation'}
            aria-pressed={idle}
            className={`grid h-8 w-8 place-items-center rounded-lg transition-all hover:bg-white active:scale-95 ${
            idle ? 'text-primary' : 'text-slate-400'}`
            }>
            
            {idle ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
          </button>
        </Tooltip>
        {expandable &&
        <Tooltip label={expanded ? 'Exit full screen' : 'Full screen'} side="top">
            <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Exit full screen' : 'Full screen'}
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-all hover:bg-white hover:text-primary active:scale-95">
            
              {expanded ? <MinimizeIcon className="h-4 w-4" /> : <MaximizeIcon className="h-4 w-4" />}
            </button>
          </Tooltip>
        }
      </footer>
    </section>);

}