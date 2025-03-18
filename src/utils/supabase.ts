
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Type definitions for our tables
export type Tables = Database['public']['Tables'];
export type Product = Tables['products']['Row'];
export type Bundle = Tables['bundles']['Row'];
export type BundleProduct = Tables['bundle_products']['Row'];
export type Subscription = Tables['subscriptions']['Row'];
export type Purchase = Tables['purchases']['Row'];
export type User = Tables['users']['Row'];
