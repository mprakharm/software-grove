
import { VendorAPI } from './api';

// Server-side proxy controller for vendor API calls
export const ApiProxyController = {
  async getVendorPlans(productId: string): Promise<any[]> {
    console.log(`Backend proxy: Processing vendor plans request for product ID: ${productId}`);
    try {
      // Use the VendorAPI to get the plans - this happens server-side
      const plans = await VendorAPI.getProductPlans(productId);
      return plans;
    } catch (error) {
      console.error('Backend proxy: Error fetching vendor plans:', error);
      throw error;
    }
  },
  
  // Additional proxy methods can be added here as needed
};
