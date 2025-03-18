
import { VendorAPI } from './api';

// Function to initialize all API integrations
export function initializeApiIntegrations() {
  console.log('Initializing API integrations...');
  
  // Register API handlers for different products
  // This could be loaded from a configuration file or database in a real application
  
  // Example: Register a custom API handler for Adobe products
  VendorAPI.registerApiHandler('adobe', async (product) => {
    console.log('Calling Adobe API for product:', product.name);
    try {
      // Example API call
      const response = await fetch('https://api.example.com/adobe/plans', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error calling Adobe API:', error);
      return null;
    }
  });

  // Register LinkedIn Premium API handler
  VendorAPI.registerApiHandler('linkedin-premium', async (product) => {
    console.log('Calling LinkedIn Premium API for product:', product.name);
    try {
      // Replace with your actual LinkedIn API endpoint
      const response = await fetch('https://api.yourcompany.com/linkedin/premium/plans', {
        method: 'GET',
        headers: { 
          'Authorization': 'Bearer YOUR_LINKEDIN_API_KEY',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('LinkedIn Premium API response:', data);
        return data;
      }
      console.error('LinkedIn Premium API returned an error status:', response.status);
      return null;
    } catch (error) {
      console.error('Error calling LinkedIn Premium API:', error);
      return null;
    }
  });
  
  // Add LinkedIn test API endpoint (for development/testing)
  VendorAPI.registerApiHandler('linkedin-test', async (product) => {
    console.log('Using LinkedIn test API endpoint');
    try {
      // This would point to your test server or mock API
      const response = await fetch('http://localhost:3001/api/linkedin/plans', {
        method: 'GET'
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error calling LinkedIn test API:', error);
      return null;
    }
  });
  
  console.log('API integrations initialized');
}

// Helper function to test a specific product API
export async function testProductApi(productId: string) {
  console.log(`Testing API for product: ${productId}`);
  
  const plans = await VendorAPI.getProductPlans(productId);
  console.log('Plans returned:', plans);
  
  return plans;
}
