// client/src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Load Vite environment variables
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helpful check so you never get a blank screen
if (!url || !anon) {
  console.error("[MoodDrop] Missing Supabase envs", {
    supabaseUrl: url,
    supabaseAnonKey: anon,
  });
  throw new Error(
    "Supabase keys missing. Make sure `.env.local` is inside the /client folder (same level as src/) and restart the server with `npm run dev:ui`."
  );
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: false },
});

