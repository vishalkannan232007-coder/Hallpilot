import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.examplePlaceholderOnly'
);

// Safe instantiation: will use mock mode if environment credentials are placeholders
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-hallpilot.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
