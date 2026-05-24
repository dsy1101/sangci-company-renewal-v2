'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RichEditor } from '@/components/editor/rich-editor';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TAGS, type Tag, type JournalRow } from '@/lib/types';
import { createJournal, updateJournal, type JournalInput } from '@/app/(admin)/journal/actions';

export interface JournalFormProps {
  mode: 'create' | 'edit';
  initial?: Partial<JournalRow>;
  id?: string;
}

function todayLabel(): string {
  const d = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function JournalForm({ mode, initial, id }: JournalFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState(initial?.date ?? todayLabel());
  const [tag, setTag] = useState<Tag>((initial?.tag as Tag) ?? 'meeting');
  const [emoji, setEmoji] = useState(initial?.emoji ?? TAGS.find((t) => t.value === 'meeting')?.emoji ?? '📝');
  const [titleKo, setTitleKo] = useState(initial?.title_ko ?? '');
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? '');
  const [titleId, setTitleId] = useState(initial?.title_id ?? '');
  const [bodyKo, setBodyKo] = useState(initial?.body_ko ?? '');
  const [bodyEn, setBodyEn] = useState(initial?.body_en ?? '');
  const [bodyIdField, setBodyIdField] = useState(initial?.body_id ?? '');

  function onTagChange(t: Tag) {
    setTag(t);
    // Auto-suggest emoji on tag change (only if user hasn't customized it)
    const meta = TAGS.find((x) => x.value === t);
    if (meta && (!emoji || TAGS.some((x) => x.emoji === emoji))) {
      setEmoji(meta.emoji);
    }
  }

  function submit() {
    setError(null);
    if (!titleKo.trim()) {
      setError('한국어 제목은 필수입니다.');
      return;
    }
    if (!bodyKo.trim() || bodyKo === '<p></p>') {
      setError('한국어 본문은 필수입니다.');
      return;
    }
    if (!date.trim()) {
      setError('날짜를 입력하세요.');
      return;
    }

    const input: JournalInput = {
      date: date.trim(),
      tag,
      emoji: emoji || '📝',
      title_ko: titleKo.trim(),
      title_en: titleEn.trim(),
      title_id: titleId.trim(),
      body_ko: bodyKo,
      body_en: bodyEn,
      body_id: bodyIdField,
    };

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createJournal(input);
          // createJournal redirects to /journal/[id], so this is unreachable on success
        } else if (id) {
          await updateJournal(id, input);
          toast.success('저장됨');
          router.refresh();
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        // Next.js redirect throws a special error — ignore that one
        if (msg.includes('NEXT_REDIRECT')) return;
        setError(msg);
      }
    });
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/journal">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">
          {mode === 'create' ? '새 저널 글' : '저널 글 편집'}
        </h1>
        <div className="ml-auto">
          <Button onClick={submit} disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            {mode === 'create' ? '게시' : '저장'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">날짜</Label>
              <Input
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="May 8, 2026"
              />
            </div>
            <div className="space-y-1.5">
              <Label>분류</Label>
              <Select value={tag} onValueChange={(v) => onTagChange(v as Tag)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAGS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.emoji} {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emoji">썸네일 이모지</Label>
              <Input
                id="emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🤝"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">본문 (한국어 필수, 영문/인도네시아어 선택)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ko">
            <TabsList>
              <TabsTrigger value="ko">한국어 *</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="id">Bahasa</TabsTrigger>
            </TabsList>

            <TabsContent value="ko" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label htmlFor="title_ko">제목</Label>
                <Input
                  id="title_ko"
                  value={titleKo}
                  onChange={(e) => setTitleKo(e.target.value)}
                  placeholder="예: 부산 전략 회의"
                />
              </div>
              <div className="space-y-1.5">
                <Label>본문</Label>
                <RichEditor value={bodyKo} onChange={setBodyKo} placeholder="본문을 작성하세요…" />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label htmlFor="title_en">Title</Label>
                <Input
                  id="title_en"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="(비우면 한국어 제목이 표시됨)"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Body</Label>
                <RichEditor value={bodyEn} onChange={setBodyEn} placeholder="(비우면 한국어 본문이 표시됨)" />
              </div>
            </TabsContent>

            <TabsContent value="id" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label htmlFor="title_id">Judul</Label>
                <Input
                  id="title_id"
                  value={titleId}
                  onChange={(e) => setTitleId(e.target.value)}
                  placeholder="(kosongkan → tampilkan KO)"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Isi</Label>
                <RichEditor value={bodyIdField} onChange={setBodyIdField} placeholder="(kosongkan → tampilkan KO)" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
