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
      
      // Add Zee5 product with the new logo
      const newZee5Product = {
        name: "Zee5",
        description: "India's largest streaming platform with 90+ live TV channels and 1.5 lakh+ hours of content across 12 languages.",
        category: "Entertainment",
        logo: "/lovable-uploads/97ab01bd-fcd1-4430-a732-eb75dcf82497.png", // Updated Zee5 logo
        price: 60, // Updated price to INR 60
        currency: "INR", // Using INR for Zee5
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
        banner: "/lovable-uploads/97ab01bd-fcd1-4430-a732-eb75dcf82497.png", // Updated Zee5 banner
        color: "#8B5CF6", // Purple color
        vendor: "Zee Entertainment",
        discount: "25%" // Updated discount to 25%
      };
      
      await ProductAPI.addProduct(newZee5Product);
      console.log("Zee5 product added successfully");
    } else {
      console.log("Zee5 product already exists in database");
      
      // Update the existing Zee5 product with the new logo if needed
      if (zee5Product.logo !== "/lovable-uploads/97ab01bd-fcd1-4430-a732-eb75dcf82497.png" || 
          zee5Product.price !== 60 || 
          zee5Product.discount !== "25%" ||
          zee5Product.currency !== "INR") {
        console.log("Updating Zee5 product information...");
        await ProductAPI.updateProduct({
          ...zee5Product,
          logo: "/lovable-uploads/97ab01bd-fcd1-4430-a732-eb75dcf82497.png",
          banner: "/lovable-uploads/97ab01bd-fcd1-4430-a732-eb75dcf82497.png",
          price: 60,
          currency: "INR",
          discount: "25%"
        });
        console.log("Zee5 product information updated successfully");
      }
    }
  } catch (error) {
    console.error("Error adding/updating Zee5 product:", error);
  }
}

// Initialize the database when the app starts
initializeDatabase().catch(error => {
  console.error("Failed to initialize database:", error);
});

