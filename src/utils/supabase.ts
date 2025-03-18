
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { transformProductToSupabase } from './transformers';

// Supabase configuration with actual URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ezqvaghcrgjgyeqcsofl.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cXZhZ2hjcmdqZ3llcWNzb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyODg4MTksImV4cCI6MjA1Nzg2NDgxOX0.IQLh5mhJy4etyzo5RDPBBFFd7VLcBnY_BEvRUj4gRg8';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Function to set up the database schema
export async function setupSupabaseSchema() {
  try {
    console.log("Setting up Supabase schema...");
    
    // Check if products table exists by attempting to query it
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (productsError && productsError.code === '42P01') {
      console.log("Products table doesn't exist. You'll need to create it in the Supabase dashboard.");
    } else {
      console.log("Products table exists or is accessible.");
    }
    
    // Check if bundles table exists
    const { data: bundlesData, error: bundlesError } = await supabase
      .from('bundles')
      .select('id')
      .limit(1);
    
    if (bundlesError && bundlesError.code === '42P01') {
      console.log("Bundles table doesn't exist. You'll need to create it in the Supabase dashboard.");
    } else {
      console.log("Bundles table exists or is accessible.");
    }
    
    // Check if subscriptions table exists
    const { data: subscriptionsData, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    if (subscriptionsError && subscriptionsError.code === '42P01') {
      console.log("Subscriptions table doesn't exist. You'll need to create it in the Supabase dashboard.");
    } else {
      console.log("Subscriptions table exists or is accessible.");
    }
    
    // Check if purchases table exists
    const { data: purchasesData, error: purchasesError } = await supabase
      .from('purchases')
      .select('id')
      .limit(1);
    
    if (purchasesError && purchasesError.code === '42P01') {
      console.log("Purchases table doesn't exist. You'll need to create it in the Supabase dashboard.");
    } else {
      console.log("Purchases table exists or is accessible.");
    }
    
    // Determine if we have access to the tables
    const hasProductsAccess = !productsError || productsError.code !== '42P01';
    const hasBundlesAccess = !bundlesError || bundlesError.code !== '42P01';
    const hasSubscriptionsAccess = !subscriptionsError || subscriptionsError.code !== '42P01';
    const hasPurchasesAccess = !purchasesError || purchasesError.code !== '42P01';
    
    console.log("Schema check complete.");
    console.log(`Tables status: Products: ${hasProductsAccess ? 'OK' : 'Missing'}, Bundles: ${hasBundlesAccess ? 'OK' : 'Missing'}, Subscriptions: ${hasSubscriptionsAccess ? 'OK' : 'Missing'}, Purchases: ${hasPurchasesAccess ? 'OK' : 'Missing'}`);
    
    // Return true if we have access to at least some tables
    return hasProductsAccess || hasBundlesAccess || hasSubscriptionsAccess || hasPurchasesAccess;
  } catch (error) {
    console.error("Error checking Supabase schema:", error);
    return false;
  }
}

// Function to seed the database with products from the frontend data
export async function seedDatabaseWithFrontendData() {
  try {
    console.log("Checking if products need to be seeded...");
    
    // Check if products table exists and is empty
    const { count: productCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error("Error checking product count:", countError);
      return false;
    }
    
    // If there are already products, no need to seed
    if (productCount && productCount > 0) {
      console.log(`Database already has ${productCount} products.`);
      return true;
    }
    
    console.log("Products table is empty. Importing products from frontend data...");
    
    // Import data from the frontend
    const { FEATURED_SOFTWARE } = await import('@/pages/Index');
    
    if (!FEATURED_SOFTWARE || FEATURED_SOFTWARE.length === 0) {
      console.log("No frontend product data found to import.");
      return false;
    }
    
    // Transform frontend data to Supabase format
    const productsToInsert = FEATURED_SOFTWARE.map(item => {
      // Convert price string to number if needed
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
        : item.price;
      
      return transformProductToSupabase({
        name: item.name,
        description: item.description || '',
        category: item.category || 'Other',
        logo: item.image || 'https://placehold.co/100x100',
        price: price || 0,
        featuredBenefit: item.featuredBenefit || null,
        benefits: item.benefits || [],
        rating: item.rating || 0,
        reviews: item.reviewCount || 0,
        popularity: item.popularity || 50,
        inStock: true,
        isHot: item.isHot || false
      });
    });
    
    // Insert products into the database
    const { data: insertedProducts, error: insertError } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select();
    
    if (insertError) {
      console.error("Error seeding products:", insertError);
      return false;
    }
    
    console.log(`Successfully seeded database with ${insertedProducts?.length} products.`);
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
}
