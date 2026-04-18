import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-[--color-crimson-soft] border border-[--color-crimson]/20 rounded-[--radius-md] text-sm text-[--color-crimson]">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span className="flex-1 leading-relaxed">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
