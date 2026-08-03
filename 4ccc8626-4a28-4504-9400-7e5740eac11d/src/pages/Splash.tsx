import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PaletteIcon } from 'lucide-react';
import { CharacterCanvas } from '../components/three/CharacterCanvas';
import { characters } from '../data/characters';
import { Button } from '../components/ui/Button';

const STEPS = ['Loading design tokens', 'Preparing 3D renderer', 'Syncing character library'];

export function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(8);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 6 + Math.random() * 8);
        setStep(next > 70 ? 2 : next > 38 ? 1 : 0);
        return next;
      });
    }, 220);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = window.setTimeout(() => navigate('/login'), 520);
      return () => window.clearTimeout(t);
    }
  }, [progress, navigate]);

  return (
    <div className="relative grid min-h-screen w-full place-items-center overflow-hidden bg-canvas">
      <div className="aurora" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-strong relative z-10 w-full max-w-lg rounded-4xl p-10 text-center shadow-glass">
        
        <div className="mx-auto flex items-center justify-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-lift">
            <PaletteIcon className="h-6 w-6" />
          </span>
          <div className="text-left">
            <p className="font-display text-lg font-semibold leading-tight text-slate-900">
              Cartoon Character Designer
            </p>
            <p className="text-[12px] text-slate-500">Enterprise Edition 4.2</p>
          </div>
        </div>

        <div className="mt-8 h-56 overflow-hidden rounded-3xl bg-white/60">
          <CharacterCanvas config={characters[0].config} mode="3d" environment="studio" interactive={false} idle />
        </div>

        <div className="mt-8">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.24 }} />
            
          </div>
          <div className="mt-3 flex items-center justify-between text-[12px] text-slate-500">
            <span aria-live="polite">{STEPS[step]}…</span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="mt-6" onClick={() => navigate('/login')}>
          Skip intro
        </Button>
      </motion.div>
    </div>);

}