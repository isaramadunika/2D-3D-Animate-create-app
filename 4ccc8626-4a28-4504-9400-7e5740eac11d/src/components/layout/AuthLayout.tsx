import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon, PaletteIcon } from 'lucide-react';
import { CharacterCanvas } from '../three/CharacterCanvas';
import { characters } from '../../data/characters';

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  highlights?: string[];
}

export function AuthLayout({ title, subtitle, children, footer, highlights }: Props) {
  const bullets =
  highlights ??
  ['2D and 3D character preview on one canvas', 'Shared template library for every classroom game', 'Export to PNG, JPG and SVG in one click'];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-canvas">
      <div className="aurora" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:px-12">
        {/* Left: brand + live 3D character */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden h-full flex-col justify-center lg:flex">
          
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white shadow-lift">
              <PaletteIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-[17px] font-semibold text-slate-900">Cartoon Character Designer</p>
              <p className="text-[12px] text-slate-500">BrightPlay Educational Games · Enterprise</p>
            </div>
          </div>

          <div className="glass mt-8 h-[380px] overflow-hidden rounded-4xl shadow-glass">
            <CharacterCanvas
              config={characters[0].config}
              mode="3d"
              environment="studio"
              interactive
              idle />
            
          </div>

          <ul className="mt-8 space-y-3">
            {bullets.map((item) =>
            <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success-50 text-success">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {item}
              </li>
            )}
          </ul>
        </motion.section>

        {/* Right: form card */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto w-full max-w-md">
          
          <div className="glass-strong rounded-4xl p-8 shadow-glass">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white">
                <PaletteIcon className="h-5 w-5" />
              </span>
              <p className="font-display text-[15px] font-semibold text-slate-900">Cartoon Character Designer</p>
            </div>
            <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
          {footer && <div className="mt-6 text-center text-[13px] text-slate-500">{footer}</div>}
          <p className="mt-6 text-center text-[11px] text-slate-400">
            <Link to="/app/help" className="hover:text-primary">
              Help centre
            </Link>
            {' · '}
            Accessibility statement · WCAG 2.1 AA
          </p>
        </motion.section>
      </div>
    </div>);

}