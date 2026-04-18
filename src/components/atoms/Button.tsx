import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[--color-ink] text-[--color-paper] hover:bg-[--color-ink-soft] active:scale-[0.98]',
  secondary:
    'bg-[--color-paper-warm] text-[--color-ink] border border-[--color-border] hover:bg-[--color-paper-mid] active:scale-[0.98]',
  ghost: 'text-[--color-ink-soft] hover:bg-[--color-paper-warm] active:scale-[0.98]',
  danger: 'bg-[--color-crimson] text-black font-bold hover:opacity-90 active:scale-[0.98]',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-[--radius-sm]',
  md: 'px-4 py-2 text-sm rounded-[--radius-md]',
  lg: 'px-6 py-3 text-base rounded-[--radius-md]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-sans font-medium',
          'transition-all duration-150 cursor-pointer select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
