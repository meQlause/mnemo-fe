import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-md">
      <Modal.Body className="flex flex-col items-center text-center py-10">
        <div 
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300",
            variant === 'danger' ? "bg-[--color-crimson-soft]" : "bg-[--color-accent-soft]"
          )}
        >
          <AlertTriangle 
            className={cn(
              "w-8 h-8",
              variant === 'danger' ? "text-[--color-crimson]" : "text-[--color-accent]"
            )} 
          />
        </div>
        
        <h3 className="font-serif text-3xl text-[--color-ink] mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-[--color-ink-soft] leading-relaxed max-w-[320px] mx-auto">
          {description}
        </p>
      </Modal.Body>
      
      <Modal.Footer className="bg-[--color-paper-light] border-none px-8 pb-8 pt-0 flex-col gap-3">
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={isLoading}
          className="w-full h-12 text-sm font-bold uppercase tracking-[0.2em]"
        >
          {confirmText}
        </Button>
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
          className="w-full h-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[--color-ink-mute] hover:text-[--color-ink]"
        >
          {cancelText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
