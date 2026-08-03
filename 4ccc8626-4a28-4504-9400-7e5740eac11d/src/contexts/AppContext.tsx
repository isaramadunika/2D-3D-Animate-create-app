import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Character, CharacterConfig } from '../types/character';
import { characters as seedCharacters } from '../data/characters';

export type Role = 'designer' | 'admin';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone: 'success' | 'error' | 'info';
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  userName: string;
  characters: Character[];
  getCharacter: (id: string) => Character | undefined;
  createCharacter: (name: string, config: CharacterConfig) => Character;
  updateCharacter: (id: string, patch: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  duplicateCharacter: (id: string) => Character | undefined;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  notifications: AppNotification[];
  markAllRead: () => void;
}

const AppContext = createContext<AppState | null>(null);

const seedNotifications: AppNotification[] = [
{
  id: 'n1',
  title: 'Pip the Bunny needs review',
  body: 'Lena Fischer requested your approval before publishing.',
  time: '5 min ago',
  read: false
},
{
  id: 'n2',
  title: 'Export finished',
  body: 'milo-fox.svg is ready to download.',
  time: '1 hour ago',
  read: false
},
{
  id: 'n3',
  title: 'New template available',
  body: '“Classroom Kid” was updated by Curriculum team.',
  time: 'Yesterday',
  read: true
}];


export function AppProvider({ children }: {children: React.ReactNode;}) {
  const [role, setRole] = useState<Role>('designer');
  const [characters, setCharacters] = useState<Character[]>(seedCharacters);
  const [activeId, setActiveId] = useState<string | null>(seedCharacters[0].id);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);

  const pushToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `t-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getCharacter = useCallback(
    (id: string) => characters.find((c) => c.id === id),
    [characters]
  );

  const createCharacter = useCallback((name: string, config: CharacterConfig) => {
    const today = new Date().toISOString().slice(0, 10);
    const character: Character = {
      id: `chr-${Math.floor(Math.random() * 9000 + 1000)}`,
      name,
      type: config.type,
      status: 'draft',
      tags: ['New'],
      author: 'Aisha Rahman',
      createdAt: today,
      updatedAt: today,
      usedIn: 0,
      config
    };
    setCharacters((prev) => [character, ...prev]);
    setActiveId(character.id);
    return character;
  }, []);

  const updateCharacter = useCallback((id: string, patch: Partial<Character>) => {
    setCharacters((prev) =>
    prev.map((c) =>
    c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString().slice(0, 10) } : c
    )
    );
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setActiveId((prev) => prev === id ? null : prev);
  }, []);

  const duplicateCharacter = useCallback(
    (id: string) => {
      const source = characters.find((c) => c.id === id);
      if (!source) return undefined;
      const copy: Character = {
        ...source,
        id: `chr-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: `${source.name} (copy)`,
        status: 'draft',
        usedIn: 0,
        updatedAt: new Date().toISOString().slice(0, 10)
      };
      setCharacters((prev) => [copy, ...prev]);
      return copy;
    },
    [characters]
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      role,
      setRole,
      userName: role === 'admin' ? 'Marcus Lee' : 'Aisha Rahman',
      characters,
      getCharacter,
      createCharacter,
      updateCharacter,
      deleteCharacter,
      duplicateCharacter,
      activeId,
      setActiveId,
      toasts,
      pushToast,
      dismissToast,
      notifications,
      markAllRead
    }),
    [
    role,
    characters,
    getCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    duplicateCharacter,
    activeId,
    toasts,
    pushToast,
    dismissToast,
    notifications,
    markAllRead]

  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}