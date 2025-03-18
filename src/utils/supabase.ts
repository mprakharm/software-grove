
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Supabase configuration with actual URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ezqvaghcrgjgyeqcsofl.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cXZhZ2hjcmdqZ3llcWNzb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyODg4MTksImV4cCI6MjA1Nzg2NDgxOX0.IQLh5mhJy4etyzo5RDPBBFFd7VLcBnY_BEvRUj4gRg8';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Configuration is now set with your actual Supabase credentials
// The fallback values are used if environment variables are not available

// Function to set up the database schema
export async function setupSupabaseSchema() {
  try {
    console.log("Setting up Supabase schema...");
    
    // Create products table
    const { error: productsError } = await supabase.rpc('create_products_table');
    if (productsError && !productsError.message.includes("already exists")) {
      console.error("Error creating products table:", productsError);
      
      // Try direct SQL if RPC fails (requires storage-admin policy)
      const { error: directProductsError } = await supabase.from('products').insert({}).select();
      
      if (directProductsError && directProductsError.code === "42P01") {
        console.log("Products table doesn't exist. Creating via SQL query...");
        const { error: sqlError } = await supabase.rpc('execute_sql', { 
          sql_query: `
            CREATE TABLE IF NOT EXISTS products (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              description TEXT NOT NULL,
              category TEXT NOT NULL,
              logo TEXT NOT NULL,
              price DECIMAL NOT NULL,
              featured_benefit TEXT,
              benefits TEXT[],
              integration TEXT[],
              popularity INTEGER,
              rating DECIMAL,
              reviews INTEGER,
              users INTEGER,
              in_stock BOOLEAN NOT NULL DEFAULT true,
              is_hot BOOLEAN,
              banner TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        if (sqlError) console.error("Error creating products table via SQL:", sqlError);
      }
    }
    
    // Create bundles table
    const { error: bundlesError } = await supabase.rpc('create_bundles_table');
    if (bundlesError && !bundlesError.message.includes("already exists")) {
      console.error("Error creating bundles table:", bundlesError);
      
      // Try direct SQL if RPC fails
      const { error: directBundlesError } = await supabase.from('bundles').insert({}).select();
      
      if (directBundlesError && directBundlesError.code === "42P01") {
        console.log("Bundles table doesn't exist. Creating via SQL query...");
        const { error: sqlError } = await supabase.rpc('execute_sql', { 
          sql_query: `
            CREATE TABLE IF NOT EXISTS bundles (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              description TEXT NOT NULL,
              category TEXT NOT NULL,
              target_user TEXT NOT NULL,
              products JSONB NOT NULL,
              min_products INTEGER,
              max_products INTEGER,
              required_product_ids TEXT[],
              image TEXT NOT NULL,
              savings DECIMAL NOT NULL,
              is_customizable BOOLEAN NOT NULL,
              is_limited_time BOOLEAN,
              expiry_date TIMESTAMP WITH TIME ZONE,
              color TEXT NOT NULL,
              purchases INTEGER,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        if (sqlError) console.error("Error creating bundles table via SQL:", sqlError);
      }
    }
    
    // Create subscriptions table
    const { error: subscriptionsError } = await supabase.rpc('create_subscriptions_table');
    if (subscriptionsError && !subscriptionsError.message.includes("already exists")) {
      console.error("Error creating subscriptions table:", subscriptionsError);
      
      // Try direct SQL if RPC fails
      const { error: directSubsError } = await supabase.from('subscriptions').insert({}).select();
      
      if (directSubsError && directSubsError.code === "42P01") {
        console.log("Subscriptions table doesn't exist. Creating via SQL query...");
        const { error: sqlError } = await supabase.rpc('execute_sql', { 
          sql_query: `
            CREATE TABLE IF NOT EXISTS subscriptions (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id TEXT NOT NULL,
              product_id UUID REFERENCES products(id),
              bundle_id UUID REFERENCES bundles(id),
              plan_id TEXT NOT NULL,
              start_date TIMESTAMP WITH TIME ZONE NOT NULL,
              end_date TIMESTAMP WITH TIME ZONE NOT NULL,
              auto_renew BOOLEAN NOT NULL,
              price DECIMAL NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        if (sqlError) console.error("Error creating subscriptions table via SQL:", sqlError);
      }
    }
    
    // Create purchases table
    const { error: purchasesError } = await supabase.rpc('create_purchases_table');
    if (purchasesError && !purchasesError.message.includes("already exists")) {
      console.error("Error creating purchases table:", purchasesError);
      
      // Try direct SQL if RPC fails
      const { error: directPurchasesError } = await supabase.from('purchases').insert({}).select();
      
      if (directPurchasesError && directPurchasesError.code === "42P01") {
        console.log("Purchases table doesn't exist. Creating via SQL query...");
        const { error: sqlError } = await supabase.rpc('execute_sql', { 
          sql_query: `
            CREATE TABLE IF NOT EXISTS purchases (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id TEXT NOT NULL,
              product_id UUID REFERENCES products(id),
              bundle_id UUID REFERENCES bundles(id),
              plan_id TEXT NOT NULL,
              date TIMESTAMP WITH TIME ZONE NOT NULL,
              amount DECIMAL NOT NULL,
              status TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        if (sqlError) console.error("Error creating purchases table via SQL:", sqlError);
      }
    }
    
    console.log("Supabase schema setup complete!");
    return true;
  } catch (error) {
    console.error("Error setting up Supabase schema:", error);
    return false;
  }
}
