import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ComponentType<{className?: string;}>;
  iconRight?: React.ComponentType<{className?: string;}>;
  fullWidth?: boolean;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-700 shadow-lift',
  secondary: 'bg-secondary text-white hover:bg-secondary-600 shadow-soft',
  ghost: 'text-slate-600 hover:bg-white/70 hover:text-primary',
  outline: 'border border-slate-200 bg-white/70 text-slate-700 hover:border-primary-300 hover:text-primary',
  danger: 'bg-danger text-white hover:bg-danger-600 shadow-soft',
  success: 'bg-success text-white hover:bg-success-600 shadow-soft'
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
  icon: 'h-10 w-10 justify-center'
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  fullWidth,
  loading,
  className = '',
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={[
      'inline-flex items-center rounded-xl font-medium transition-all duration-200',
      'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
      VARIANTS[variant],
      SIZES[size],
      fullWidth ? 'w-full justify-center' : '',
      className].
      join(' ')}>
      
      {loading ?
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> :

      Icon && <Icon className="h-4 w-4 shrink-0" />
      }
      {children}
      {IconRight && <IconRight className="h-4 w-4 shrink-0" />}
    </button>);

}