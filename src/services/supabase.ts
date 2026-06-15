/**
 * Creates and exports the Supabase client used by the rest of the app.
 * Reads connection details from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)