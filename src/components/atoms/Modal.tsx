import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  className,
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[--color-ink]/60 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full max-w-md bg-[--color-paper-light] rounded-[--radius-lg] shadow-2xl',
          'border border-[--color-border-soft] overflow-hidden',
          'animate-in zoom-in-95 duration-200',
          className
        )}
      >
        {/* Backward compatible header - Only shows if children doesn't manage its own Header */}
        {title && <Modal.Header title={title} onClose={showCloseButton ? onClose : undefined} />}

        {children}
      </div>
    </div>,
    document.body
  );
}

Modal.Header = function ModalHeader({
  title,
  onClose,
  className,
}: {
  title: string | ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-[--color-border-soft] bg-[--color-paper-warm]/30',
        className
      )}
    >
      {typeof title === 'string' ? (
        <h3 className="font-serif text-xl text-[--color-ink] leading-none">{title}</h3>
      ) : (
        title
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[--color-crimson-soft] hover:text-[--color-crimson] text-[--color-ink-mute] transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('px-6 py-6', className)}>{children}</div>;
};

Modal.Footer = function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-[--color-paper-warm]/20 border-t border-[--color-border-soft] flex flex-col sm:flex-row justify-end gap-3',
        className
      )}
    >
      {children}
    </div>
  );
};
