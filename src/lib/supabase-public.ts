// ============================================================================
// Public (anonymous) Supabase client for read-only catalogue data.
//
// Unlike supabase-server.ts (which reads cookies and therefore forces dynamic
// rendering), this client has no cookie dependency, so it is safe to use in:
//   - Server Components during the static export build (`output: 'export'`)
//   - Client Components in the browser for filter/search refetches
//
// It only ever sees the public `anon` key and relies on the "public read" RLS
// policies from migration 0001. Never use it for writes.
// ============================================================================
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.local.example).",
  );
}

export const supabasePublic = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
