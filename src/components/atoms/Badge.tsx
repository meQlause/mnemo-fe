import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'accent' | 'emerald' | 'crimson' | 'sky';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[--color-paper-mid] text-[--color-ink-soft]',
  accent: 'bg-[--color-accent-soft] text-[--color-accent]',
  emerald: 'bg-[--color-emerald-soft] text-[--color-emerald]',
  crimson: 'bg-[--color-crimson-soft] text-[--color-crimson]',
  sky: 'bg-[--color-sky-soft] text-[--color-sky]',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-mono',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
