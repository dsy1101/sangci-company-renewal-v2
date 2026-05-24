import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil } from 'lucide-react';
import { ProductDeleteButton } from '@/components/products/product-delete-button';

export const dynamic = 'force-dynamic';

export default async function ProductsListPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('product_series')
    .select('id, series_id, title_ko, items:product_items(id)')
    .order('sort_order', { ascending: true });

  if (error) {
    return <div className="text-sm text-destructive">불러오기 실패: {error.message}</div>;
  }

  const rows = (data ?? []) as { id: string; series_id: number; title_ko: string; items: { id: string }[] }[];

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">제품</h1>
          <p className="text-sm text-muted-foreground mt-1">{rows.length}개의 시리즈</p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-1" /> 새 시리즈
          </Button>
        </Link>
      </div>

      <Card>
        {rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">아직 시리즈가 없습니다.</div>
        ) : (
          <ul className="divide-y">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/20">
                <span className="text-sm tabular-nums text-muted-foreground w-10">#{r.series_id}</span>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${r.id}`} className="text-sm font-medium hover:underline">
                    {r.title_ko}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {r.items?.length ?? 0}개 상품
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/products/${r.id}`}>
                    <Button variant="ghost" size="icon" title="편집">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <ProductDeleteButton id={r.id} title={r.title_ko} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
