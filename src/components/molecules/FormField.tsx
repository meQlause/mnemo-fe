import { type ReactNode } from 'react';

interface FormFieldProps {
  children: ReactNode;
  hint?: string;
}

export function FormField({ children, hint }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {children}
      {hint && <p className="text-xs text-[--color-ink-mute] leading-relaxed">{hint}</p>}
    </div>
  );
}
