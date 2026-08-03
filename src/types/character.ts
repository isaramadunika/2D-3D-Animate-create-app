export type CharacterType = 'animal' | 'plant' | 'human';

export type BodyShape = 'round' | 'tall' | 'square' | 'pear';

export type EyeStyle = 'round' | 'oval' | 'happy' | 'sleepy';
export type NoseStyle = 'button' | 'snout' | 'none';
export type MouthStyle = 'smile' | 'open' | 'neutral' | 'grin';
export type HairStyle = 'none' | 'short' | 'curly' | 'spiky' | 'ponytail';
export type ClothesStyle = 'none' | 'tshirt' | 'overalls' | 'cape';
export type AccessoryStyle = 'none' | 'hat' | 'glasses' | 'bowtie' | 'headphones';

export interface CharacterConfig {
  type: CharacterType;
  bodyShape: BodyShape;
  bodyColor: string;
  bodySize: number;
  headSize: number;
  headColor: string;
  eyeStyle: EyeStyle;
  eyeSize: number;
  eyeColor: string;
  noseStyle: NoseStyle;
  noseSize: number;
  mouthStyle: MouthStyle;
  mouthSize: number;
  hairStyle: HairStyle;
  hairColor: string;
  clothesStyle: ClothesStyle;
  clothesColor: string;
  accessory: AccessoryStyle;
  accessoryColor: string;
}

export type CharacterStatus = 'published' | 'draft' | 'review';

export interface Character {
  id: string;
  name: string;
  type: CharacterType;
  status: CharacterStatus;
  tags: string[];
  author: string;
  updatedAt: string;
  createdAt: string;
  usedIn: number;
  config: CharacterConfig;
}

export const DEFAULT_CONFIG: CharacterConfig = {
  type: 'animal',
  bodyShape: 'round',
  bodyColor: '#4F46E5',
  bodySize: 1,
  headSize: 1,
  headColor: '#6366F1',
  eyeStyle: 'round',
  eyeSize: 1,
  eyeColor: '#0F172A',
  noseStyle: 'button',
  noseSize: 1,
  mouthStyle: 'smile',
  mouthSize: 1,
  hairStyle: 'none',
  hairColor: '#F59E0B',
  clothesStyle: 'tshirt',
  clothesColor: '#06B6D4',
  accessory: 'none',
  accessoryColor: '#F59E0B'
};

export const PRESET_COLORS = [
'#4F46E5',
'#6366F1',
'#06B6D4',
'#22D3EE',
'#F59E0B',
'#FBBF24',
'#22C55E',
'#4ADE80',
'#EF4444',
'#F472B6',
'#A855F7',
'#0F172A',
'#64748B',
'#E2E8F0',
'#FFFFFF',
'#8B5A2B'];


export const CHARACTER_TYPE_LABEL: Record<CharacterType, string> = {
  animal: 'Animal',
  plant: 'Plant',
  human: 'Human'
};