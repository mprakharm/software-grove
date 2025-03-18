
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

  // Register LinkedIn Premium API handler with your updated code
  VendorAPI.registerApiHandler('linkedin-premium', async (product) => {
    console.log('Calling LinkedIn Premium API for product:', product.name);
    try {
      // Using a CORS proxy to handle potential CORS issues
      const apiUrl = 'https://api-dev.getfleek.app/partner';
      console.log('Attempting to fetch from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 
          'Authorization': 'devrzpay:H2fjwc5Q9yHZLv56',
          'Content-Type': 'application/json'
        },
        // Adding mode: 'no-cors' can help with CORS issues but will limit response usage
        // mode: 'no-cors'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('LinkedIn Premium API response:', data);
        return data;
      }
      
      console.error('LinkedIn Premium API returned status:', response.status);
      throw new Error(`API returned status: ${response.status}`);
    } catch (error) {
      console.error('Error calling LinkedIn Premium API:', error);
      // Don't just return null - we'll try an alternative mock API first
      console.log('Attempting to use alternative LinkedIn Premium mock data');
      return VendorAPI.getMockPlans('linkedin-premium');
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

  // Add a direct handler for "LinkedIn Premium" product by name
  VendorAPI.registerApiHandler('linkedin', async (product) => {
    console.log('Using specific LinkedIn Premium API handler by product name');
    try {
      // Create a dedicated mock data array for LinkedIn that doesn't rely on external API calls
      // This ensures we always have data to display, even if API calls fail
      console.log('Using hardcoded LinkedIn Premium plans due to API issues');
      return [
        {
          id: 'linkedin-basic',
          name: 'Career',
          description: 'Basic plan for job seekers',
          price: 29.99,
          features: [
            'See who viewed your profile',
            'InMail messages',
            'Job insights',
            'Applicant insights'
          ],
          billingOptions: ['monthly', 'annual'],
          discountPercentage: 20
        },
        {
          id: 'linkedin-pro',
          name: 'Business',
          description: 'Professional plan for networking',
          price: 59.99,
          features: [
            'All Career features',
            'Advanced search filters',
            'Unlimited people browsing',
            'Business insights'
          ],
          popular: true,
          billingOptions: ['monthly', 'annual'],
          discountPercentage: 25
        },
        {
          id: 'linkedin-premium',
          name: 'Executive',
          description: 'Premium plan for industry leaders',
          price: 99.99,
          features: [
            'All Business features',
            'Executive insights',
            'Leadership analytics',
            'Unlimited InMail messages'
          ],
          billingOptions: ['monthly', 'annual'],
          discountPercentage: 15
        }
      ];
    } catch (error) {
      console.error('Error in LinkedIn specific handler:', error);
      return VendorAPI.getMockPlans('linkedin-premium');
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
