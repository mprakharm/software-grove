
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

  // Register LinkedIn Premium API handler with correct URL and proper error handling
  VendorAPI.registerApiHandler('linkedin-premium', async (product) => {
    console.log('Calling LinkedIn Premium API for product:', product.name);
    try {
      // Correct API URL
      const apiUrl = 'https://api.getfleek.app/partner/get_available_plans';
      console.log('Attempting to fetch from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 
          'Authorization': 'ZGV2cnpwYXk6SDJmandjNVE5eUhaTHY1Ng==',
          'Content-Type': 'application/json'
        },
        // Add mode: 'cors' to explicitly request CORS
        mode: 'cors'
      });
      
      console.log('LinkedIn API response status:', response.status);
      
      if (!response.ok) {
        console.error('LinkedIn Premium API returned error status:', response.status);
        const errorText = await response.text();
        console.error('API error details:', errorText);
        throw new Error(`API returned status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('LinkedIn Premium API response data:', data);
      
      // Check if the data is in the expected format
      if (Array.isArray(data) && data.length > 0) {
        return data;
      } else {
        console.warn('LinkedIn API returned unexpected data format:', data);
        throw new Error('Unexpected data format from API');
      }
    } catch (error) {
      console.error('Error calling LinkedIn Premium API:', error);
      // Return an error object instead of null so we can distinguish between
      // a successful empty response and an error
      return { error: true, message: error.message };
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
      // First attempt to use the linkedin-premium handler
      console.log('Trying to use linkedin-premium API handler first');
      
      // Find the handler
      const premiumHandler = VendorAPI.apiRegistry['linkedin-premium'];
      if (premiumHandler && premiumHandler.handler) {
        const result = await premiumHandler.handler(product);
        
        // If we got a successful result (not an error object), use it
        if (result && !result.error) {
          console.log('Successfully retrieved data from linkedin-premium API handler');
          return result;
        }
        
        console.log('linkedin-premium API handler failed, using fallback data');
      }
            
      // Fallback to hardcoded LinkedIn Premium plans if the API call fails
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
