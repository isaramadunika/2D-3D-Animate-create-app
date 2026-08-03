import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CopyIcon, EyeIcon, PencilIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import { Character } from '../types/character';
import { CharacterThumb } from './CharacterThumb';
import { Badge } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';

const STATUS_TONE = {
  published: 'success',
  draft: 'neutral',
  review: 'accent'
} as const;

interface Props {
  character: Character;
  index?: number;
  onDuplicate: (id: string) => void;
  onDelete: (character: Character) => void;
}

export function CharacterCard({ character, index = 0, onDuplicate, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="glass group flex flex-col overflow-hidden rounded-3xl shadow-glass">
      
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-b from-primary-50/70 to-white">
        <CharacterThumb config={character.config} label={character.name} className="h-40 w-40" />
        <div className="absolute left-3 top-3">
          <Badge tone={STATUS_TONE[character.status]}>{character.status}</Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center gap-1.5 pb-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          {[
          { label: 'Edit', icon: PencilIcon, action: () => navigate(`/app/editor/${character.id}`) },
          { label: 'View in 3D', icon: EyeIcon, action: () => navigate(`/app/viewer?id=${character.id}`) },
          { label: 'Duplicate', icon: CopyIcon, action: () => onDuplicate(character.id) },
          { label: 'Delete', icon: Trash2Icon, action: () => onDelete(character) }].
          map((action) =>
          <Tooltip key={action.label} label={action.label}>
              <button
              onClick={action.action}
              aria-label={`${action.label} ${character.name}`}
              className={`grid h-9 w-9 place-items-center rounded-xl bg-white/90 shadow-soft transition-all hover:scale-105 ${
              action.label === 'Delete' ? 'text-danger hover:bg-danger-50' : 'text-slate-600 hover:text-primary'}`
              }>
              
                <action.icon className="h-4 w-4" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate font-display text-[15px] font-semibold text-slate-900">{character.name}</h3>
        <p className="mt-0.5 text-[12px] capitalize text-slate-500">
          {character.type} · updated {character.updatedAt}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {character.tags.map((tag) =>
          <Badge key={tag} tone="primary">
              {tag}
            </Badge>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 text-[12px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <UsersIcon className="h-3.5 w-3.5" />
            {character.usedIn} game{character.usedIn === 1 ? '' : 's'}
          </span>
          <span className="truncate">{character.author}</span>
        </div>
      </div>
    </motion.article>);

}