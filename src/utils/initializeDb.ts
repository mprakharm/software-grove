
import { setupSupabaseSchema } from './supabase';

export async function initializeDatabase() {
  try {
    // Attempt to create tables
    const success = await setupSupabaseSchema();
    
    if (success) {
      console.log("Database schema initialized successfully");
    } else {
      console.error("Failed to initialize database schema");
    }
    
    return success;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
}
