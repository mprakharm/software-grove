
// Front-end API service that calls our backend proxy endpoints
const API_BASE_URL = '/api';

// Front-end API service that calls our backend proxy endpoints
export const ApiService = {
  // Vendor Plans API
  async getVendorPlans(productId: string): Promise<any[]> {
    try {
      console.log(`Fetching vendor plans for product ID: ${productId} via backend proxy`);
      const response = await fetch(`${API_BASE_URL}/vendor-plans/${productId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching vendor plans: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch vendor plans: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Vendor plans data received from backend:', data);
      return data;
    } catch (error) {
      console.error('Error in getVendorPlans:', error);
      throw error;
    }
  },
  
  // Additional API methods can be added here
};
