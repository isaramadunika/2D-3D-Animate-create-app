import React from 'react';
import { CharacterConfig } from '../types/character';

interface Props {
  config: CharacterConfig;
  className?: string;
  label?: string;
}

/**
 * Lightweight SVG thumbnail used in grids and lists.
 * Keeps library views fast — the full Three.js canvas is reserved for the
 * editor and viewer surfaces.
 */
export function CharacterThumb({ config, className = '', label }: Props) {
  const bodyW = 34 * config.bodySize * (config.bodyShape === 'tall' ? 0.85 : config.bodyShape === 'pear' ? 1.15 : 1);
  const bodyH = 32 * config.bodySize * (config.bodyShape === 'tall' ? 1.3 : 1);
  const headR = 24 * config.headSize;
  const cx = 60;
  const bodyCy = 96;
  const headCy = bodyCy - bodyH * 0.72 - headR * 0.55;
  const eyeDx = headR * 0.4;
  const eyeR = 4.6 * config.eyeSize;
  const eyeRy = config.eyeStyle === 'happy' ? eyeR * 0.5 : config.eyeStyle === 'sleepy' ? eyeR * 0.34 : config.eyeStyle === 'oval' ? eyeR * 1.25 : eyeR;
  const mouthW = 12 * config.mouthSize;

  return (
    <svg
      viewBox="0 0 120 130"
      className={className}
      role="img"
      aria-label={label ? `${label} preview` : 'Character preview'}>
      
      {/* ground shadow */}
      <ellipse cx={cx} cy={124} rx={bodyW * 0.9} ry={5} fill="#0F172A" opacity="0.08" />

      {/* animal ears / plant leaves */}
      {config.type === 'animal' &&
      <>
          <ellipse cx={cx - headR * 0.62} cy={headCy - headR * 0.8} rx={headR * 0.24} ry={headR * 0.4} fill={config.headColor} />
          <ellipse cx={cx + headR * 0.62} cy={headCy - headR * 0.8} rx={headR * 0.24} ry={headR * 0.4} fill={config.headColor} />
          <ellipse cx={cx - headR * 0.62} cy={headCy - headR * 0.78} rx={headR * 0.12} ry={headR * 0.24} fill={config.bodyColor} />
          <ellipse cx={cx + headR * 0.62} cy={headCy - headR * 0.78} rx={headR * 0.12} ry={headR * 0.24} fill={config.bodyColor} />
        </>
      }
      {config.type === 'plant' &&
      <>
          <rect x={cx - 1.4} y={headCy - headR * 1.5} width={2.8} height={headR * 0.6} fill="#16A34A" rx={1.4} />
          <ellipse cx={cx - headR * 0.6} cy={headCy - headR * 1.05} rx={headR * 0.5} ry={headR * 0.2} fill={config.hairColor} transform={`rotate(-25 ${cx - headR * 0.6} ${headCy - headR * 1.05})`} />
          <ellipse cx={cx + headR * 0.6} cy={headCy - headR * 1.05} rx={headR * 0.5} ry={headR * 0.2} fill={config.hairColor} transform={`rotate(25 ${cx + headR * 0.6} ${headCy - headR * 1.05})`} />
        </>
      }

      {/* body */}
      {config.bodyShape === 'square' ?
      <rect
        x={cx - bodyW}
        y={bodyCy - bodyH}
        width={bodyW * 2}
        height={bodyH * 1.7}
        rx={12}
        fill={config.bodyColor} /> :


      <ellipse cx={cx} cy={bodyCy - bodyH * 0.15} rx={bodyW} ry={bodyH} fill={config.bodyColor} />
      }

      {/* clothes */}
      {config.clothesStyle !== 'none' &&
      <path
        d={`M ${cx - bodyW * 0.98} ${bodyCy - bodyH * 0.1} a ${bodyW} ${bodyH} 0 0 0 ${bodyW * 1.96} 0 L ${cx + bodyW * 0.9} ${bodyCy + bodyH * 0.5} L ${cx - bodyW * 0.9} ${bodyCy + bodyH * 0.5} Z`}
        fill={config.clothesColor}
        opacity={config.clothesStyle === 'cape' ? 0.85 : 1} />

      }

      {/* arms */}
      <rect x={cx - bodyW - 7} y={bodyCy - bodyH * 0.5} width={7} height={18} rx={3.5} fill={config.bodyColor} />
      <rect x={cx + bodyW} y={bodyCy - bodyH * 0.5} width={7} height={18} rx={3.5} fill={config.bodyColor} />

      {/* head */}
      <circle cx={cx} cy={headCy} r={headR} fill={config.headColor} />

      {/* hair */}
      {config.hairStyle === 'short' &&
      <path d={`M ${cx - headR} ${headCy - headR * 0.25} A ${headR} ${headR} 0 0 1 ${cx + headR} ${headCy - headR * 0.25} Z`} fill={config.hairColor} />
      }
      {config.hairStyle === 'curly' &&
      [-0.7, -0.25, 0.25, 0.7].map((x) =>
      <circle key={x} cx={cx + x * headR} cy={headCy - headR * 0.72} r={headR * 0.3} fill={config.hairColor} />
      )}
      {config.hairStyle === 'spiky' &&
      [-0.7, -0.35, 0, 0.35, 0.7].map((x) =>
      <polygon
        key={x}
        points={`${cx + x * headR - 4},${headCy - headR * 0.7} ${cx + x * headR + 4},${headCy - headR * 0.7} ${cx + x * headR},${headCy - headR * 1.3}`}
        fill={config.hairColor} />

      )}
      {config.hairStyle === 'ponytail' &&
      <>
          <path d={`M ${cx - headR} ${headCy - headR * 0.25} A ${headR} ${headR} 0 0 1 ${cx + headR} ${headCy - headR * 0.25} Z`} fill={config.hairColor} />
          <ellipse cx={cx + headR * 0.95} cy={headCy - headR * 0.1} rx={headR * 0.26} ry={headR * 0.5} fill={config.hairColor} />
        </>
      }

      {/* eyes */}
      {[-1, 1].map((side) =>
      <g key={side}>
          <ellipse cx={cx + side * eyeDx} cy={headCy - headR * 0.12} rx={eyeR} ry={eyeRy} fill="#FFFFFF" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx={cx + side * eyeDx} cy={headCy - headR * 0.12} r={Math.min(eyeR, eyeRy) * 0.62} fill={config.eyeColor} />
        </g>
      )}

      {/* nose */}
      {config.noseStyle === 'button' && <circle cx={cx} cy={headCy + headR * 0.14} r={2.4 * config.noseSize} fill="#0F172A" />}
      {config.noseStyle === 'snout' &&
      <>
          <ellipse cx={cx} cy={headCy + headR * 0.24} rx={headR * 0.34 * config.noseSize} ry={headR * 0.22} fill="#FFFFFF" />
          <circle cx={cx} cy={headCy + headR * 0.2} r={2.2} fill="#0F172A" />
        </>
      }

      {/* mouth */}
      {(config.mouthStyle === 'smile' || config.mouthStyle === 'grin') &&
      <path
        d={`M ${cx - mouthW} ${headCy + headR * 0.42} Q ${cx} ${headCy + headR * 0.78} ${cx + mouthW} ${headCy + headR * 0.42}`}
        stroke="#0F172A"
        strokeWidth="2"
        fill={config.mouthStyle === 'grin' ? '#FFFFFF' : 'none'}
        strokeLinecap="round" />

      }
      {config.mouthStyle === 'open' &&
      <ellipse cx={cx} cy={headCy + headR * 0.5} rx={mouthW * 0.6} ry={mouthW * 0.45} fill="#0F172A" />
      }
      {config.mouthStyle === 'neutral' &&
      <line
        x1={cx - mouthW * 0.7}
        y1={headCy + headR * 0.48}
        x2={cx + mouthW * 0.7}
        y2={headCy + headR * 0.48}
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round" />

      }

      {/* accessories */}
      {config.accessory === 'hat' &&
      <>
          <rect x={cx - headR * 1.25} y={headCy - headR * 0.92} width={headR * 2.5} height={4} rx={2} fill={config.accessoryColor} />
          <rect x={cx - headR * 0.6} y={headCy - headR * 1.5} width={headR * 1.2} height={headR * 0.62} rx={4} fill={config.accessoryColor} />
        </>
      }
      {config.accessory === 'glasses' &&
      <>
          {[-1, 1].map((side) =>
        <circle
          key={side}
          cx={cx + side * eyeDx}
          cy={headCy - headR * 0.12}
          r={eyeR * 1.7}
          fill="none"
          stroke={config.accessoryColor}
          strokeWidth="1.8" />

        )}
          <line x1={cx - eyeDx + eyeR * 1.7} y1={headCy - headR * 0.12} x2={cx + eyeDx - eyeR * 1.7} y2={headCy - headR * 0.12} stroke={config.accessoryColor} strokeWidth="1.8" />
        </>
      }
      {config.accessory === 'bowtie' &&
      <>
          <polygon points={`${cx - 9},${headCy + headR + 2} ${cx - 1},${headCy + headR + 6} ${cx - 9},${headCy + headR + 10}`} fill={config.accessoryColor} />
          <polygon points={`${cx + 9},${headCy + headR + 2} ${cx + 1},${headCy + headR + 6} ${cx + 9},${headCy + headR + 10}`} fill={config.accessoryColor} />
          <circle cx={cx} cy={headCy + headR + 6} r={2.2} fill={config.accessoryColor} />
        </>
      }
      {config.accessory === 'headphones' &&
      <>
          <path
          d={`M ${cx - headR * 1.05} ${headCy} A ${headR * 1.05} ${headR * 1.05} 0 0 1 ${cx + headR * 1.05} ${headCy}`}
          stroke={config.accessoryColor}
          strokeWidth="3"
          fill="none" />
        
          <rect x={cx - headR * 1.2} y={headCy - 5} width={6} height={12} rx={3} fill={config.accessoryColor} />
          <rect x={cx + headR * 1.05} y={headCy - 5} width={6} height={12} rx={3} fill={config.accessoryColor} />
        </>
      }
    </svg>);

}