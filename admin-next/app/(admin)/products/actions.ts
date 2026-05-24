'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type SeriesInput = {
  series_id: number;
  title_ko: string;
  title_en: string;
  title_id: string;
  desc_ko: string;
  desc_en: string;
  desc_id: string;
};

export type ItemInput = {
  image: string;
  detail_img: string;
  name_ko: string;
  name_en: string;
  name_id: string;
  tags_ko: string[];
  tags_en: string[];
  tags_id: string[];
  desc_ko: string;
  desc_en: string;
  desc_id: string;
};

/**
 * Create or update a series + its items in one shot.
 * Items use the replace-all pattern (delete + insert) for simplicity:
 * the UI builds the desired item list locally, save commits it.
 */
export async function saveSeries(opts: {
  id?: string;
  series: SeriesInput;
  items: ItemInput[];
}): Promise<string> {
  const supabase = await createClient();
  let seriesUuid: string;

  if (opts.id) {
    const { error } = await supabase.from('product_series').update(opts.series).eq('id', opts.id);
    if (error) throw new Error('시리즈 업데이트 실패: ' + error.message);
    seriesUuid = opts.id;

    // Wipe existing items; we'll re-insert below.
    const { error: delErr } = await supabase
      .from('product_items')
      .delete()
      .eq('series_id', seriesUuid);
    if (delErr) throw new Error('items 삭제 실패: ' + delErr.message);
  } else {
    // For new series, pick the next sort_order automatically.
    const { data: topRow } = await supabase
      .from('product_series')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextSort = (topRow?.sort_order ?? 0) + 10;
    const { data, error } = await supabase
      .from('product_series')
      .insert({ ...opts.series, sort_order: nextSort })
      .select('id')
      .single();
    if (error) throw new Error('시리즈 생성 실패: ' + error.message);
    seriesUuid = data.id;
  }

  if (opts.items.length > 0) {
    const rows = opts.items.map((it, idx) => ({
      ...it,
      series_id: seriesUuid,
      sort_order: (idx + 1) * 10,
    }));
    const { error: insErr } = await supabase.from('product_items').insert(rows);
    if (insErr) throw new Error('items 저장 실패: ' + insErr.message);
  }

  revalidatePath('/products');
  revalidatePath('/');
  return seriesUuid;
}

export async function createSeriesAndRedirect(opts: { series: SeriesInput; items: ItemInput[] }) {
  const id = await saveSeries({ series: opts.series, items: opts.items });
  redirect(`/products/${id}`);
}

export async function deleteSeries(id: string) {
  const supabase = await createClient();
  // ON DELETE CASCADE handles product_items.
  const { error } = await supabase.from('product_series').delete().eq('id', id);
  if (error) throw new Error('삭제 실패: ' + error.message);
  revalidatePath('/products');
  revalidatePath('/');
}
