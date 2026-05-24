import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/products/product-form';
import type { ProductItemRow, ProductSeriesRow } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EditProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [seriesRes, itemsRes] = await Promise.all([
    supabase.from('product_series').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('product_items')
      .select('*')
      .eq('series_id', id)
      .order('sort_order', { ascending: true }),
  ]);
  if (seriesRes.error) {
    return <div className="text-sm text-destructive">불러오기 실패: {seriesRes.error.message}</div>;
  }
  if (!seriesRes.data) notFound();

  return (
    <ProductForm
      mode="edit"
      id={id}
      initialSeries={seriesRes.data as ProductSeriesRow}
      initialItems={(itemsRes.data ?? []) as ProductItemRow[]}
    />
  );
}
