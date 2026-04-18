import { Editor, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import type { MarkdownStorage } from 'tiptap-markdown';
import { cn } from '@/utils/cn';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const buttons = [
    {
      icon: Bold,
      title: 'Bold (Ctrl+B)',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: Italic,
      title: 'Italic (Ctrl+I)',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: Heading1,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: Heading2,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: List,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: Quote,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-1.5 border-b border-[--color-border-soft] bg-[--color-paper-warm] sticky top-0 z-10">
      {buttons.map((btn, i) => (
        <button
          key={i}
          type="button"
          onClick={btn.action}
          title={btn.title}
          className={cn(
            'p-1.5 rounded-[--radius-sm] transition-all duration-75 active:scale-90 relative overflow-hidden group',
            btn.isActive
              ? 'bg-[--color-accent-soft] text-[--color-accent] shadow-inner'
              : 'text-[--color-ink-mute] hover:bg-[--color-paper-deep] hover:text-[--color-ink]'
          )}
        >
          {/* Click Animation Layer */}
          <span className="absolute inset-0 bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          <btn.icon className="w-3.5 h-3.5 relative z-10" />
        </button>
      ))}
      <div className="w-px h-4 bg-[--color-border-soft] mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-1.5 rounded-[--radius-sm] text-[--color-ink-mute] hover:bg-[--color-paper-deep] disabled:opacity-30 active:scale-95 transition-transform"
      >
        <Undo className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-1.5 rounded-[--radius-sm] text-[--color-ink-mute] hover:bg-[--color-paper-deep] disabled:opacity-30 active:scale-95 transition-transform"
      >
        <Redo className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function RichTextEditor({ content, onChange, placeholder, minHeight = '300px' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Ensure core functionality is explicitly configured
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[--color-accent] underline underline-offset-2',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
      Markdown.configure({
        html: false,
        linkify: true,
        breaks: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const storage = editor.storage as unknown as Record<string, MarkdownStorage>;
      const markdown = storage.markdown.getMarkdown();
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none p-4 min-h-[var(--min-height)]',
          'prose-headings:font-serif prose-headings:text-[--color-ink] prose-headings:font-bold',
          'prose-blockquote:border-l-4 prose-blockquote:border-[--color-accent] prose-blockquote:pl-4 prose-blockquote:italic',
          'prose-ul:list-disc prose-ol:list-decimal',
          'selection:bg-[--color-accent-soft]'
        ),
        style: `--min-height: ${minHeight}`,
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="border border-[--color-border] rounded-[--radius-md] overflow-hidden bg-[--color-surface] focus-within:border-[--color-ink] transition-all group/editor relative">
      <MenuBar editor={editor} />
      <div className="overflow-y-auto max-h-[600px]">
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--color-ink-mute);
          pointer-events: none;
          height: 0;
        }
        /* Fix for list styles in editor */
        .tiptap ul { list-style-type: disc; padding-left: 1.5em; }
        .tiptap ol { list-style-type: decimal; padding-left: 1.5em; }
        .tiptap blockquote { border-left: 3px solid var(--color-accent); padding-left: 1rem; color: var(--color-ink-mute); }
        .tiptap h1 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
        .tiptap h2 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; }
      `}</style>
    </div>
  );
}
