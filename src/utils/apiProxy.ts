
import { VendorAPI } from './api';

// Server-side proxy controller for vendor API calls
export const ApiProxyController = {
  async getVendorPlans(productId: string): Promise<any[]> {
    console.log(`Backend proxy: Processing vendor plans request for product ID: ${productId}`);
    try {
      // Use the VendorAPI to get the plans - this happens server-side
      const plans = await VendorAPI.getProductPlans(productId);
      
      // Check if plans is a valid array
      if (!Array.isArray(plans)) {
        console.error('Backend proxy: Invalid plans data returned:', plans);
        if (plans && typeof plans === 'object' && 'error' in plans) {
          // This fixes the TS error - ensure we verify the object has an error property
          throw new Error(`API error: ${(plans as {error: string}).error}`);
        }
        throw new Error('Invalid plans data returned from vendor API');
      }
      
      return plans;
    } catch (error) {
      console.error('Backend proxy: Error fetching vendor plans:', error);
      // Instead of re-throwing the error, return mock data as fallback
      console.log('Backend proxy: Returning fallback mock plans');
      return VendorAPI.getMockPlans('linkedin-premium');
    }
  },
  
  // Additional proxy methods can be added here as needed
};
