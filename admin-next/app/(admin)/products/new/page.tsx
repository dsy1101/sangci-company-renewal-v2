import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/products/product-form';

export const dynamic = 'force-dynamic';

export default async function NewProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('product_series')
    .select('series_id')
    .order('series_id', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSeriesId = (data?.series_id ?? 0) + 1;
  return <ProductForm mode="create" nextSeriesId={nextSeriesId} />;
}
