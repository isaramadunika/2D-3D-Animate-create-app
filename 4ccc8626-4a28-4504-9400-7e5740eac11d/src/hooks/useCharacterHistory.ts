import { useCallback, useState } from 'react';
import { CharacterConfig } from '../types/character';

interface History {
  past: CharacterConfig[];
  present: CharacterConfig;
  future: CharacterConfig[];
}

export function useCharacterHistory(initial: CharacterConfig) {
  const [history, setHistory] = useState<History>({ past: [], present: initial, future: [] });

  const set = useCallback((patch: Partial<CharacterConfig>) => {
    setHistory((h) => {
      const next = { ...h.present, ...patch };
      const changed = Object.keys(patch).some(
        (key) => h.present[key as keyof CharacterConfig] !== patch[key as keyof CharacterConfig]
      );
      if (!changed) return h;
      return { past: [...h.past, h.present].slice(-40), present: next, future: [] };
    });
  }, []);

  const replace = useCallback((config: CharacterConfig) => {
    setHistory({ past: [], present: config, future: [] });
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.past.length) return h;
      const previous = h.past[h.past.length - 1];
      return {
        past: h.past.slice(0, -1),
        present: previous,
        future: [h.present, ...h.future].slice(0, 40)
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((h) => {
      if (!h.future.length) return h;
      const [next, ...rest] = h.future;
      return { past: [...h.past, h.present], present: next, future: rest };
    });
  }, []);

  return {
    config: history.present,
    set,
    replace,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    steps: history.past.length
  };
}