// Export the categories and products initializers if they're used elsewhere
export const initializeCategories = async () => {
  try {
    const { data: existingCategories, error: selectError } = await supabase
      .from('categories')
      .select('*');

    if (selectError) {
      console.error('Error fetching categories:', selectError);
      return;
    }

    if (existingCategories && existingCategories.length > 0) {
      console.log('Categories already initialized.');
      return;
    }

    const categories = [
      { name: 'Productivity' },
      { name: 'Design' },
      { name: 'Development' },
      { name: 'Marketing' },
      { name: 'Sales' },
      { name: 'Finance' },
      { name: 'Human Resources' },
      { name: 'IT' },
      { name: 'Operations' },
      { name: 'Customer Service' },
      { name: 'Education' },
      { name: 'Entertainment' },
    ];

    const { error: insertError } = await supabase
      .from('categories')
      .insert(categories);

    if (insertError) {
      console.error('Error inserting categories:', insertError);
    } else {
      console.log('Categories initialized successfully.');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};

export const initializeProducts = async () => {
  try {
    const { data: existingProducts, error: selectError } = await supabase
      .from('products')
      .select('*');

    if (selectError) {
      console.error('Error fetching products:', selectError);
      return;
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log('Products already initialized.');
      return;
    }

    const productSeed = [
      {
        id: "f36b3f95-6ca0-4c9c-a572-69593513289a",
        name: "Notion",
        description: "All-in-one workspace: notes, docs, tasks, wikis, and databases.",
        category: "Productivity",
        price: 8,
        currency: "USD",
        image: "/lovable-uploads/0129e999-8933-4574-b665-7a345c7f1447.png",
        logo: "/lovable-uploads/0129e999-8933-4574-b665-7a345c7f1447.png",
        vendor: "Notion Labs",
        rating: 4.7,
        reviewCount: 23456,
        discount: "10%",
        featured_benefit: "All-in-one workspace",
        benefits: [
          "Organize tasks",
          "Take notes",
          "Manage projects",
          "Build a knowledge base"
        ],
        integrations: ["Slack", "Google Drive", "Trello"],
        popularity: 95,
        trending: true
      },
      {
        id: "4b8d9c1a-7b1e-4b5a-8c4a-3b2f0a9a7b8e",
        name: "Figma",
        description: "Collaborative interface design tool.",
        category: "Design",
        price: 12,
        currency: "USD",
        image: "/lovable-uploads/59994399-4561-4a9f-8939-8f14a193a8fa.png",
        logo: "/lovable-uploads/59994399-4561-4a9f-8939-8f14a193a8fa.png",
        vendor: "Figma, Inc.",
        rating: 4.6,
        reviewCount: 18765,
        discount: "15%",
        featured_benefit: "Real-time collaboration",
        benefits: [
          "Design interfaces",
          "Prototype interactions",
          "Collaborate with team",
          "Create design systems"
        ],
        integrations: ["Slack", "Jira", "Confluence"],
        popularity: 92,
        trending: true
      },
      {
        id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        name: "Visual Studio Code",
        description: "Free source code editor made by Microsoft.",
        category: "Development",
        price: 0,
        currency: "USD",
        image: "/lovable-uploads/f649999c-a649-453a-b50f-935954799994.png",
        logo: "/lovable-uploads/f649999c-a649-453a-b50f-935954799994.png",
        vendor: "Microsoft",
        rating: 4.8,
        reviewCount: 32109,
        discount: "0%",
        featured_benefit: "Extensive customization",
        benefits: [
          "Code editing",
          "Debugging",
          "Version control",
          "Task running"
        ],
        integrations: ["GitHub", "Azure", "Docker"],
        popularity: 98,
        trending: true
      },
      {
        id: "5b3a8e2d-c7f9-4a6b-9d1e-8e9b2a3f6d4c",
        name: "HubSpot",
        description: "Marketing, sales, and service software.",
        category: "Marketing",
        price: 50,
        currency: "USD",
        image: "/lovable-uploads/49f140e3-649d-4a59-814c-914e098b5933.png",
        logo: "/lovable-uploads/49f140e3-649d-4a59-814c-914e098b5933.png",
        vendor: "HubSpot, Inc.",
        rating: 4.5,
        reviewCount: 15432,
        discount: "20%",
        featured_benefit: "Integrated platform",
        benefits: [
          "Inbound marketing",
          "Sales automation",
          "Customer service tools",
          "CRM"
        ],
        integrations: ["Salesforce", "Google Analytics", "WordPress"],
        popularity: 90,
        trending: true
      },
      {
        id: "9d7c3b1a-5e4f-4c8d-9a2b-6f0e8a4d2c1f",
        name: "Salesforce",
        description: "Cloud-based sales and CRM solutions.",
        category: "Sales",
        price: 75,
        currency: "USD",
        image: "/lovable-uploads/64992999-a649-453a-b50f-935954799994.png",
        logo: "/lovable-uploads/64992999-a649-453a-b50f-935954799994.png",
        vendor: "Salesforce, Inc.",
        rating: 4.4,
        reviewCount: 14321,
        discount: "25%",
        featured_benefit: "Customizable CRM",
        benefits: [
          "Sales automation",
          "Lead management",
          "Opportunity tracking",
          "Reporting and analytics"
        ],
        integrations: ["Microsoft Outlook", "Gmail", "LinkedIn"],
        popularity: 85,
        trending: false
      },
      {
        id: "e8fc2bab-5380-475b-b455-30b948183212",
        name: "Zee5",
        description: "Stream over 4500+ movies, 170+ originals and 120+ TV shows across 12 languages.",
        category: "Entertainment",
        price: 60, // Updated price to INR 60
        currency: "INR",
        image: "/lovable-uploads/97ab01bd-fcd1-4430-a732-eb75dcf82497.png",
        logo: "/lovable-uploads/97ab01bd-fcd1-4430-a732-eb75dcf82497.png",
        vendor: "Zee Entertainment Enterprises",
        rating: 4.3,
        reviewCount: 12458,
        discount: "25%", // Updated discount to 25%
        featured_benefit: "Multiple Language Content",
        benefits: [
          "Ad-free streaming",
          "Watch on 5 devices",
          "Full HD streaming",
          "Download and watch offline"
        ],
        integrations: ["Smart TVs", "Mobile Apps", "Web Browser"],
        popularity: 88,
        trending: true
      },
      {
        id: "b7b3b3b3-4b4b-4b4b-4b4b-4b4b4b4b4b4b",
        name: "QuickBooks",
        description: "Accounting software for managing finances.",
        category: "Finance",
        price: 30,
        currency: "USD",
        image: "/lovable-uploads/quickbooks.png",
        logo: "/lovable-uploads/quickbooks.png",
        vendor: "Intuit",
        rating: 4.2,
        reviewCount: 11234,
        discount: "10%",
        featured_benefit: "Easy financial management",
        benefits: [
          "Track income and expenses",
          "Invoice customers",
          "Run reports",
          "Manage payroll"
        ],
        integrations: ["PayPal", "Shopify", "Square"],
        popularity: 80,
        trending: false
      },
      {
        id: "c8c8c8c8-5c5c-5c5c-5c5c-5c5c5c5c5c5c",
        name: "BambooHR",
        description: "HR software for managing employees.",
        category: "Human Resources",
        price: 40,
        currency: "USD",
        image: "/lovable-uploads/bamboohr.png",
        logo: "/lovable-uploads/bamboohr.png",
        vendor: "BambooHR",
        rating: 4.1,
        reviewCount: 10123,
        discount: "15%",
        featured_benefit: "Streamlined HR processes",
        benefits: [
          "Manage employee data",
          "Track time off",
          "Run payroll",
          "Conduct performance reviews"
        ],
        integrations: ["Slack", "Google Workspace", "Microsoft 365"],
        popularity: 75,
        trending: false
      },
      {
        id: "d9d9d9d9-6d6d-6d6d-6d6d-6d6d6d6d6d6d",
        name: "ServiceNow",
        description: "IT service management platform.",
        category: "IT",
        price: 60,
        currency: "USD",
        image: "/lovable-uploads/servicenow.png",
        logo: "/lovable-uploads/servicenow.png",
        vendor: "ServiceNow",
        rating: 4.0,
        reviewCount: 9012,
        discount: "20%",
        featured_benefit: "Efficient IT management",
        benefits: [
          "Manage incidents",
          "Manage problems",
          "Manage changes",
          "Manage assets"
        ],
        integrations: ["Slack", "Microsoft Teams", "Zoom"],
        popularity: 70,
        trending: false
      },
      {
        id: "e0e0e0e0-7e7e-7e7e-7e7e-7e7e7e7e7e7e",
        name: "Asana",
        description: "Project management software for teams.",
        category: "Operations",
        price: 25,
        currency: "USD",
        image: "/lovable-uploads/asana.png",
        logo: "/lovable-uploads/asana.png",
        vendor: "Asana, Inc.",
        rating: 3.9,
        reviewCount: 8001,
        discount: "25%",
        featured_benefit: "Improved team collaboration",
        benefits: [
          "Manage tasks",
          "Track progress",
          "Collaborate with team",
          "Visualize workflows"
        ],
        integrations: ["Slack", "Google Workspace", "Microsoft Teams"],
        popularity: 65,
        trending: false
      },
      {
        id: "f1f1f1f1-8f8f-8f8f-8f8f-8f8f8f8f8f8f",
        name: "Zendesk",
        description: "Customer service software for support teams.",
        category: "Customer Service",
        price: 45,
        currency: "USD",
        image: "/lovable-uploads/zendesk.png",
        logo: "/lovable-uploads/zendesk.png",
        vendor: "Zendesk, Inc.",
        rating: 3.8,
        reviewCount: 7000,
        discount: "10%",
        featured_benefit: "Enhanced customer support",
        benefits: [
          "Manage tickets",
          "Provide self-service",
          "Track performance",
          "Automate workflows"
        ],
        integrations: ["Salesforce", "Slack", "Jira"],
        popularity: 60,
        trending: false
      },
      {
        id: "0a0a0a0a-9a9a-9a9a-9a9a-9a9a9a9a9a9a",
        name: "Coursera",
        description: "Online learning platform with courses and degrees.",
        category: "Education",
        price: 39,
        currency: "USD",
        image: "/lovable-uploads/coursera.png",
        logo: "/lovable-uploads/coursera.png",
        vendor: "Coursera, Inc.",
        rating: 4.6,
        reviewCount: 16000,
        discount: "15%",
        featured_benefit: "Wide range of courses",
        benefits: [
          "Learn new skills",
          "Earn certificates",
          "Advance your career",
          "Study at your own pace"
        ],
        integrations: ["LinkedIn", "Facebook", "Twitter"],
        popularity: 82,
        trending: true
      },
      {
        id: "1b1b1b1b-0b0b-0b0b-0b0b-0b0b0b0b0b0b",
        name: "Netflix",
        description: "Streaming service with movies and TV shows.",
        category: "Entertainment",
        price: 10,
        currency: "USD",
        image: "/lovable-uploads/netflix.png",
        logo: "/lovable-uploads/netflix.png",
        vendor: "Netflix, Inc.",
        rating: 4.4,
        reviewCount: 14000,
        discount: "0%",
        featured_benefit: "Extensive content library",
        benefits: [
          "Watch movies",
          "Watch TV shows",
          "Stream on any device",
          "Download and watch offline"
        ],
        integrations: ["Smart TVs", "Mobile Apps", "Web Browser"],
        popularity: 90,
        trending: true
      },
      {
        id: "2c2c2c2c-1c1c-1c1c-1c1c-1c1c1c1c1c1c",
        name: "Slack",
        description: "Messaging app for team communication.",
        category: "Productivity",
        price: 7,
        currency: "USD",
        image: "/lovable-uploads/slack.png",
        logo: "/lovable-uploads/slack.png",
        vendor: "Slack Technologies",
        rating: 4.5,
        reviewCount: 15000,
        discount: "10%",
        featured_benefit: "Real-time communication",
        benefits: [
          "Send messages",
          "Share files",
          "Make calls",
          "Collaborate with team"
        ],
        integrations: ["Google Workspace", "Microsoft 365", "Asana"],
        popularity: 85,
        trending: true
      },
      {
        id: "3d3d3d3d-2d2d-2d2d-2d2d-2d2d2d2d2d2d",
        name: "Adobe Photoshop",
        description: "Image editing software for professionals.",
        category: "Design",
        price: 20,
        currency: "USD",
        image: "/lovable-uploads/photoshop.png",
        logo: "/lovable-uploads/photoshop.png",
        vendor: "Adobe Systems",
        rating: 4.7,
        reviewCount: 17000,
        discount: "15%",
        featured_benefit: "Advanced image editing",
        benefits: [
          "Edit photos",
          "Create graphics",
          "Design websites",
          "Enhance images"
        ],
        integrations: ["Adobe Creative Cloud", "Behance", "Dribbble"],
        popularity: 88,
        trending: true
      },
      {
        id: "4e4e4e4e-3e3e-3e3e-3e3e-3e3e3e3e3e3e",
        name: "GitHub",
        description: "Web-based platform for version control and collaboration.",
        category: "Development",
        price: 0,
        currency: "USD",
        image: "/lovable-uploads/github.png",
        logo: "/lovable-uploads/github.png",
        vendor: "GitHub, Inc.",
        rating: 4.8,
        reviewCount: 19000,
        discount: "0%",
        featured_benefit: "Collaborative coding",
        benefits: [
          "Version control",
          "Code hosting",
          "Issue tracking",
          "Team collaboration"
        ],
        integrations: ["Slack", "Jira", "Trello"],
        popularity: 92,
        trending: true
      },
      {
        id: "5f5f5f5f-4f4f-4f4f-4f4f-4f4f4f4f4f4f",
        name: "Google Analytics",
        description: "Web analytics service for tracking website traffic.",
        category: "Marketing",
        price: 0,
        currency: "USD",
        image: "/lovable-uploads/google-analytics.png",
        logo: "/lovable-uploads/google-analytics.png",
        vendor: "Google",
        rating: 4.6,
        reviewCount: 16000,
        discount: "0%",
        featured_benefit: "Detailed website analytics",
        benefits: [
          "Track website traffic",
          "Analyze user behavior",
          "Measure conversions",
          "Optimize marketing campaigns"
        ],
        integrations: ["Google Ads", "Google Search Console", "Google Data Studio"],
        popularity: 86,
        trending: true
      },
      {
        id: "6a6a6a6a-5a5a-5a5a-5a5a-5a5a5a5a5a5a",
        name: "Zoom",
        description: "Video conferencing platform for meetings and webinars.",
        category: "Communication",
        price: 15,
        currency: "USD",
        image: "/lovable-uploads/zoom.png",
        logo: "/lovable-uploads/zoom.png",
        vendor: "Zoom Video Communications",
        rating: 4.4,
        reviewCount: 14000,
        discount: "10%",
        featured_benefit: "Reliable video conferencing",
        benefits: [
          "Host meetings",
          "Host webinars",
          "Share screens",
          "Record sessions"
        ],
        integrations: ["Slack", "Microsoft Teams", "Google Workspace"],
        popularity: 80,
        trending: true
      },
      {
        id: "7b7b7b7b-6b6b-6b6b-6b6b-6b6b6b6b6b6b",
        name: "Microsoft Office 365",
        description: "Suite of productivity apps for business and personal use.",
        category: "Productivity",
        price: 12,
        currency: "USD",
        image: "/lovable-uploads/office365.png",
        logo: "/lovable-uploads/office365.png",
        vendor: "Microsoft",
        rating: 4.5,
        reviewCount: 15000,
        discount: "15%",
        featured_benefit: "Comprehensive productivity tools",
        benefits: [
