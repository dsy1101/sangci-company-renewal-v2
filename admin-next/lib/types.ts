// Shape of rows as they come back from Supabase Postgres.
// Mirrors supabase/001_schema.sql.

export type Tag = 'meeting' | 'field' | 'factory' | 'travel' | 'networking';

export const TAGS: { value: Tag; label: string; emoji: string }[] = [
  { value: 'meeting',    label: '회의',      emoji: '🤝' },
  { value: 'field',      label: '현장 점검', emoji: '🌴' },
  { value: 'factory',    label: '공장 방문', emoji: '🏭' },
  { value: 'travel',     label: '출장',      emoji: '✈️' },
  { value: 'networking', label: '네트워킹',  emoji: '🎤' },
];

export interface JournalRow {
  id: string;
  date: string;          // "May 8, 2026"
  tag: Tag;
  emoji: string | null;
  title_ko: string;
  title_en: string;
  title_id: string;
  body_ko: string;
  body_en: string;
  body_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductSeriesRow {
  id: string;
  series_id: number;
  title_ko: string;
  title_en: string;
  title_id: string;
  desc_ko: string;
  desc_en: string;
  desc_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductItemRow {
  id: string;
  series_id: string;
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
  sort_order: number;
  created_at: string;
  updated_at: string;
}
