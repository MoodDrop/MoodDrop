// client/src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Read from your environment variables (already set in Vercel)
const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anon) {
  console.warn('⚠️ Missing Supabase environment variables.')
}

// Create and export the Supabase client
export const supabase = createClient(url!, anon!, {
  auth: { persistSession: false }, // No login needed yet
})
