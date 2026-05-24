import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = await createClient();

  const [{ count: journalCount }, { count: seriesCount }, { count: itemsCount }, recentJournalRes] =
    await Promise.all([
      supabase.from('journal').select('*', { count: 'exact', head: true }),
      supabase.from('product_series').select('*', { count: 'exact', head: true }),
      supabase.from('product_items').select('*', { count: 'exact', head: true }),
      supabase
        .from('journal')
        .select('id, date, title_ko, tag, emoji, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5),
    ]);

  const recent = recentJournalRes.data ?? [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold">대시보드</h1>
        <p className="text-sm text-muted-foreground mt-1">한눈에 보는 사이트 현황</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/journal">
          <Card className="hover:bg-accent/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> 비즈니스 저널
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{journalCount ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">개의 글</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/products">
          <Card className="hover:bg-accent/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" /> 제품 시리즈
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{seriesCount ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">개의 시리즈</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" /> 상품 개수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{itemsCount ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">개의 상품 (시리즈 합계)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">최근 수정된 저널</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 저널 글이 없습니다.</p>
          ) : (
            <ul className="divide-y -mx-2">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/journal/${r.id}`}
                    className="flex items-center gap-3 px-2 py-3 hover:bg-accent/30 rounded-md transition-colors"
                  >
                    <span className="text-lg" aria-hidden>{r.emoji || '📝'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.title_ko}</div>
                      <div className="text-xs text-muted-foreground">{r.date}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
