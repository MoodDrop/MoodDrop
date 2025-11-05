// client/src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Read from your environment variables
const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL type:', typeof url, 'value length:', url?.length || 0)
console.log('Supabase URL value:', url)
console.log('Supabase Key type:', typeof anon, 'value length:', anon?.length || 0)
console.log('Supabase Key starts with:', anon?.substring(0, 20))

// Use placeholder values if not configured (prevents app crash)
const supabaseUrl = url && url !== 'undefined' ? url : 'https://placeholder.supabase.co'
const supabaseKey = anon && anon !== 'undefined' ? anon : 'placeholder-anon-key'

// Warn if using placeholders
if (!url || !anon || url === 'undefined' || anon === 'undefined') {
  console.warn('⚠️ Supabase environment variables are missing.')
  console.warn('Community features will not work until you add:')
  console.warn('- VITE_SUPABASE_URL')
  console.warn('- VITE_SUPABASE_ANON_KEY')
  console.warn('to your Replit Secrets')
}

// Create and export the Supabase client (with placeholders if needed)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }, // No login needed
})

// Export a flag to check if properly configured
export const isSupabaseConfigured = Boolean(url && anon && url !== 'undefined' && anon !== 'undefined')
