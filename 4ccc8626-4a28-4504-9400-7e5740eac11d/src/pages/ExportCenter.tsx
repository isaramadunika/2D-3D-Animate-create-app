import React, { useCallback, useRef, useState } from 'react';
import { CheckCircle2Icon, DownloadIcon, FileImageIcon, ImageIcon, InfoIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CharacterThumb } from '../components/CharacterThumb';
import { CanvasApi, CharacterCanvas } from '../components/three/CharacterCanvas';
import { useApp } from '../contexts/AppContext';

type Format = 'png' | 'jpg' | 'svg';

const FORMATS: {value: Format;label: string;detail: string;transparent: boolean;}[] = [
{ value: 'png', label: 'PNG', detail: 'Lossless raster · supports transparency', transparent: true },
{ value: 'jpg', label: 'JPG', detail: 'Smaller file · solid background only', transparent: false },
{ value: 'svg', label: 'SVG', detail: 'Vector 2D artwork · infinitely scalable', transparent: true }];


const SIZES = [512, 1024, 2048];

export function ExportCenter() {
  const { characters, activeId } = useApp();
  const { pushToast } = useApp();
  const [selectedId, setSelectedId] = useState(activeId ?? characters[0]?.id);
  const character = characters.find((c) => c.id === selectedId) ?? characters[0];
  const [format, setFormat] = useState<Format>('png');
  const [transparent, setTransparent] = useState(true);
  const [size, setSize] = useState(1024);
  const [exporting, setExporting] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const apiRef = useRef<CanvasApi | null>(null);
  const svgRef = useRef<HTMLDivElement | null>(null);

  const handleReady = useCallback((api: CanvasApi) => {
    apiRef.current = api;
  }, []);

  const download = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const runExport = () => {
    if (!character) return;
    setExporting(true);
    window.setTimeout(() => {
      const slug = character.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      try {
        if (format === 'svg') {
          const svg = svgRef.current?.querySelector('svg');
          if (svg) {
            const clone = svg.cloneNode(true) as SVGSVGElement;
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            if (!transparent) {
              const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
              rect.setAttribute('width', '100%');
              rect.setAttribute('height', '100%');
              rect.setAttribute('fill', '#FFFFFF');
              clone.insertBefore(rect, clone.firstChild);
            }
            const blob = new Blob([new XMLSerializer().serializeToString(clone)], {
              type: 'image/svg+xml;charset=utf-8'
            });
            download(URL.createObjectURL(blob), `${slug}.svg`);
          }
        } else {
          const url = apiRef.current?.toDataURL(
            format === 'png' ? 'image/png' : 'image/jpeg',
            format === 'png' && transparent
          );
          if (url) download(url, `${slug}-${size}.${format}`);
        }
        const entry = `${slug}-${size}.${format}`;
        setHistory((h) => [entry, ...h].slice(0, 5));
        pushToast({ tone: 'success', title: 'Export ready', description: `${entry} downloaded.` });
      } catch {
        pushToast({ tone: 'error', title: 'Export failed', description: 'Please try a different format.' });
      }
      setExporting(false);
    }, 700);
  };

  if (!character) {
    return (
      <GlassCard>
        <p className="text-sm text-slate-500">Create a character before exporting.</p>
      </GlassCard>);

  }

  const supportsTransparency = FORMATS.find((f) => f.value === format)?.transparent ?? false;

  return (
    <div>
      <PageHeader
        title="Export"
        subtitle="Produce game-ready assets in PNG, JPG or vector SVG."
        crumbs={[{ label: 'Preview' }, { label: 'Export' }]}
        actions={
        <Button icon={DownloadIcon} loading={exporting} onClick={runExport}>
            {exporting ? 'Preparing…' : `Export ${format.toUpperCase()}`}
          </Button>
        } />
      

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Preview */}
        <GlassCard padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/70 px-6 py-4">
            <div>
              <h2 className="font-display text-[15px] font-semibold text-slate-900">Export preview</h2>
              <p className="text-[12px] text-slate-500">
                {format === 'svg' ? 'Vector artwork generated from the 2D view' : `${size} × ${size} px raster`}
              </p>
            </div>
            <Badge tone={transparent && supportsTransparency ? 'success' : 'neutral'}>
              {transparent && supportsTransparency ? 'Transparent background' : 'Solid background'}
            </Badge>
          </div>

          <div className={`grid place-items-center p-8 ${transparent && supportsTransparency ? 'checkerboard' : 'bg-white'}`}>
            {format === 'svg' ?
            <div ref={svgRef} className="h-[420px] w-[420px]">
                <CharacterThumb config={character.config} label={character.name} className="h-full w-full" />
              </div> :

            <div className="h-[420px] w-[420px] overflow-hidden rounded-2xl">
                <CharacterCanvas
                config={character.config}
                mode="3d"
                environment={transparent && supportsTransparency ? 'transparent' : 'studio'}
                interactive
                idle={false}
                onReady={handleReady} />
              
              </div>
            }
          </div>
          <p className="flex items-center justify-center gap-1.5 border-t border-white/70 py-3 text-[12px] text-slate-400">
            <InfoIcon className="h-3.5 w-3.5" />
            Drag the preview to set the exact pose that gets exported.
          </p>
        </GlassCard>

        {/* Options */}
        <div className="space-y-6">
          <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Format</h2>
            <div className="mt-4 space-y-2">
              {FORMATS.map((f) =>
              <button
                key={f.value}
                onClick={() => setFormat(f.value)}
                aria-pressed={format === f.value}
                className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                format === f.value ?
                'border-primary bg-primary-50/70 shadow-soft' :
                'border-slate-200 bg-white/70 hover:border-primary-200'}`
                }>
                
                  <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                  format === f.value ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`
                  }>
                  
                    {f.value === 'svg' ? <FileImageIcon className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-slate-800">{f.label}</span>
                    <span className="block text-[11px] leading-snug text-slate-500">{f.detail}</span>
                  </span>
                  {format === f.value && <CheckCircle2Icon className="ml-auto h-4 w-4 shrink-0 text-primary" />}
                </button>
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Options</h2>

            {format !== 'svg' &&
            <div className="mt-4">
                <span className="mb-2 block text-[13px] font-medium text-slate-600">Resolution</span>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map((s) =>
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`rounded-xl border py-2 text-[12px] font-medium transition-all ${
                  size === s ?
                  'border-primary bg-primary-50 text-primary-700' :
                  'border-slate-200 bg-white/70 text-slate-500 hover:border-primary-200'}`
                  }>
                  
                      {s}px
                    </button>
                )}
                </div>
              </div>
            }

            <label
              className={`mt-4 flex items-center justify-between rounded-xl border px-3 py-2.5 ${
              supportsTransparency ? 'cursor-pointer border-slate-200 bg-white/70' : 'border-slate-100 bg-slate-50 opacity-60'}`
              }>
              
              <span className="text-[13px] font-medium text-slate-700">
                Transparent background
                {!supportsTransparency && <span className="block text-[11px] text-slate-400">Not available for JPG</span>}
              </span>
              <input
                type="checkbox"
                disabled={!supportsTransparency}
                checked={transparent && supportsTransparency}
                onChange={(e) => setTransparent(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary-200" />
              
            </label>

            <div className="mt-4">
              <label htmlFor="export-character" className="mb-2 block text-[13px] font-medium text-slate-600">
                Character
              </label>
              <select
                id="export-character"
                value={character.id}
                onChange={(e) => setSelectedId(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white/80 px-3 text-[13px] text-slate-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100">
                
                {characters.map((c) =>
                <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                )}
              </select>
            </div>

            <Button fullWidth className="mt-5" icon={DownloadIcon} loading={exporting} onClick={runExport}>
              {exporting ? 'Preparing…' : 'Download asset'}
            </Button>
          </GlassCard>

          <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Recent exports</h2>
            {history.length === 0 ?
            <p className="mt-3 text-[13px] text-slate-500">Nothing exported yet in this session.</p> :

            <ul className="mt-3 space-y-2">
                {history.map((item, i) =>
              <li key={`${item}-${i}`} className="flex items-center gap-2 text-[13px] text-slate-600">
                    <CheckCircle2Icon className="h-4 w-4 text-success" />
                    <span className="truncate">{item}</span>
                  </li>
              )}
              </ul>
            }
          </GlassCard>
        </div>
      </div>
    </div>);

}