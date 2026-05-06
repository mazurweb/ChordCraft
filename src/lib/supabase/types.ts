// NOTE: regenerate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
// This is a hand-stubbed shape matching the migrations in supabase/migrations.

export type Plan = 'free' | 'pro' | 'studio';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
          email: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      progressions: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['progressions']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['progressions']['Row']>;
      };
      shares: {
        Row: {
          id: string;
          progression_id: string;
          share_id: string;
          view_count: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['shares']['Row'], 'id' | 'created_at' | 'view_count'> & {
          id?: string;
          view_count?: number;
        };
        Update: Partial<Database['public']['Tables']['shares']['Row']>;
      };
    };
  };
}
