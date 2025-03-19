
import { supabase, setupSupabaseSchema, seedDatabaseWithFrontendData } from '@/utils/supabase';
import { ProductAPI } from '@/utils/api';
import { BUNDLE_CATEGORIES } from '@/data/bundlesData';

// Initialize the database schema and seed with demo data
export async function initializeDatabase() {
  console.log("Initializing database...");
  
  // Check/setup schema
  const schemaReady = await setupSupabaseSchema();
  if (!schemaReady) {
    console.error("Failed to verify schema. Check Supabase console.");
    return false;
  }
  
  // Seed with frontend data if needed
  const seeded = await seedDatabaseWithFrontendData();
  if (!seeded) {
    console.warn("Seeding skipped or failed. Check if data already exists.");
  }
  
  // Ensure LinkedIn Premium exists
  const linkedinProduct = await ProductAPI.getProductByNameOrId('LinkedIn Premium');
  if (!linkedinProduct) {
    console.log("Adding LinkedIn Premium product...");
    try {
      await ProductAPI.addProduct({
        name: 'LinkedIn Premium',
        description: 'Premium subscription service by LinkedIn that offers advanced networking, job search, and professional development features.',
        category: 'Professional Network',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png',
        price: 29.99,
        currency: 'USD',
        featuredBenefit: 'Connect and engage with industry professionals',
        benefits: [
          'InMail Messages',
          'Who\'s Viewed Your Profile',
          'Applicant Insights',
          'LinkedIn Learning'
        ],
        integration: [],
        popularity: 92,
        rating: 4.6,
        reviews: 12500,
        users: 75000,
        inStock: true,
        isHot: true,
        banner: '',
        color: '#0077B5',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png',
        vendor: 'LinkedIn'
      });
      console.log("LinkedIn Premium added successfully.");
    } catch (error) {
      console.error("Error adding LinkedIn Premium:", error);
    }
  } else {
    console.log("LinkedIn Premium already exists:", linkedinProduct.id);
  }
  
  // Ensure Salesforce product exists
  const salesforceProduct = await ProductAPI.getProductByNameOrId('Salesforce');
  if (!salesforceProduct) {
    console.log("Adding Salesforce product...");
    try {
      await ProductAPI.addProduct({
        name: 'Salesforce',
        description: 'Customer relationship management platform that brings companies and customers together.',
        category: 'CRM',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png',
        price: 25,
        currency: 'USD',
        featuredBenefit: 'Manage customer relationships effectively',
        benefits: [
          'Contact Management',
          'Lead Management',
          'Sales Forecasting',
          'Workflow Automation'
        ],
        integration: ['Microsoft 365', 'Google Workspace', 'Slack'],
        popularity: 88,
        rating: 4.5,
        reviews: 15000,
        users: 150000,
        inStock: true,
        isHot: true,
        banner: '',
        color: '#00A1E0',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png',
        vendor: 'Salesforce'
      });
      console.log("Salesforce added successfully.");
    } catch (error) {
      console.error("Error adding Salesforce:", error);
    }
  } else {
    console.log("Salesforce already exists:", salesforceProduct.id);
  }
  
  console.log("Database initialization completed.");
  return true;
}

// Ensure all necessary bundles exist
export async function initializeBundles() {
  // Stub function for now - would create default bundles
  return true;
}

// Check if any schema migrations are needed
export async function checkForMigrations() {
  // For now, this is just a placeholder
  return true;
}

// Main initialization function - call this at application startup
export async function initializeApp() {
  console.log("Initializing application...");
  
  // Initialize database
  const dbInitialized = await initializeDatabase();
  if (!dbInitialized) {
    console.warn("Database initialization incomplete. Some features may not work correctly.");
  }
  
  // Initialize bundles
  const bundlesInitialized = await initializeBundles();
  if (!bundlesInitialized) {
    console.warn("Bundles initialization incomplete. Some features may not work correctly.");
  }
  
  // Check for migrations
  const migrationsChecked = await checkForMigrations();
  if (!migrationsChecked) {
    console.warn("Migration check failed. Application may not work correctly.");
  }
  
  console.log("Application initialization completed.");
  return dbInitialized && bundlesInitialized && migrationsChecked;
}
