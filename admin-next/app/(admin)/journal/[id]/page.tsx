import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { JournalForm } from '@/components/journal/journal-form';
import type { JournalRow } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from('journal').select('*').eq('id', id).maybeSingle();
  if (error) {
    return <div className="text-sm text-destructive">불러오기 실패: {error.message}</div>;
  }
  if (!data) notFound();

  return <JournalForm mode="edit" id={id} initial={data as JournalRow} />;
}
