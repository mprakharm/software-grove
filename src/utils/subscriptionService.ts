
import { supabase } from './supabase';

// Interface for subscription data
interface SubscriptionData {
  userId: string;
  productId?: string;
  bundleId?: string;
  planId: string;
  orderId: string;
  paymentId?: string; // Made optional
  signature?: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency?: string;
  status: 'active' | 'expired' | 'canceled' | 'trial';
  planName?: string;
  autoRenew?: boolean; // Will set default if not provided
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
      // Format data for Supabase
      const subscriptionData = {
        user_id: data.userId,
        product_id: data.productId,
        bundle_id: data.bundleId,
        plan_id: data.planId,
        order_id: data.orderId,
        // Only add payment_id if it exists in the data
        ...(data.paymentId ? { payment_id: data.paymentId } : {}),
        start_date: data.startDate,
        end_date: data.endDate,
        auto_renew: data.autoRenew !== undefined ? data.autoRenew : true, // Ensure auto_renew is always set with a default
        price: data.amount,
        currency: data.currency || 'INR',
        status: data.status,
        created_at: new Date().toISOString(),
        // Additional metadata
        plan_name: data.planName,
        product_name: data.planName, // This should be fetched from product data in a real app
      };
      
      // Try to catch specific schema cache errors
      try {
        // Insert into subscriptions table
        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .insert(subscriptionData)
          .select()
          .single();
        
        if (error) {
          console.error("Error creating subscription:", error);
          // Check if it's a schema cache error or ambiguous column error
          if (error.message && (error.message.includes('schema cache') || error.message.includes('ambiguous'))) {
            console.warn("Schema cache or ambiguous column error detected:", error.message);
            throw new Error(`Schema error: ${error.message}`);
          }
          throw error;
        }
        
        console.log("Subscription created successfully:", subscription);
        return subscription;
      } catch (insertError: any) {
        // Handle schema errors with fallback approach
        if (insertError.message && (insertError.message.includes('schema') || insertError.message.includes('ambiguous'))) {
          console.log("Attempting fallback subscription insert with minimal fields...");
          
          // Use only basic fields with explicit table reference and ensure auto_renew is included
          const minimalSubscriptionData = {
            user_id: data.userId,
            product_id: data.productId || null,
            bundle_id: data.bundleId || null,
            plan_id: data.planId,
            start_date: data.startDate,
            end_date: data.endDate,
            auto_renew: true, // Always set to true - this is required
            price: data.amount,
            status: data.status || 'active',
            created_at: new Date().toISOString()
          };
          
          // Try direct RPC call to avoid ambiguous column issues
          try {
            const { data: minimalSubscription, error: minimalError } = await supabase
              .from('subscriptions')
              .insert(minimalSubscriptionData)
              .select('id, user_id, product_id, bundle_id, plan_id, start_date, end_date, auto_renew, price, status, created_at')
              .single();
              
            if (minimalError) {
              console.error("Fallback subscription insert also failed:", minimalError);
              
              // Last resort attempt with raw SQL insert (can be removed if not needed)
              console.log("Last resort attempt for subscription creation");
              const { data: rawData, error: rawError } = await supabase
                .from('subscriptions')
                .insert(minimalSubscriptionData);
                
              if (rawError) {
                console.error("All subscription creation attempts failed:", rawError);
                throw rawError;
              }
              
              console.log("Basic subscription created without return data");
              return { id: 'unknown', ...minimalSubscriptionData };
            }
            
            console.log("Fallback subscription created successfully:", minimalSubscription);
            return minimalSubscription;
          } catch (finalError) {
            console.error("All fallback attempts failed:", finalError);
            throw finalError;
          }
        } else {
          // If it's not a schema cache error, rethrow
          throw insertError;
        }
      }
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
      // Format data for Supabase
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
      
