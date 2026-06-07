// ============================================================================
// Browser Supabase client (Client Components, hooks, event handlers).
//
// Use this in any `'use client'` component. It is safe to import at module
// scope and reuse the returned singleton across the app.
//
//   import { supabase } from '@/lib/supabase';
//   const { data } = await supabase.from('categories').select('*');
// ============================================================================
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.local.example).",
  );
}

/**
 * Factory — call this if you need a fresh typed browser client.
 * Most code should just import the `supabase` singleton below.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!);
}

/** Shared browser client singleton. */
export const supabase = createClient();
