'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ImagePicker } from '@/components/editor/image-picker';
import { toast } from 'sonner';
import {
  Loader2,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
} from 'lucide-react';
import {
  saveSeries,
  createSeriesAndRedirect,
  type SeriesInput,
  type ItemInput,
} from '@/app/(admin)/products/actions';
import type { ProductSeriesRow, ProductItemRow } from '@/lib/types';

type ItemDraft = ItemInput & { _key: string };

let _keyCounter = 0;
const newKey = () => `k${++_keyCounter}-${Date.now()}`;

function emptyItem(): ItemDraft {
  return {
    _key: newKey(),
    image: '',
    detail_img: '',
    name_ko: '',
    name_en: '',
    name_id: '',
    tags_ko: [],
    tags_en: [],
    tags_id: [],
    desc_ko: '',
    desc_en: '',
    desc_id: '',
  };
}

export interface ProductFormProps {
  mode: 'create' | 'edit';
  id?: string;
  initialSeries?: Partial<ProductSeriesRow>;
  initialItems?: ProductItemRow[];
  nextSeriesId?: number;
}

export function ProductForm({
  mode,
  id,
  initialSeries,
  initialItems,
  nextSeriesId,
}: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Series fields
  const [seriesId, setSeriesId] = useState<number>(
    initialSeries?.series_id ?? nextSeriesId ?? 1,
  );
  const [titleKo, setTitleKo] = useState(initialSeries?.title_ko ?? '');
  const [titleEn, setTitleEn] = useState(initialSeries?.title_en ?? '');
  const [titleId, setTitleId] = useState(initialSeries?.title_id ?? '');
  const [descKo, setDescKo] = useState(initialSeries?.desc_ko ?? '');
  const [descEn, setDescEn] = useState(initialSeries?.desc_en ?? '');
  const [descId, setDescId] = useState(initialSeries?.desc_id ?? '');

  // Items
  const [items, setItems] = useState<ItemDraft[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((it) => ({
          _key: newKey(),
          image: it.image ?? '',
          detail_img: it.detail_img ?? '',
          name_ko: it.name_ko ?? '',
          name_en: it.name_en ?? '',
          name_id: it.name_id ?? '',
          tags_ko: it.tags_ko ?? [],
          tags_en: it.tags_en ?? [],
          tags_id: it.tags_id ?? [],
          desc_ko: it.desc_ko ?? '',
          desc_en: it.desc_en ?? '',
          desc_id: it.desc_id ?? '',
        }));
    }
    return [emptyItem()];
  });

  function updateItem(key: string, patch: Partial<ItemDraft>) {
    setItems((arr) => arr.map((it) => (it._key === key ? { ...it, ...patch } : it)));
  }
  function removeItem(key: string) {
    setItems((arr) => arr.filter((it) => it._key !== key));
  }
  function addItem() {
    setItems((arr) => [...arr, emptyItem()]);
  }
  function moveItem(key: string, dir: -1 | 1) {
    setItems((arr) => {
      const i = arr.findIndex((it) => it._key === key);
      if (i < 0) return arr;
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      const copy = arr.slice();
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function submit() {
    setError(null);
    if (!Number.isInteger(seriesId) || seriesId < 1) {
      setError('시리즈 ID는 1 이상의 정수여야 합니다.');
      return;
    }
    if (!titleKo.trim()) {
      setError('시리즈 한국어 제목은 필수입니다.');
      return;
    }
    if (!descKo.trim()) {
      setError('시리즈 한국어 설명은 필수입니다.');
      return;
    }
    if (items.length === 0) {
      setError('최소 한 개의 상품이 필요합니다.');
      return;
    }
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.image.trim()) {
        setError(`#${i + 1} 상품의 대표 이미지가 필요합니다.`);
        return;
      }
      if (!it.name_ko.trim()) {
        setError(`#${i + 1} 상품의 한국어 이름이 필요합니다.`);
        return;
      }
      if (!it.desc_ko.trim()) {
        setError(`#${i + 1} 상품의 한국어 설명이 필요합니다.`);
        return;
      }
    }

    const series: SeriesInput = {
      series_id: seriesId,
      title_ko: titleKo.trim(),
      title_en: titleEn.trim(),
      title_id: titleId.trim(),
      desc_ko: descKo.trim(),
      desc_en: descEn.trim(),
      desc_id: descId.trim(),
    };
    const cleanItems: ItemInput[] = items.map((it) => ({
      image: it.image.trim(),
      detail_img: it.detail_img.trim(),
      name_ko: it.name_ko.trim(),
      name_en: it.name_en.trim(),
      name_id: it.name_id.trim(),
      tags_ko: it.tags_ko,
      tags_en: it.tags_en,
      tags_id: it.tags_id,
      desc_ko: it.desc_ko.trim(),
      desc_en: it.desc_en.trim(),
      desc_id: it.desc_id.trim(),
    }));

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createSeriesAndRedirect({ series, items: cleanItems });
        } else if (id) {
          await saveSeries({ id, series, items: cleanItems });
          toast.success('저장됨');
          router.refresh();
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes('NEXT_REDIRECT')) return;
        setError(msg);
      }
    });
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">
          {mode === 'create' ? '새 제품 시리즈' : '시리즈 편집'}
        </h1>
        <div className="ml-auto">
          <Button onClick={submit} disabled={pending}>
            {pending ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            {mode === 'create' ? '게시' : '저장'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* SERIES INFO */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">시리즈 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="series_id">시리즈 ID (숫자)</Label>
              <Input
                id="series_id"
                type="number"
                min={1}
                value={seriesId}
                onChange={(e) => setSeriesId(parseInt(e.target.value || '0', 10))}
              />
            </div>
          </div>

          <Tabs defaultValue="ko">
            <TabsList>
              <TabsTrigger value="ko">한국어 *</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="id">Bahasa</TabsTrigger>
            </TabsList>
            <TabsContent value="ko" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label>시리즈 제목</Label>
                <Input value={titleKo} onChange={(e) => setTitleKo(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>시리즈 설명</Label>
                <Textarea rows={3} value={descKo} onChange={(e) => setDescKo(e.target.value)} />
              </div>
            </TabsContent>
            <TabsContent value="en" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="(비우면 한국어로 표시)"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea rows={3} value={descEn} onChange={(e) => setDescEn(e.target.value)} />
              </div>
            </TabsContent>
            <TabsContent value="id" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label>Judul</Label>
                <Input value={titleId} onChange={(e) => setTitleId(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Deskripsi</Label>
                <Textarea rows={3} value={descId} onChange={(e) => setDescId(e.target.value)} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ITEMS */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">상품 목록 ({items.length}개)</CardTitle>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" /> 상품 추가
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((it, i) => (
            <ItemCard
              key={it._key}
              index={i}
              total={items.length}
              item={it}
              onPatch={(p) => updateItem(it._key, p)}
              onRemove={() => removeItem(it._key)}
              onMoveUp={() => moveItem(it._key, -1)}
              onMoveDown={() => moveItem(it._key, 1)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ItemCard({
  index,
  total,
  item,
  onPatch,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  index: number;
  total: number;
  item: ItemDraft;
  onPatch: (p: Partial<ItemDraft>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="rounded-md border bg-card">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40 rounded-t-md">
        <span className="text-sm font-medium">
          #{index + 1}{' '}
          <span className="text-muted-foreground font-normal">
            {item.name_ko || '(이름 없음)'}
          </span>
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={index === 0}
            onClick={onMoveUp}
            title="위로"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={index === total - 1}
            onClick={onMoveDown}
            title="아래로"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={onRemove}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <ImagePicker
            label="대표 이미지 *"
            value={item.image}
            onChange={(v) => onPatch({ image: v })}
            folder="products"
          />
          <ImagePicker
            label="상세 이미지 (클릭 시 팝업, 선택)"
            value={item.detail_img}
            onChange={(v) => onPatch({ detail_img: v })}
            folder="products"
          />
        </div>
        <div>
          <Tabs defaultValue="ko">
            <TabsList>
              <TabsTrigger value="ko">한국어 *</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="id">Bahasa</TabsTrigger>
            </TabsList>
            <TabsContent value="ko" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label>이름</Label>
                <Input value={item.name_ko} onChange={(e) => onPatch({ name_ko: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>설명</Label>
                <Textarea rows={3} value={item.desc_ko} onChange={(e) => onPatch({ desc_ko: e.target.value })} />
              </div>
              <TagsField
                value={item.tags_ko}
                onChange={(v) => onPatch({ tags_ko: v })}
                placeholder="태그 입력 후 Enter (예: 아체 센트럴)"
              />
            </TabsContent>
            <TabsContent value="en" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={item.name_en} onChange={(e) => onPatch({ name_en: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea rows={3} value={item.desc_en} onChange={(e) => onPatch({ desc_en: e.target.value })} />
              </div>
              <TagsField
                value={item.tags_en}
                onChange={(v) => onPatch({ tags_en: v })}
                placeholder="Enter to add (e.g. Central Aceh)"
              />
            </TabsContent>
            <TabsContent value="id" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label>Nama</Label>
                <Input value={item.name_id} onChange={(e) => onPatch({ name_id: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Deskripsi</Label>
                <Textarea rows={3} value={item.desc_id} onChange={(e) => onPatch({ desc_id: e.target.value })} />
              </div>
              <TagsField
                value={item.tags_id}
                onChange={(v) => onPatch({ tags_id: v })}
                placeholder="Tekan Enter untuk menambah"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function TagsField({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  function add() {
    const v = draft.trim();
    if (!v) return;
    if (value.includes(v)) {
      setDraft('');
      return;
    }
    onChange([...value, v]);
    setDraft('');
  }
  function remove(t: string) {
    onChange(value.filter((x) => x !== t));
  }
  return (
    <div className="space-y-1.5">
      <Label>태그</Label>
      <div className="flex flex-wrap gap-1.5">
        {value.map((t) => (
          <Badge key={t} variant="secondary" className="gap-1 pl-2 pr-1 py-1">
            {t}
            <button
              type="button"
              className="hover:text-destructive"
              onClick={() => remove(t)}
              title="제거"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={placeholder}
      />
    </div>
  );
}
