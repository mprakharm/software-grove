
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// You can replace these values with your actual Supabase URL and anon key
// from your Supabase dashboard: https://app.supabase.com
// Go to Project Settings > API to find these values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Instructions:
// 1. Replace 'YOUR_SUPABASE_URL' with your actual Supabase URL
// 2. Replace 'YOUR_SUPABASE_ANON_KEY' with your actual Supabase anon key
// Both can be found in your Supabase dashboard under Project Settings > API
