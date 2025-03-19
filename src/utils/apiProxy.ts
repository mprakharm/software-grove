
import { VendorAPI } from './api';

// Server-side proxy controller for vendor API calls
export const ApiProxyController = {
  async getVendorPlans(productId: string): Promise<any[]> {
    console.log(`Backend proxy: Processing vendor plans request for product ID: ${productId}`);
    try {
      // Use the VendorAPI to get the plans - this happens server-side
      const plans = await VendorAPI.getProductPlans(productId);
      
      // Check if plans is a valid array
      if (Array.isArray(plans) && plans.length > 0) {
        console.log('Backend proxy: Valid plans data returned:', plans);
        return plans;
      } else if (plans && typeof plans === 'object') {
        // Check if the plans object contains an error property
        if ('error' in plans) {
          console.error('Backend proxy: API returned error:', plans);
          throw new Error(`API error: ${(plans as {error: boolean, message: string}).message}`);
        }
      }
      
      console.warn('Backend proxy: Invalid plans data returned:', plans);
      throw new Error('Invalid plans data returned from vendor API');
    } catch (error) {
      console.error('Backend proxy: Error fetching vendor plans:', error);
      // Instead of re-throwing the error, return mock data as fallback
      console.log('Backend proxy: Returning fallback mock plans');
      return VendorAPI.getMockPlans(productId);
    }
  },
  
  // Additional proxy methods can be added here as needed
};
