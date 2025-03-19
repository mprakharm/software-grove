
// This service handles Razorpay API interactions
import { supabase } from './supabase';

// Razorpay test credentials (these would normally be in environment variables)
// Do not use these credentials in production
const RAZORPAY_KEY_ID = 'rzp_test_Qk71AJmUSRc1Oi';
const RAZORPAY_KEY_SECRET = 'i5GWHCPoDcSV14JLbZWV73uQ';

export interface RazorpayOrderRequest {
  amount: number;      // Amount in smallest currency unit (paise for INR)
  currency: string;    // Currency code (e.g., INR)
  receipt: string;     // Your internal order ID
  notes?: Record<string, string>; // Optional metadata
  plan_id?: string;    // The plan ID from your system
  product_id?: string; // The product ID from your system
  user_id?: string;    // The user ID from your system
}

export interface RazorpayOrderResponse {
  id: string;          // Razorpay Order ID
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export const RazorpayService = {
  // Create a new order with Razorpay
  async createOrder(orderData: RazorpayOrderRequest): Promise<RazorpayOrderResponse> {
    try {
      console.log('Creating Razorpay order with data:', orderData);

      // For testing purposes, we'll create a mock order without calling the actual API
      // In production, you would call Razorpay's API here
      const order: RazorpayOrderResponse = {
        id: `order_${Math.random().toString(36).substring(2, 15)}`,
        entity: 'order',
        amount: orderData.amount,
        amount_paid: 0,
        amount_due: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        status: 'created',
        created_at: Math.floor(Date.now() / 1000)
      };

      // Store order in database for reference
      await supabase.from('orders').insert({
        razorpay_order_id: order.id,
        user_id: orderData.user_id,
        product_id: orderData.product_id,
        plan_id: orderData.plan_id,
        amount: orderData.amount / 100, // Convert from paise to rupees
        currency: orderData.currency,
        status: 'created',
        metadata: orderData.notes
      });

      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  },

  // Verify payment signature to confirm it's legitimate
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    try {
      // In a real implementation, you would use crypto to verify the signature
      // For testing, we'll just return true
      console.log('Verifying payment signature:', { orderId, paymentId, signature });
      return true;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  },

  // Process a successful payment
  async processSuccessfulPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    try {
      // Verify payment signature
      const isValidSignature = this.verifyPaymentSignature(
        orderId,
        paymentId,
        signature
      );

      if (!isValidSignature) {
        console.error('Invalid payment signature');
        return false;
      }

      // Get order details from database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('razorpay_order_id', orderId)
        .single();

      if (orderError || !orderData) {
        console.error('Order not found:', orderError);
        return false;
      }

      // Update order status in database
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_id: paymentId,
          payment_signature: signature,
          paid_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', orderId);

      if (updateError) {
        console.error('Error updating order status:', updateError);
        return false;
      }

      // Create subscription record
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Assuming 1-month subscription

      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: orderData.user_id,
          product_id: orderData.product_id,
          plan_id: orderData.plan_id,
          order_id: orderId,
          payment_id: paymentId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active',
          auto_renew: true,
          price: orderData.amount
        });

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError);
        return false;
      }

      // Record the purchase
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: orderData.user_id,
          product_id: orderData.product_id,
          plan_id: orderData.plan_id,
          date: new Date().toISOString(),
          amount: orderData.amount,
          status: 'paid',
          description: `Subscription payment for ${orderData.product_id}`
        });

      if (purchaseError) {
        console.error('Error recording purchase:', purchaseError);
        // Non-critical error, continue
      }

      return true;
    } catch (error) {
      console.error('Error processing payment:', error);
      return false;
    }
  }
};
