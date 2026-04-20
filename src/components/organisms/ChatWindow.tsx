import { useRef, useEffect, useState } from 'react';
import { Send, Trash2, Check } from 'lucide-react';
import { ChatBubble } from '@/components/molecules/ChatBubble';
import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/atoms/Modal';
import { Badge } from '@/components/atoms/Badge';
import { Markdown } from '@/components/atoms/Markdown';
import { useChatStore } from '@/stores/chatStore';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/utils/cn';
import type { Note } from '@/utils/types';

export function ChatWindow() {
  const messages = useChatStore((s) => s.messages);
  const clearMessages = useChatStore((s) => s.clearMessages);
  const { sendMessage, isStreaming } = useChat();
  const [input, setInput] = useState('');
  const [previewNote, setPreviewNote] = useState<Partial<Note> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectNote = async (id: number) => {
    // Dismiss modal if open
    setPreviewNote(null);
    
    // We want to send the SAME question but with the selectedNoteId
    // We need to find the last user message to get the question
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      await sendMessage(lastUserMsg.content, id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[--color-border] shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-[--color-ink]">Chat with your notes</h2>
          <p className="text-xs text-[--color-ink-mute]">Ask anything about your notes</p>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearMessages}>
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 flex flex-col gap-5 border-b-0 md:border-b border-[--color-border-soft]">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="w-12 h-12 rounded-full bg-[--color-accent-soft] flex items-center justify-center mb-4">
              <span className="text-xl">✦</span>
            </div>
            <h3 className="font-serif text-xl text-[--color-ink] mb-2">Ask your notes anything</h3>
            <p className="text-sm text-[--color-ink-mute] max-w-xs leading-relaxed">
              I'll search through your notes and provide answers based on what you've written.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            message={msg} 
            onSelectNote={handleSelectNote}
            onViewNote={setPreviewNote}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t-0 md:border-t border-[--color-border] shrink-0">
        <div
          className={cn(
            'flex items-end gap-3 bg-[--color-surface] border rounded-[--radius-lg] px-4 py-3',
            'transition-all duration-150',
            'focus-within:border-[--color-ink] focus-within:shadow-[--shadow-sm]',
            'border-[--color-border]'
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your notes… (Enter to send)"
            rows={1}
            className="flex-1 resize-none text-sm text-[--color-ink] bg-transparent
              placeholder:text-[--color-ink-mute] focus:outline-none leading-relaxed
              max-h-32 font-sans"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
              'transition-all duration-150',
              input.trim() && !isStreaming
                ? 'bg-[--color-ink] text-[--color-paper] hover:bg-[--color-ink-soft]'
                : 'bg-[--color-paper-mid] text-[--color-ink-mute] cursor-not-allowed'
            )}
          >
            {isStreaming ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-xs text-[--color-ink-mute] mt-2 text-center">Shift+Enter for new line</p>
      </div>

      {/* Note Selection Modal */}
      <Modal 
        isOpen={!!previewNote} 
        onClose={() => setPreviewNote(null)}
        title={previewNote?.title || 'Note Details'}
        className="max-w-2xl"
      >
        <Modal.Body className="max-h-[60vh] overflow-y-auto">
          {previewNote && (
            <div className="flex flex-col gap-4">
              {previewNote.tags && previewNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previewNote.tags.map(tag => (
                    <Badge key={tag} className="text-[10px] uppercase tracking-wider">{tag}</Badge>
                  ))}
                </div>
              )}
              
              {previewNote.sentiment && (
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[--color-ink-soft]">
                  <span>Sentiment:</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full border",
                    previewNote.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    previewNote.sentiment === 'negative' ? 'bg-crimson-50 text-crimson-600 border-crimson-100' :
                    'bg-slate-50 text-slate-600 border-slate-100'
                  )}>
                    {previewNote.sentiment}
                  </span>
                </div>
              )}

              <div className="prose prose-sm max-w-none mt-2">
                <Markdown content={previewNote.content || ''} />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreviewNote(null)}>
            Close
          </Button>
          <Button 
            onClick={() => previewNote?.id && handleSelectNote(previewNote.id)}
            disabled={!previewNote?.id}
          >
            <Check className="w-3.5 h-3.5 mr-2" />
            Select this Note
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
