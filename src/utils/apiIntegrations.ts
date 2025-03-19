import { VendorAPI } from './api';
import { ApiProxyController } from './apiProxy';

// Function to initialize all API integrations
export function initializeApiIntegrations() {
  console.log('Initializing API integrations...');
  
  // Register API handlers for different products
  // This could be loaded from a configuration file or database in a real application
  
  // Example: Register a custom API handler for Adobe products
  VendorAPI.registerApiHandler('adobe', async (product) => {
    console.log('Calling Adobe API for product:', product.name);
    try {
      // Server-side API call
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
    console.log('Server-side: Calling LinkedIn Premium API for product:', product.name);
    try {
      // Correct API URL - this is a server-side call
      const apiUrl = 'https://d547-121-242-131-242.ngrok-free.app/proxy/getfleek_list';
      console.log('Server-side: Attempting to fetch from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      
      console.log('Server-side: LinkedIn API response status:', response.status);
      
      if (!response.ok) {
        console.error('Server-side: LinkedIn Premium API returned error status:', response.status);
        const errorText = await response.text();
        console.error('Server-side: API error details:', errorText);
        throw new Error(`API returned status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Server-side: LinkedIn Premium API response data:', data);
      
      // Process the API data to ensure plan_id=plan_A0qs3dlK is prioritized
      if (Array.isArray(data) && data.length > 0) {
        // Check if we have a plan_list format
        if (data[0] && data[0].plan_list && Array.isArray(data[0].plan_list)) {
          const processedData = [...data];
          
          // Find any product with plan_id=plan_A0qs3dlK in its plan_list
          for (const product of processedData) {
            if (product.plan_list && Array.isArray(product.plan_list)) {
              // Check if the target plan exists
              const targetPlan = product.plan_list.find((plan: any) => plan.plan_id === 'plan_A0qs3dlK');
              
              if (targetPlan) {
                console.log('Server-side: Found target plan_id=plan_A0qs3dlK', targetPlan);
                // Move the target plan to the front of the list
                product.plan_list = [
                  targetPlan,
                  ...product.plan_list.filter((plan: any) => plan.plan_id !== 'plan_A0qs3dlK')
                ];
              }
            }
          }
          
          return processedData;
        }
      }
      
      // Return the unmodified data if it doesn't match our expected format
      return data;
    } catch (error: any) {
      console.error('Server-side: Error calling LinkedIn Premium API:', error);
      // Return an error object instead of null
      return { error: true, message: error.message };
    }
  });
  
  // Add LinkedIn test API endpoint (for development/testing)
  VendorAPI.registerApiHandler('linkedin-test', async (product) => {
    console.log('Server-side: Using LinkedIn test API endpoint');
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
      console.error('Server-side: Error calling LinkedIn test API:', error);
      return null;
    }
  });

  // Add a direct handler for "LinkedIn Premium" product by name
  VendorAPI.registerApiHandler('linkedin', async (product) => {
    console.log('Server-side: Using specific LinkedIn Premium API handler by product name');
    try {
      // First attempt to use the linkedin-premium handler
      console.log('Server-side: Trying to use linkedin-premium API handler first');
      
      // Find the handler
      const premiumHandler = VendorAPI.apiRegistry['linkedin-premium'];
      if (premiumHandler && premiumHandler.handler) {
        const result = await premiumHandler.handler(product);
        
        // If we got a successful result (not an error object), use it
        if (result && !result.error) {
          console.log('Server-side: Successfully retrieved data from linkedin-premium API handler');
          return result;
        }
        
        console.log('Server-side: linkedin-premium API handler failed, using fallback data');
      }
            
      // Fallback to hardcoded LinkedIn Premium plans if the API call fails
      console.log('Server-side: Using hardcoded LinkedIn Premium plans due to API issues');
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
      console.error('Server-side: Error in LinkedIn specific handler:', error);
      return VendorAPI.getMockPlans('linkedin-premium');
    }
  });

  // Register Zee5 API handler (same as LinkedIn Premium)
  VendorAPI.registerApiHandler('zee5', async (product) => {
    console.log('Server-side: Using specific Zee5 API handler by product name');
    try {
      // First attempt to use the linkedin-premium handler (same endpoint)
      console.log('Server-side: Trying to use linkedin-premium API handler first for Zee5');
      
      // Find the handler
      const premiumHandler = VendorAPI.apiRegistry['linkedin-premium'];
      if (premiumHandler && premiumHandler.handler) {
        const result = await premiumHandler.handler(product);
        
        // If we got a successful result (not an error object), use it
        if (result && !result.error) {
          console.log('Server-side: Successfully retrieved data from API handler for Zee5');
          // Modify the data to reflect Zee5 instead of LinkedIn
          if (Array.isArray(result) && result.length > 0) {
            const modifiedResult = [...result];
            for (const item of modifiedResult) {
              if (item.name && typeof item.name === 'string') {
                item.name = item.name.replace(/LinkedIn|Career|Business|Executive/gi, match => {
                  switch (match.toLowerCase()) {
                    case 'linkedin': return 'Zee5';
                    case 'career': return 'Basic';
                    case 'business': return 'Premium';
                    case 'executive': return 'All Access';
                    default: return match;
                  }
                });
              }
              if (item.description && typeof item.description === 'string') {
                item.description = item.description.replace(/LinkedIn|professional/gi, match => 
                  match.toLowerCase() === 'linkedin' ? 'Zee5' : 'entertainment');
              }
              // Update features to be entertainment focused
              if (item.features && Array.isArray(item.features)) {
                item.features = item.features.map((feature: string) => 
                  feature.replace(/InMail|profile|applicant|job/gi, match => {
                    switch (match.toLowerCase()) {
                      case 'inmail': return 'Premium Content';
                      case 'profile': return 'Profile';
                      case 'applicant': return 'Streaming Quality';
                      case 'job': return 'Content';
                      default: return match;
                    }
                  })
                );
              }
            }
            return modifiedResult;
          }
          return result;
        }
        
        console.log('Server-side: API handler failed for Zee5, using fallback data');
      }
            
      // Fallback to hardcoded Zee5 plans if the API call fails
      console.log('Server-side: Using hardcoded Zee5 plans due to API issues');
      return [
        {
          id: 'zee5-basic',
          name: 'Zee5 Basic',
          description: 'Basic plan for entertainment enthusiasts',
          price: 99,
          features: [
            'Access to all Zee5 Originals',
            'Stream on 1 device at a time',
            'HD streaming quality',
            'Ad-supported streaming'
          ],
          billingOptions: ['monthly'],
          discountPercentage: 0
        },
        {
          id: 'zee5-premium',
          name: 'Zee5 Premium',
          description: 'Premium plan for ultimate entertainment experience',
          price: 199,
          features: [
            'All Basic features',
            'Ad-free viewing experience',
            'Stream on 3 devices simultaneously',
            'Full HD streaming quality'
          ],
          popular: true,
          billingOptions: ['monthly'],
          discountPercentage: 0
        },
        {
          id: 'zee5-all-access',
          name: 'Zee5 All Access',
          description: 'Complete access to all Zee5 content and features',
          price: 299,
          features: [
            'All Premium features',
            'Stream on 5 devices simultaneously',
            '4K streaming where available',
            'Early access to new releases'
          ],
          billingOptions: ['monthly'],
          discountPercentage: 0
        }
      ];
    } catch (error) {
      console.error('Server-side: Error in Zee5 specific handler:', error);
      return VendorAPI.getMockPlans('zee5');
    }
  });
  
  console.log('API integrations initialized');
  
  // Set up API routes for proxying vendor API calls
  setupApiRoutes();
}

// In a real application, this would be handled by a server framework like Express
// For this simulation, we're creating a mock API endpoint handler
function setupApiRoutes() {
  // Use the fetch API interception pattern to simulate backend routes
  const originalFetch = window.fetch;
  
  window.fetch = async function(input, init) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    
    // Handle vendor plans API endpoint
    if (url.startsWith('/api/vendor-plans/')) {
      const productId = url.split('/api/vendor-plans/')[1];
      
      console.log(`Mock API server: Received request for product plans: ${productId}`);
      try {
        const plans = await ApiProxyController.getVendorPlans(productId);
        
        // Create a mock Response object
        return new Response(JSON.stringify(plans), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Mock API server: Error processing vendor plans request:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Pass through to the original fetch for all other requests
    return originalFetch.call(window, input, init);
  };
  
  console.log('API routes initialized');
}

// Helper function to test a specific product API
export async function testProductApi(productId: string) {
  console.log(`Testing API for product: ${productId}`);
  
  const plans = await ApiProxyController.getVendorPlans(productId);
  console.log('Plans returned:', plans);
  
  return plans;
}
