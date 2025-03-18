
import { setupSupabaseSchema } from './supabase';

export async function initializeDatabase() {
  try {
    // Check table access
    const hasTableAccess = await setupSupabaseSchema();
    
    if (hasTableAccess) {
      console.log("Connected to Supabase database successfully");
      return true;
    } else {
      console.log("Connected to Supabase, but no tables are accessible");
      console.log("Please create the required tables in your Supabase dashboard:");
      console.log("1. products");
      console.log("2. bundles");
      console.log("3. subscriptions");
      console.log("4. purchases");
      return false;
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
}
