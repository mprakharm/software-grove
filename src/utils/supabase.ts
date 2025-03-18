
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Supabase configuration with actual URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ezqvaghcrgjgyeqcsofl.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cXZhZ2hjcmdqZ3llcWNzb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyODg4MTksImV4cCI6MjA1Nzg2NDgxOX0.IQLh5mhJy4etyzo5RDPBBFFd7VLcBnY_BEvRUj4gRg8';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Configuration is now set with your actual Supabase credentials
// The fallback values are used if environment variables are not available
