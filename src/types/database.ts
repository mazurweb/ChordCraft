// Drizzle-inferred row types. Aliased to avoid clashing with music.ts `Progression`.
export type {
  User,
  Progression as ProgressionRow,
  ProgressionInsert,
  Share,
} from '@/lib/db/schema';
