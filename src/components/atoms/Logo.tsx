import { cn } from '@/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <span
      className={cn(
        'font-serif italic tracking-tight text-[--color-ink] select-none',
        sizes[size],
        className
      )}
    >
      {size === 'sm' ? 'm' : 'mnemo'}
    </span>
  );
}
