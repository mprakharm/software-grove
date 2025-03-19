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
    
    // If there are already products, check if LinkedIn Premium exists
    if (productCount && productCount > 0) {
      console.log(`Database already has ${productCount} products.`);
      
      // Check if LinkedIn Premium exists by name instead of ID
      const { data: linkedinProduct, error: linkedinError } = await supabase
        .from('products')
        .select('*')
        .eq('name', 'LinkedIn Premium')
        .single();
      
      // If LinkedIn Premium doesn't exist, add it
      if (linkedinError || !linkedinProduct) {
        console.log("Adding LinkedIn Premium to the database...");
        
        const linkedinPremium = {
          name: 'LinkedIn Premium',
          description: 'Premium subscription service by LinkedIn that offers advanced networking, job search, and professional development features.',
          category: 'Professional Network',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png',
          price: 29.99,
          featured_benefit: 'Connect and engage with industry professionals',
          benefits: [
            'InMail Messages',
            'Who\'s Viewed Your Profile',
            'Applicant Insights',
            'LinkedIn Learning'
          ],
          rating: 4.6,
          reviews: 12500,
          users: 75000,
          in_stock: true,
          is_hot: true,
          popularity: 92,
          created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
          .from('products')
          .insert(linkedinPremium)
          .select();
        
        if (error) {
          console.error("Error adding LinkedIn Premium:", error);
          return false;
        }
        
        console.log("Successfully added LinkedIn Premium to the database.");
      } else {
        console.log("LinkedIn Premium already exists in the database.");
      }
      
      return true;
    }
    
    console.log("Products table is empty. Importing products from frontend data...");
    
    // Import data from the frontend
    const { FEATURED_SOFTWARE } = await import('@/pages/Index');
    
    if (!FEATURED_SOFTWARE || FEATURED_SOFTWARE.length === 0) {
      console.log("No frontend product data found to import.");
      return false;
    }
    
    // Create LinkedIn Premium object without ID field (let Supabase generate UUID)
    const linkedinPremium = {
      name: 'LinkedIn Premium',
      description: 'Premium subscription service by LinkedIn that offers advanced networking, job search, and professional development features.',
      category: 'Professional Network',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png',
      price: 29.99,
      featured_benefit: 'Connect and engage with industry professionals',
      benefits: [
        'InMail Messages',
        'Who\'s Viewed Your Profile',
        'Applicant Insights',
        'LinkedIn Learning'
      ],
      rating: 4.6,
      reviews: 12500,
      users: 75000,
      in_stock: true,
      is_hot: true,
      popularity: 92,
      created_at: new Date().toISOString()
    };
    
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
        // Handle missing properties in the frontend data
        featuredBenefit: null,
        benefits: [],
        popularity: 50,
        rating: item.rating || 0,
        reviews: item.reviewCount || 0,
        inStock: true,
        isHot: false,
        integration: []
      });
    });
    
    // Add LinkedIn Premium to products to insert
    productsToInsert.push(linkedinPremium);
    
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
