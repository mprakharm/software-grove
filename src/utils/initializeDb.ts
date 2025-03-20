
import { setupSupabaseSchema, seedDatabaseWithFrontendData } from './supabase';
import { ProductAPI } from './api';
import { VendorAPI } from './api';
import { supabase } from './supabase';

export async function initializeDatabase() {
  try {
    // Register Zee5 API handler (using LinkedIn's handler as a template)
    VendorAPI.registerApiHandler('zee5', async (product) => {
      console.log('Using Zee5 API handler');
      // Use the same API endpoint as LinkedIn Premium
      return await VendorAPI.apiRegistry['linkedin-premium'].handler(product);
    });

    // Check table access
    const hasTableAccess = await setupSupabaseSchema();
    
    if (hasTableAccess) {
      console.log("Connected to Supabase database successfully");
      
      // Ensure subscriptions and purchases tables have the necessary fields
      await setupSubscriptionTables();
      
      // Force refresh the Supabase schema cache
      await refreshSupabaseSchemaCache();
      
      // Seed database with frontend data if needed
      const seeded = await seedDatabaseWithFrontendData();
      if (seeded) {
        console.log("Database is ready with product data");

        // Add Zee5 product if it doesn't exist
        await addZee5Product();
        
      } else {
        console.log("Some products may need to be added manually");
      }

      // Force refresh of products in memory
      await ProductAPI.getProducts();
      
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

// Function to refresh Supabase schema cache
async function refreshSupabaseSchemaCache() {
  console.log("Refreshing Supabase schema cache...");
  try {
    // First approach: Perform a simple query to force schema refresh
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
      
    // Second approach: Try to explicitly refresh the schema (if supported by the client)
    try {
      // @ts-ignore - This is not in the official API but may work in some versions
      if (typeof supabase.refreshSchema === 'function') {
        await supabase.refreshSchema();
      }
    } catch (schemaRefreshError) {
      console.log("Schema refresh method not available, continuing with queries");
    }
    
    // Also refresh purchases table schema
    await supabase
      .from('purchases')
      .select('*')
      .limit(1);
      
    console.log("Schema cache refresh completed");
  } catch (refreshError) {
    console.error("Error refreshing schema cache:", refreshError);
  }
}

// Function to ensure subscriptions and purchases tables have all required fields
async function setupSubscriptionTables() {
  try {
    // Check if the subscriptions table exists
    const { data: subscriptionFields, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
      
    if (subscriptionsError && subscriptionsError.code === '42P01') {
      console.error("Subscriptions table doesn't exist. Please create it in the Supabase dashboard.");
    } else {
      console.log("Subscriptions table exists. Making sure it has the required fields.");
      
      // Add the currency column to the subscriptions table if it doesn't exist
      try {
        console.log("Checking if currency column exists in subscriptions table...");
        const { error: alterTableError } = await supabase.rpc('add_column_if_not_exists', { 
          table_name: 'subscriptions',
          column_name: 'currency',
          column_type: 'text'
        });
        
        if (alterTableError) {
          console.error("Error adding currency column:", alterTableError);
          console.log("You may need to manually add the 'currency' column to the 'subscriptions' table in your Supabase dashboard.");
        } else {
          console.log("Currency column exists or was successfully added to subscriptions table.");
        }
      } catch (columnError) {
        console.error("Error checking/adding currency column:", columnError);
        console.log("You may need to manually add the 'currency' column to the 'subscriptions' table in your Supabase dashboard.");
      }
      
      // Check if the purchases table exists and has all required fields
      const { data: purchaseFields, error: purchasesError } = await supabase
        .from('purchases')
        .select('id')
        .limit(1);
        
      if (purchasesError && purchasesError.code === '42P01') {
        console.error("Purchases table doesn't exist. Please create it in the Supabase dashboard.");
      } else {
        console.log("Purchases table exists.");
        
        // Also check and add currency column to purchases table if needed
        try {
          console.log("Checking if currency column exists in purchases table...");
          const { error: purchaseAlterError } = await supabase.rpc('add_column_if_not_exists', { 
            table_name: 'purchases',
            column_name: 'currency',
            column_type: 'text'
          });
          
          if (purchaseAlterError) {
            console.error("Error adding currency column to purchases:", purchaseAlterError);
            console.log("You may need to manually add the 'currency' column to the 'purchases' table in your Supabase dashboard.");
          } else {
            console.log("Currency column exists or was successfully added to purchases table.");
          }
        } catch (purchaseColumnError) {
          console.error("Error checking/adding currency column to purchases:", purchaseColumnError);
          console.log("You may need to manually add the 'currency' column to the 'purchases' table in your Supabase dashboard.");
        }
      }
    }
  } catch (error) {
    console.error("Error setting up subscription tables:", error);
  }
}

// Function to add Zee5 product to the database
async function addZee5Product() {
  try {
    // Check if Zee5 already exists
    const products = await ProductAPI.getProducts();
    const zee5Product = products.find(p => p.name === "Zee5");
    
    if (!zee5Product) {
      console.log("Adding Zee5 product to database...");
      
      // Add Zee5 product
      const newZee5Product = {
        name: "Zee5",
        description: "India's largest streaming platform with 90+ live TV channels and 1.5 lakh+ hours of content across 12 languages.",
        category: "Entertainment",
        logo: "https://8bf8-121-242-131-242.ngrok-free.app/zeeTV.png", // Use a placeholder or update with actual Zee5 logo
        price: 99,
        featuredBenefit: "Access to premium Zee5 original shows, movies, and live TV channels",
        benefits: [
          "Stream on 5 devices simultaneously",
          "Full HD and 4K streaming quality",
          "Ad-free viewing experience",
          "Download content for offline viewing"
        ],
        integration: ["Android", "iOS", "Smart TV", "Web"],
        popularity: 92,
        rating: 4.6,
        reviews: 12500,
        users: 50000000, // Changed from "50M+" string to a numeric value
        inStock: true,
        isHot: true,
        banner: "https://8bf8-121-242-131-242.ngrok-free.app/zeeTV.png", // Use a placeholder or update with actual banner
        color: "#8B5CF6", // Purple color
        vendor: "Zee Entertainment"
      };
      
      await ProductAPI.addProduct(newZee5Product);
      console.log("Zee5 product added successfully");
    } else {
      console.log("Zee5 product already exists in database");
    }
  } catch (error) {
    console.error("Error adding Zee5 product:", error);
  }
}

// Initialize the database when the app starts
initializeDatabase().catch(error => {
  console.error("Failed to initialize database:", error);
});
