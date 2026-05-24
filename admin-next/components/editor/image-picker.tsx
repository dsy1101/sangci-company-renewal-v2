'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  folder?: string;          // storage path prefix, e.g. 'products'
  allowUrlInput?: boolean;  // also accept paste-an-existing-URL
  className?: string;
  label?: string;
}

export function ImagePicker({
  value,
  onChange,
  folder = 'misc',
  allowUrlInput = true,
  className,
  label,
}: ImagePickerProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능');
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'png';
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('uploads').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success('업로드 완료');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error('업로드 실패: ' + msg);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <div className="text-sm font-medium">{label}</div>}
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="rounded-md border max-h-40 object-cover bg-muted"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
            onClick={() => onChange('')}
            title="제거"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 w-full h-32 border-2 border-dashed rounded-md text-sm text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> 업로드 중…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" /> 이미지 업로드
            </>
          )}
        </button>
      )}
      {allowUrlInput && (
        <Input
          type="url"
          placeholder="또는 이미지 URL 직접 입력 (https:// 또는 assets/...)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs"
        />
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}
