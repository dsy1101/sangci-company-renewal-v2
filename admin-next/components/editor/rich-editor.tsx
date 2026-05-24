'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichEditor({ value, onChange, placeholder, className }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-md max-w-full' },
      }),
      Placeholder.configure({
        placeholder: placeholder || '본문을 작성하세요…',
      }),
    ],
    content: value || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] py-3',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // External value updates (e.g., language tab switch) → sync into editor.
  const lastValue = useRef(value);
  useEffect(() => {
    if (!editor) return;
    if (value !== lastValue.current && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
      lastValue.current = value;
    }
  }, [value, editor]);

  if (!editor) return <div className={cn('h-[360px] rounded-md border', className)} />;

  return (
    <div className={cn('rounded-md border bg-background', className)}>
      <Toolbar editor={editor} />
      <div className="px-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const addLink = useCallback(() => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('링크 URL을 입력하세요', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  async function onImageFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능');
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'png';
      const path = `journal/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('uploads').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      editor.chain().focus().setImage({ src: data.publicUrl, alt: file.name }).run();
      toast.success('이미지 업로드 완료');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error('업로드 실패: ' + msg);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5">
      <ToolbarBtn
        title="굵게"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      >
        <Bold className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        title="기울임"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      >
        <Italic className="h-4 w-4" />
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn
        title="중제목"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        title="소제목"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn
        title="글머리 목록"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      >
        <List className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        title="번호 목록"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        title="인용"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
      >
        <Quote className="h-4 w-4" />
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn title="링크" onClick={addLink} active={editor.isActive('link')}>
        <LinkIcon className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        title="이미지 업로드"
        onClick={() => fileInput.current?.click()}
        disabled={uploading}
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
      </ToolbarBtn>
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onImageFile(f);
          e.target.value = '';
        }}
      />
      <div className="ml-auto flex items-center gap-0.5">
        <ToolbarBtn
          title="되돌리기"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="다시 실행"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </ToolbarBtn>
      </div>
    </div>
  );
}

function ToolbarBtn({
  children,
  active,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      size="icon"
      className="h-8 w-8"
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </Button>
  );
}

function Sep() {
  return <div className="mx-1 h-5 w-px bg-border" />;
}
