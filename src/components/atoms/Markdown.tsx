import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/utils/cn';

interface MarkdownProps {
  content: string;
  className?: string;
  compact?: boolean;
}

export function Markdown({ content, className, compact = false }: MarkdownProps) {
  return (
    <div
      className={cn(
        'prose prose-sm max-w-none wrap-break-words leading-relaxed',
        // Custom classes for our "Paper & Ink" theme
        'prose-headings:font-serif prose-headings:text-[--color-ink] prose-headings:mb-3 prose-headings:mt-6 first:prose-headings:mt-0',
        'prose-p:text-[--color-ink-soft] prose-p:mb-3 last:prose-p:mb-0',
        'prose-strong:text-[--color-ink] prose-strong:font-semibold',
        'prose-em:italic',
        'prose-ul:list-disc prose-ul:my-4 prose-ul:pl-5',
        'prose-ol:list-decimal prose-ol:my-4 prose-ol:pl-5',
        'prose-li:text-[--color-ink-soft] prose-li:my-1',
        'prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:bg-[--color-paper-mid] prose-code:text-[--color-ink] prose-code:font-mono prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-[--color-paper-mid] prose-pre:border prose-pre:border-[--color-border-soft] prose-pre:rounded-[--radius-md] prose-pre:p-4 prose-pre:my-6',
        'prose-pre:shadow-sm',
        'prose-blockquote:border-l-4 prose-blockquote:border-[--color-accent] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[--color-ink-mute] prose-blockquote:my-6',
        'prose-hr:border-[--color-border-soft] prose-hr:my-8',
        'prose-a:text-[--color-accent] prose-a:no-underline hover:prose-a:underline',
        compact && 'text-sm prose-p:mb-1.5 prose-headings:mt-3 prose-headings:mb-1.5 prose-headings:text-base',
        className
      )}
    >
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