      try {
        // Insert into purchases table with explicit column selection
        const { data: purchase, error } = await supabase
          .from('purchases')
          .insert(purchaseData)
          .select('id, user_id, product_id, bundle_id, plan_id, order_id, payment_id, date, amount, status, created_at')
          .single();
        
        if (error) {
          console.error("Error recording purchase:", error);
          // Check if it's a schema cache error or ambiguous column error
          if (error.message && (error.message.includes('schema cache') || error.message.includes('ambiguous'))) {
            console.warn("Schema cache or ambiguous column error detected for purchase:", error.message);
            throw new Error(`Schema error: ${error.message}`);
          }
          throw error;
        }
        
        console.log("Purchase recorded successfully:", purchase);
        return purchase;
      } catch (insertError: any) {
        // Handle schema errors
        if (insertError.message && (insertError.message.includes('schema') || insertError.message.includes('ambiguous'))) {
          console.log("Attempting fallback purchase insert with minimal fields...");
          
          // Use only basic fields that are guaranteed to exist in the schema
          const minimalPurchaseData = {
            user_id: data.userId,
            product_id: data.productId || null,
            bundle_id: data.bundleId || null,
            plan_id: data.planId,
            date: data.date,
            amount: data.amount,
            status: data.status,
            created_at: new Date().toISOString()
          };
          
          try {
            const { data: minimalPurchase, error: minimalError } = await supabase
              .from('purchases')
              .insert(minimalPurchaseData)
              .select('id, user_id, product_id, bundle_id, plan_id, date, amount, status, created_at')
              .single();
              
            if (minimalError) {
              console.error("Fallback purchase insert also failed:", minimalError);
              
              // Last resort attempt
              const { data: basicData, error: basicError } = await supabase
                .from('purchases')
                .insert(minimalPurchaseData);
                
              if (basicError) {
                console.error("All purchase creation attempts failed:", basicError);
                throw basicError;
              }
              
              console.log("Basic purchase created without return data");
              return { id: 'unknown', ...minimalPurchaseData };
            }
            
            console.log("Fallback purchase created successfully:", minimalPurchase);
            return minimalPurchase;
          } catch (finalError) {
            console.error("All fallback attempts failed:", finalError);
            throw finalError;
          }
        } else {
          // If it's not a schema error, rethrow
          throw insertError;
        }
      }
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
    paymentId?: string; // Made optional
    signature?: string;
    startDate: string;
    endDate: string;
    amount: number;
    currency?: string;
    planName?: string;
    autoRenew?: boolean;
  }) {
    console.log("Storing successful payment data:", paymentData);
    
    try {
      let subscription, purchase;
      let subscriptionSuccess = false, purchaseSuccess = false;
      
      try {
        // Create subscription record with autoRenew defaulted to true
        // Note that we don't pass paymentId to createSubscription
        subscription = await this.createSubscription({
          userId: paymentData.userId,
          productId: paymentData.productId,
          planId: paymentData.planId,
          orderId: paymentData.orderId,
          // Removed paymentId here
          signature: paymentData.signature,
          startDate: paymentData.startDate,
          endDate: paymentData.endDate,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'active',
          planName: paymentData.planName,
          autoRenew: paymentData.autoRenew !== undefined ? paymentData.autoRenew : true
        });
        subscriptionSuccess = true;
      } catch (subscriptionError) {
        console.error("Error creating subscription, but continuing with purchase:", subscriptionError);
        // Continue with purchase even if subscription fails
      }
      
      // Only try to record the purchase if paymentId is provided
      if (paymentData.paymentId) {
        try {
          // Record purchase
          purchase = await this.recordPurchase({
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
          purchaseSuccess = true;
        } catch (purchaseError) {
          console.error("Error recording purchase:", purchaseError);
        }
      } else {
        console.log("No paymentId provided, skipping purchase record");
      }
      
      if (!subscriptionSuccess && !purchaseSuccess) {
        throw new Error("Failed to store both subscription and purchase data");
      }
      
      console.log("Payment data stored successfully", {
        subscriptionSuccess,
        purchaseSuccess,
        subscription,
        purchase
      });
      
      return { subscription, purchase };
    } catch (error) {
      console.error("Failed to store payment data:", error);
      throw error;
    }
  }
};
