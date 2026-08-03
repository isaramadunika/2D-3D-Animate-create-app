import React from 'react';
import {
  CatIcon,
  CircleIcon,
  EyeIcon,
  GlassesIcon,
  LeafIcon,
  MaximizeIcon,
  ScissorsIcon,
  ShirtIcon,
  SmileIcon,
  SquareIcon,
  TriangleIcon,
  UserIcon } from
'lucide-react';
import {
  AccessoryStyle,
  BodyShape,
  CharacterConfig,
  CharacterType,
  ClothesStyle,
  EyeStyle,
  HairStyle,
  MouthStyle,
  NoseStyle } from
'../../types/character';
import { Accordion } from './Accordion';
import { OptionGrid } from './OptionGrid';
import { ColorPicker } from '../ui/ColorPicker';
import { LabeledSlider } from '../ui/LabeledSlider';

interface Props {
  config: CharacterConfig;
  set: (patch: Partial<CharacterConfig>) => void;
}

export function CharacterControls({ config, set }: Props) {
  return (
    <div className="space-y-3">
      <Accordion
        title="Character type"
        icon={CatIcon}
        defaultOpen
        summary={`${config.type} · ${config.bodyShape} body`}>
        
        <OptionGrid<CharacterType>
          label="Type"
          value={config.type}
          onChange={(type) => set({ type })}
          options={[
          { value: 'animal', label: 'Animal', icon: CatIcon, hint: 'Adds ears and a muzzle' },
          { value: 'plant', label: 'Plant', icon: LeafIcon, hint: 'Adds leaves and a stem' },
          { value: 'human', label: 'Human', icon: UserIcon, hint: 'Adds hairstyles' }]
          } />
        
        <OptionGrid<BodyShape>
          label="Body shape"
          value={config.bodyShape}
          onChange={(bodyShape) => set({ bodyShape })}
          columns={4}
          options={[
          { value: 'round', label: 'Round', icon: CircleIcon },
          { value: 'tall', label: 'Tall', icon: TriangleIcon },
          { value: 'square', label: 'Square', icon: SquareIcon },
          { value: 'pear', label: 'Pear', icon: CircleIcon }]
          } />
        
        <ColorPicker label="Body colour" value={config.bodyColor} onChange={(bodyColor) => set({ bodyColor })} />
      </Accordion>

      <Accordion title="Head & face" icon={SmileIcon} summary={`${config.eyeStyle} eyes · ${config.mouthStyle} mouth`}>
        <ColorPicker label="Head colour" value={config.headColor} onChange={(headColor) => set({ headColor })} />
        <OptionGrid<EyeStyle>
          label="Eyes"
          value={config.eyeStyle}
          onChange={(eyeStyle) => set({ eyeStyle })}
          columns={4}
          options={[
          { value: 'round', label: 'Round', icon: EyeIcon },
          { value: 'oval', label: 'Oval', icon: EyeIcon },
          { value: 'happy', label: 'Happy', icon: EyeIcon },
          { value: 'sleepy', label: 'Sleepy', icon: EyeIcon }]
          } />
        
        <ColorPicker label="Eye colour" value={config.eyeColor} onChange={(eyeColor) => set({ eyeColor })} />
        <OptionGrid<NoseStyle>
          label="Nose"
          value={config.noseStyle}
          onChange={(noseStyle) => set({ noseStyle })}
          options={[
          { value: 'button', label: 'Button' },
          { value: 'snout', label: 'Snout' },
          { value: 'none', label: 'None' }]
          } />
        
        <OptionGrid<MouthStyle>
          label="Mouth"
          value={config.mouthStyle}
          onChange={(mouthStyle) => set({ mouthStyle })}
          columns={4}
          options={[
          { value: 'smile', label: 'Smile' },
          { value: 'grin', label: 'Grin' },
          { value: 'open', label: 'Open' },
          { value: 'neutral', label: 'Neutral' }]
          } />
        
      </Accordion>

      <Accordion title="Hair & style" icon={ScissorsIcon} summary={config.hairStyle}>
        <OptionGrid<HairStyle>
          label="Hairstyle"
          value={config.hairStyle}
          onChange={(hairStyle) => set({ hairStyle })}
          options={[
          { value: 'none', label: 'None' },
          { value: 'short', label: 'Short' },
          { value: 'curly', label: 'Curly' },
          { value: 'spiky', label: 'Spiky' },
          { value: 'ponytail', label: 'Ponytail' }]
          } />
        
        <ColorPicker label="Hair / leaf colour" value={config.hairColor} onChange={(hairColor) => set({ hairColor })} />
      </Accordion>

      <Accordion title="Clothes" icon={ShirtIcon} summary={config.clothesStyle}>
        <OptionGrid<ClothesStyle>
          label="Outfit"
          value={config.clothesStyle}
          onChange={(clothesStyle) => set({ clothesStyle })}
          columns={4}
          options={[
          { value: 'none', label: 'None' },
          { value: 'tshirt', label: 'T-shirt' },
          { value: 'overalls', label: 'Overalls' },
          { value: 'cape', label: 'Cape' }]
          } />
        
        <ColorPicker
          label="Outfit colour"
          value={config.clothesColor}
          onChange={(clothesColor) => set({ clothesColor })} />
        
      </Accordion>

      <Accordion title="Accessories" icon={GlassesIcon} summary={config.accessory}>
        <OptionGrid<AccessoryStyle>
          label="Accessory"
          value={config.accessory}
          onChange={(accessory) => set({ accessory })}
          options={[
          { value: 'none', label: 'None' },
          { value: 'hat', label: 'Hat' },
          { value: 'glasses', label: 'Glasses' },
          { value: 'bowtie', label: 'Bow tie' },
          { value: 'headphones', label: 'Headset' }]
          } />
        
        <ColorPicker
          label="Accessory colour"
          value={config.accessoryColor}
          onChange={(accessoryColor) => set({ accessoryColor })} />
        
      </Accordion>

      <Accordion title="Proportions" icon={MaximizeIcon} summary="Resize head, body and features">
        <LabeledSlider label="Body size" value={config.bodySize} onChange={(bodySize) => set({ bodySize })} />
        <LabeledSlider label="Head size" value={config.headSize} onChange={(headSize) => set({ headSize })} />
        <LabeledSlider label="Eye size" value={config.eyeSize} onChange={(eyeSize) => set({ eyeSize })} />
        <LabeledSlider label="Nose size" value={config.noseSize} onChange={(noseSize) => set({ noseSize })} />
        <LabeledSlider label="Mouth size" value={config.mouthSize} onChange={(mouthSize) => set({ mouthSize })} />
      </Accordion>
    </div>);

}