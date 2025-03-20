import { supabase } from './supabase';

// Interface for subscription data
interface SubscriptionData {
  userId: string;
  productId?: string;
  bundleId?: string;
  planId: string;
  orderId: string;
  paymentId: string;
  signature?: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency?: string;
  status: 'active' | 'expired' | 'canceled' | 'trial';
  planName?: string;
}

// Interface for purchase data
interface PurchaseData {
  userId: string;
  productId?: string;
  bundleId?: string;
  planId: string;
  orderId: string;
  paymentId: string;
  date: string;
  amount: number;
  currency?: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
}

export const SubscriptionService = {
  /**
   * Create a new subscription for a user
   */
  async createSubscription(data: SubscriptionData) {
    console.log("Creating subscription with data:", data);
    
    try {
      // Format data for Supabase, omitting the currency field which doesn't exist in your schema
      const subscriptionData = {
        user_id: data.userId,
        product_id: data.productId,
        bundle_id: data.bundleId,
        plan_id: data.planId,
        order_id: data.orderId,
        start_date: data.startDate,
        end_date: data.endDate,
        auto_renew: true,
        price: data.amount,
        status: data.status,
        created_at: new Date().toISOString(),
        // Additional metadata
        plan_name: data.planName,
        product_name: data.planName, // This should be fetched from product data in a real app
      };
      
      // Insert into subscriptions table
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating subscription:", error);
        throw error;
      }
      
      console.log("Subscription created successfully:", subscription);
      return subscription;
    } catch (error) {
      console.error("Failed to create subscription:", error);
      throw error;
    }
  },
  
  /**
   * Record a purchase in the database
   */
  async recordPurchase(data: PurchaseData) {
    console.log("Recording purchase with data:", data);
    
    try {
      // Format data for Supabase - keeping currency since purchases table might have it
      const purchaseData = {
        user_id: data.userId,
        product_id: data.productId,
        bundle_id: data.bundleId,
        plan_id: data.planId,
        order_id: data.orderId,
        payment_id: data.paymentId,
        date: data.date,
        amount: data.amount,
        currency: data.currency || 'INR',
        status: data.status,
        description: data.description || `Purchase of ${data.planId}`,
        created_at: new Date().toISOString(),
      };
      
      // Insert into purchases table
      const { data: purchase, error } = await supabase
        .from('purchases')
        .insert(purchaseData)
        .select()
        .single();
      
      if (error) {
        console.error("Error recording purchase:", error);
        throw error;
      }
      
      console.log("Purchase recorded successfully:", purchase);
      return purchase;
    } catch (error) {
      console.error("Failed to record purchase:", error);
      throw error;
    }
  },
  
  /**
   * Get all subscriptions for a user
   */
  async getUserSubscriptions(userId: string) {
    console.log("Getting subscriptions for user:", userId);
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error("Error fetching user subscriptions:", error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} subscriptions for user ${userId}`);
      return data || [];
    } catch (error) {
      console.error("Failed to fetch user subscriptions:", error);
      throw error;
    }
  },
  
  /**
   * Get all purchases for a user
   */
  async getUserPurchases(userId: string) {
    console.log("Getting purchases for user:", userId);
    
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Error fetching user purchases:", error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} purchases for user ${userId}`);
      return data || [];
    } catch (error) {
      console.error("Failed to fetch user purchases:", error);
      throw error;
    }
  },
  
  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, userId: string) {
    console.log(`Canceling subscription ${subscriptionId} for user ${userId}`);
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('id', subscriptionId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        console.error("Error canceling subscription:", error);
        throw error;
      }
      
      console.log("Subscription canceled successfully:", data);
      return data;
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      throw error;
    }
  },
  
  /**
   * Store subscription and purchase data after a successful payment
   */
  async storeSuccessfulPayment(paymentData: {
    userId: string;
    productId: string;
    planId: string;
    orderId: string;
    paymentId: string;
    signature?: string;
    startDate: string;
    endDate: string;
    amount: number;
    currency?: string;
    planName?: string;
  }) {
    console.log("Storing successful payment data:", paymentData);
    
    try {
      // Create subscription record
      const subscription = await this.createSubscription({
        userId: paymentData.userId,
        productId: paymentData.productId,
        planId: paymentData.planId,
        orderId: paymentData.orderId,
        paymentId: paymentData.paymentId,
        signature: paymentData.signature,
        startDate: paymentData.startDate,
        endDate: paymentData.endDate,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'active',
        planName: paymentData.planName
      });
      
      // Record purchase
      const purchase = await this.recordPurchase({
        userId: paymentData.userId,
        productId: paymentData.productId,
        planId: paymentData.planId,
        orderId: paymentData.orderId,
        paymentId: paymentData.paymentId,
        date: paymentData.startDate,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'completed',
        description: `Purchase of ${paymentData.planName || paymentData.planId}`
      });
      
      console.log("Payment data stored successfully");
      return { subscription, purchase };
    } catch (error) {
      console.error("Failed to store payment data:", error);
      throw error;
    }
  }
};
