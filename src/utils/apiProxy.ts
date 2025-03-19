
import { VendorAPI } from './api';
import { RazorpayService } from './razorpayService';

// Server-side proxy controller for vendor API calls
export const ApiProxyController = {
  async getVendorPlans(productId: string): Promise<any[]> {
    console.log(`Backend proxy: Processing vendor plans request for product ID: ${productId}`);
    try {
      // Handle Zee5 with real API endpoint like LinkedIn Premium
      if (productId === 'zee5') {
        console.log('Backend proxy: Processing Zee5 plans request with real API');
      }
      
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
          
          // Create a proper error message with a safe fallback
          const errorMessage = 'message' in plans && typeof plans.message === 'string' 
            ? plans.message 
            : 'Unknown error from vendor API';
            
          throw new Error(`API error: ${errorMessage}`);
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
  
  // Create Razorpay order
  async createRazorpayOrder(orderData: any): Promise<any> {
    console.log('Backend proxy: Creating Razorpay order with data:', orderData);
    try {
      // Convert frontend order data to Razorpay format
      const razorpayOrderRequest = {
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          productId: orderData.productId,
          planId: orderData.planId,
          planName: orderData.planName,
          userEmail: orderData.userEmail
        },
        user_id: orderData.userId,
        product_id: orderData.productId,
        plan_id: orderData.planId
      };
      
      // Call Razorpay service to create order
      const order = await RazorpayService.createOrder(razorpayOrderRequest);
      return order;
    } catch (error) {
      console.error('Backend proxy: Error creating Razorpay order:', error);
      throw error;
    }
  },
  
  // Verify Razorpay payment
  async verifyRazorpayPayment(paymentData: any): Promise<any> {
    console.log('Backend proxy: Verifying Razorpay payment:', paymentData);
    try {
      const success = await RazorpayService.processSuccessfulPayment(
        paymentData.orderId,
        paymentData.paymentId,
        paymentData.signature
      );
      
      if (success) {
        return { success: true, message: 'Payment verified successfully' };
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Backend proxy: Error verifying Razorpay payment:', error);
      throw error;
    }
  }
};
