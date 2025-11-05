// client/src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Read from your environment variables
const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// Validate configuration
if (!url || !anon || url === 'undefined' || anon === 'undefined') {
  console.error('⚠️ Supabase environment variables are missing.')
  throw new Error('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Replit Secrets')
}

// Create and export the Supabase client
export const supabase = createClient(url, anon, {
  auth: { persistSession: false }, // No login needed for anonymous posting
})
