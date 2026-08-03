import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside';
  padded?: boolean;
  strong?: boolean;
}

export function GlassCard({
  children,
  className = '',
  as = 'div',
  padded = true,
  strong = false
}: Props) {
  const Tag = as;
  return (
    <Tag
      className={[
      strong ? 'glass-strong' : 'glass',
      'rounded-3xl shadow-glass',
      padded ? 'p-6' : '',
      className].
      join(' ')}>
      
      {children}
    </Tag>);

}