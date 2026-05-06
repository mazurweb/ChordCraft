// NOTE: regenerate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
// Hand-stubbed shape matching supabase/migrations/0001_initial_schema.sql.

export type Plan = 'free' | 'pro' | 'studio';

type ProfileRow = {
  id: string;
  email: string;
  username: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  created_at: string;
  updated_at: string;
};

type ProgressionRow = {
  id: string;
  user_id: string;
  name: string;
  genre: string;
  key: string;
  scale: string;
  chords: { chords: string[]; roman?: string[] };
  bpm: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

type ShareRow = {
  id: string;
  progression_id: string;
  share_id: string;
  view_count: number;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string; email: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      progressions: {
        Row: ProgressionRow;
        Insert: Omit<ProgressionRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ProgressionRow>;
        Relationships: [];
      };
      shares: {
        Row: ShareRow;
        Insert: Omit<ShareRow, 'id' | 'created_at' | 'view_count'> & {
          id?: string;
          view_count?: number;
          created_at?: string;
        };
        Update: Partial<ShareRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
