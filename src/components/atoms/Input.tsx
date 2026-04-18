import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[--color-ink-soft] uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3.5 py-2.5 font-sans text-sm',
            'bg-[--color-surface] border border-[--color-border]',
            'rounded-[--radius-md] text-[--color-ink]',
            'placeholder:text-[--color-ink-mute]',
            'focus:outline-none focus:border-[--color-ink] focus:ring-1 focus:ring-[--color-ink]',
            'transition-all duration-150',
            error &&
              'border-[--color-crimson] focus:border-[--color-crimson] focus:ring-[--color-crimson]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[--color-crimson]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
