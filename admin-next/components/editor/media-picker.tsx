'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, X, Film, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mediaKindOf } from '@/lib/types';

export interface MediaPickerProps {
  value: string;
  onChange: (value: string) => void;
  folder?: string;          // storage path prefix, e.g. 'journal'
  allowUrlInput?: boolean;
  className?: string;
  label?: string;
}

// Same picker as ImagePicker, but also accepts video files (mp4/mov/webm/...).
// Preview renders as an autoplaying muted video if the URL looks like a video,
// otherwise an <img>. The DB column doesn't care which kind it is.
export function MediaPicker({
  value,
  onChange,
  folder = 'misc',
  allowUrlInput = true,
  className,
  label,
}: MediaPickerProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      toast.error('이미지 또는 영상 파일만 업로드 가능');
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'png');
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('uploads').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || undefined,
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

  const kind = mediaKindOf(value);

  return (
    <div className={cn('space-y-2', className)}>
      {label && <div className="text-sm font-medium">{label}</div>}
      {value ? (
        <div className="relative inline-block">
          {kind === 'video' ? (
            <video
              src={value}
              autoPlay
              muted
              loop
              playsInline
              className="rounded-md border max-h-48 bg-muted"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="rounded-md border max-h-48 object-cover bg-muted"
            />
          )}
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
          <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
            {kind === 'video' ? <><Film className="h-3 w-3" /> 영상</> : <><ImageIcon className="h-3 w-3" /> 사진</>}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center gap-1.5 w-full h-32 border-2 border-dashed rounded-md text-sm text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> 업로드 중…
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <div>사진 또는 영상 업로드</div>
              <div className="text-[11px] opacity-70">jpg · png · webp · mp4 · mov · webm</div>
            </>
          )}
        </button>
      )}
      {allowUrlInput && (
        <Input
          type="url"
          placeholder="또는 미디어 URL 직접 입력 (https://...)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs"
        />
      )}
      <input
        type="file"
        accept="image/*,video/*"
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
