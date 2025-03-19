
import { setupSupabaseSchema, seedDatabaseWithFrontendData } from './supabase';
import { ProductAPI } from './api';

export async function initializeDatabase() {
  try {
    // Check table access
    const hasTableAccess = await setupSupabaseSchema();
    
    if (hasTableAccess) {
      console.log("Connected to Supabase database successfully");
      
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
        logo: "https://d546-121-242-131-242.ngrok-free.app/zeeTV.png", // Use a placeholder or update with actual Zee5 logo
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
        users: "50M+",
        inStock: true,
        isHot: true,
        banner: "https://d546-121-242-131-242.ngrok-free.app/zeeTV.png", // Use a placeholder or update with actual banner
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
