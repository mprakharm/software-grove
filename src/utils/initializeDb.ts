
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
      
      // Force refresh the Supabase schema cache with multiple approaches
      await forceSchemaRefresh();
      
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

// Function to aggressively refresh Supabase schema cache
async function forceSchemaRefresh() {
  console.log("Aggressively refreshing Supabase schema cache...");
  
  try {
    // Try multiple queries to force schema refresh for subscriptions
    for (let i = 0; i < 3; i++) {
      console.log(`Schema refresh attempt ${i+1} for subscriptions...`);
      
      // Query with explicit column selection
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('id, user_id, product_id, bundle_id, plan_id, order_id, payment_id, currency, status, plan_name')
          .limit(1);
          
        if (!error) {
          console.log("Subscription schema refresh with explicit columns successful");
          break;
        }
      } catch (explicitError) {
        console.log("Explicit column query failed, trying alternate approach");
      }
      
      // Try with all columns wildcard
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .limit(1);
          
        if (!error) {
          console.log("Subscription schema refresh with wildcard successful");
        }
      } catch (wildcardError) {
        console.log("Wildcard query failed, trying next approach");
      }
      
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Repeat for purchases table
    for (let i = 0; i < 3; i++) {
      console.log(`Schema refresh attempt ${i+1} for purchases...`);
      
      // Query with explicit column selection
      try {
        const { data, error } = await supabase
          .from('purchases')
          .select('id, user_id, product_id, bundle_id, plan_id, order_id, payment_id, currency, description')
          .limit(1);
          
        if (!error) {
          console.log("Purchases schema refresh with explicit columns successful");
          break;
        }
      } catch (explicitError) {
        console.log("Explicit column query failed, trying alternate approach");
      }
      
      // Try with all columns wildcard
      try {
        const { data, error } = await supabase
          .from('purchases')
          .select('*')
          .limit(1);
          
        if (!error) {
          console.log("Purchases schema refresh with wildcard successful");
        }
      } catch (wildcardError) {
        console.log("Wildcard query failed, trying next approach");
      }
      
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log("Schema cache refresh attempts completed");
  } catch (refreshError) {
    console.error("Error during aggressive schema refresh:", refreshError);
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
      
      // Add required columns to the subscriptions table
      const requiredColumns = [
        { name: 'currency', type: 'text' },
        { name: 'order_id', type: 'text' },
        { name: 'payment_id', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'plan_name', type: 'text' }
      ];
      
      for (const column of requiredColumns) {
        try {
          console.log(`Checking if ${column.name} column exists in subscriptions table...`);
          const { error: alterTableError } = await supabase.rpc('add_column_if_not_exists', { 
            table_name: 'subscriptions',
            column_name: column.name,
            column_type: column.type
          });
          
          if (alterTableError) {
            console.error(`Error adding ${column.name} column:`, alterTableError);
            console.log(`You may need to manually add the '${column.name}' column to the 'subscriptions' table in your Supabase dashboard.`);
          } else {
            console.log(`${column.name} column exists or was successfully added to subscriptions table.`);
          }
        } catch (columnError) {
          console.error(`Error checking/adding ${column.name} column:`, columnError);
        }
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
        
        // Add required columns to the purchases table
        const purchaseRequiredColumns = [
          { name: 'currency', type: 'text' },
          { name: 'order_id', type: 'text' },
          { name: 'payment_id', type: 'text' },
          { name: 'description', type: 'text' }
        ];
        
        for (const column of purchaseRequiredColumns) {
          try {
            console.log(`Checking if ${column.name} column exists in purchases table...`);
            const { error: purchaseAlterError } = await supabase.rpc('add_column_if_not_exists', { 
              table_name: 'purchases',
              column_name: column.name,
              column_type: column.type
            });
            
            if (purchaseAlterError) {
              console.error(`Error adding ${column.name} column to purchases:`, purchaseAlterError);
              console.log(`You may need to manually add the '${column.name}' column to the 'purchases' table in your Supabase dashboard.`);
            } else {
              console.log(`${column.name} column exists or was successfully added to purchases table.`);
            }
          } catch (purchaseColumnError) {
            console.error(`Error checking/adding ${column.name} column to purchases:`, purchaseColumnError);
          }
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
