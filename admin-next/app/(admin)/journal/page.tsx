import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TAGS, type Tag, type JournalRow } from '@/lib/types';
import { Plus, Pencil } from 'lucide-react';
import { JournalDeleteButton } from '@/components/journal/journal-delete-button';

export const dynamic = 'force-dynamic';

export default async function JournalListPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('journal')
    .select('id, date, tag, emoji, title_ko, sort_order, updated_at')
    .order('sort_order', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    return (
      <div className="p-4 text-sm text-destructive">불러오기 실패: {error.message}</div>
    );
  }

  const rows = (data ?? []) as Pick<JournalRow, 'id'|'date'|'tag'|'emoji'|'title_ko'|'sort_order'|'updated_at'>[];

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">비즈니스 저널</h1>
          <p className="text-sm text-muted-foreground mt-1">{rows.length}개의 글</p>
        </div>
        <Link href="/journal/new">
          <Button>
            <Plus className="h-4 w-4 mr-1" /> 새 글 작성
          </Button>
        </Link>
      </div>

      <Card>
        {rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">아직 글이 없습니다.</div>
        ) : (
          <ul className="divide-y">
            {rows.map((r) => {
              const tagMeta = TAGS.find((t) => t.value === (r.tag as Tag));
              return (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/20">
                  <span className="text-2xl shrink-0" aria-hidden>{r.emoji || '📝'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/journal/${r.id}`} className="text-sm font-medium truncate hover:underline">
                        {r.title_ko}
                      </Link>
                      {tagMeta && <Badge variant="secondary" className="text-[10px]">{tagMeta.label}</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.date}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/journal/${r.id}`}>
                      <Button variant="ghost" size="icon" title="편집">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <JournalDeleteButton id={r.id} title={r.title_ko} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
