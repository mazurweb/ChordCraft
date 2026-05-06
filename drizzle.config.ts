import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

// Load .env.local first (Next-style), then fall back to .env.
config({ path: '.env.local' });
config({ path: '.env' });

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
  strict: true,
  verbose: true,
} satisfies Config;
