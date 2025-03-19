
import { setupSupabaseSchema, seedDatabaseWithFrontendData } from './supabase';
import { ProductAPI } from './api';
import { supabase } from './supabase';

export async function initializeDatabase() {
  try {
    // Check table access
    const hasTableAccess = await setupSupabaseSchema();
    
    if (hasTableAccess) {
      console.log("Connected to Supabase database successfully");
      
      // Update LinkedIn Premium to Zee5
      await updateLinkedInToZee5();
      
      // Seed database with frontend data if needed
      const seeded = await seedDatabaseWithFrontendData();
      if (seeded) {
        console.log("Database is ready with product data");
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

// Function to update LinkedIn Premium to Zee5
async function updateLinkedInToZee5() {
  try {
    console.log("Checking if LinkedIn Premium needs to be updated to Zee5...");
    
    // Find LinkedIn Premium product
    const { data: linkedInProduct, error: findError } = await supabase
      .from('products')
      .select('*')
      .eq('id', '673ed758-464b-469e-a504-5b649f29664d')
      .single();
    
    if (findError) {
      console.error("Error finding LinkedIn Premium product:", findError);
      return;
    }
    
    if (linkedInProduct && linkedInProduct.name === "LinkedIn Premium") {
      console.log("Updating LinkedIn Premium to Zee5...");
      
      // Update the product
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name: "Zee5",
          description: "Zee5 is India's premium streaming platform with a vast library of movies, TV shows, originals, and live TV across multiple languages.",
          logo: "https://res.cloudinary.com/dhmw8d3ka/image/upload/f_auto,q_auto,fl_lossy/v1667196921/D2C%20Merchants/Zee5/px-zee_1_t6d4ip.webp",
          price: 60,
          featured_benefit: "Unlimited entertainment across multiple devices",
          benefits: [
            "Unlimited Movies and TV Shows",
            "Supports 2 screens",
            "Watch on Mobile, TV, Laptop",
            "Ad-free experience"
          ],
          color: "#6F42C1",
          vendor: "Zee5"
        })
        .eq('id', '673ed758-464b-469e-a504-5b649f29664d');
      
      if (updateError) {
        console.error("Error updating LinkedIn Premium to Zee5:", updateError);
      } else {
        console.log("Successfully updated LinkedIn Premium to Zee5");
      }
    } else if (linkedInProduct && linkedInProduct.name === "Zee5") {
      console.log("Product is already updated to Zee5");
    } else {
      console.log("LinkedIn Premium product not found or has unexpected name:", linkedInProduct?.name);
    }
  } catch (error) {
    console.error("Error in updateLinkedInToZee5:", error);
  }
}

// Initialize the database when the app starts
initializeDatabase().catch(error => {
  console.error("Failed to initialize database:", error);
});
