'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tag } from '@/lib/types';

export type JournalInput = {
  date: string;
  tag: Tag;
  emoji: string;
  thumbnail_url: string;
  title_ko: string;
  title_en: string;
  title_id: string;
  body_ko: string;
  body_en: string;
  body_id: string;
};

export async function createJournal(input: JournalInput) {
  const supabase = await createClient();
  // Make the new entry the topmost by giving it the highest sort_order + 10.
  const { data: topRow } = await supabase
    .from('journal')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSort = (topRow?.sort_order ?? 0) + 10;

  const { data, error } = await supabase
    .from('journal')
    .insert({ ...input, sort_order: nextSort })
    .select('id')
    .single();
  if (error) throw new Error(error.message);

  revalidatePath('/journal');
  revalidatePath('/');
  redirect(`/journal/${data.id}`);
}

export async function updateJournal(id: string, input: JournalInput) {
  const supabase = await createClient();
  const { error } = await supabase.from('journal').update(input).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/journal');
  revalidatePath(`/journal/${id}`);
  revalidatePath('/');
}

export async function deleteJournal(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('journal').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/journal');
  revalidatePath('/');
}

export async function moveJournalToTop(id: string) {
  const supabase = await createClient();
  const { data: topRow } = await supabase
    .from('journal')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSort = (topRow?.sort_order ?? 0) + 10;

  const { error } = await supabase
    .from('journal')
    .update({ sort_order: nextSort })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/journal');
}
