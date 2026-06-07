// ============================================================================
// Server Supabase client (Server Components, Route Handlers, Server Actions).
//
//   import { createServerSupabaseClient } from '@/lib/supabase-server';
//   const supabase = await createServerSupabaseClient();
//   const { data } = await supabase.from('products').select('*');
//
// ----------------------------------------------------------------------------
// ⚠️  STATIC EXPORT NOTE
// This project is currently configured with `output: 'export'` in
// next.config.js (static HTML for GitHub Pages). Under static export there is
// no Node server at runtime, so cookie-based auth in Server Components /
// Route Handlers does NOT execute in production — only the browser client runs.
//
// This file is provided for the admin panel (Steps 2/3), which will need a
// real server runtime (e.g. a Vercel/Node deployment, or `next dev`). When you
// build the admin, host it where `output: 'export'` is NOT set, or split it
// into its own deployment. Until then this client works under `next dev` and
// any non-export deployment.
// ============================================================================
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
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
 * Creates a typed server-side Supabase client wired to the request cookies,
 * so authenticated sessions (admin) are honoured in Server Components,
 * Route Handlers, and Server Actions.
 *
 * In Next.js 15 `cookies()` is async, so this returns a Promise.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // In Server Components writing cookies throws; that's expected and safe
        // to ignore when only reading. Middleware / Route Handlers / Actions
        // are where cookie writes (auth refresh) actually take effect.
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // No-op: called from a Server Component render.
        }
      },
    },
  });
}
