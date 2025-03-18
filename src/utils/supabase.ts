
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Type definitions for our tables
export type Tables = Database['public']['Tables'];
export type SupabaseProduct = Tables['products']['Row'];
export type SupabaseBundle = Tables['bundles']['Row'];
export type SupabaseBundleProduct = Tables['bundle_products']['Row'];
export type SupabaseSubscription = Tables['subscriptions']['Row'];
export type SupabasePurchase = Tables['purchases']['Row'];
export type SupabaseUser = Tables['users']['Row'];
