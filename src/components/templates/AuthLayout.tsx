import { type ReactNode } from 'react';
import { Logo } from '@/components/atoms/Logo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[--color-paper]">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12
          bg-[--color-ink] text-[--color-paper] relative overflow-hidden"
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
            backgroundSize: '12px 12px',
          }}
        />

        <Logo size="lg" className="text-[--color-paper] relative z-10" />

        <div className="relative z-10">
          <blockquote className="font-serif text-2xl italic leading-relaxed text-[--color-paper]/90 mb-6">
            "The palest ink is better than the best memory."
          </blockquote>
          <p className="text-sm text-[--color-paper]/50 font-mono">— Chinese proverb</p>
        </div>

        <p className="text-xs text-[--color-paper]/30 font-mono relative z-10">
          mnemo · AI-powered note intelligence
        </p>
      </div>

      {/* Right auth form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo size="lg" />
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl text-[--color-ink] mb-1.5">{title}</h1>
            {subtitle && (
              <p className="text-sm text-[--color-ink-mute] leading-relaxed">{subtitle}</p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
