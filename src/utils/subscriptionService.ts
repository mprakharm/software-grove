
import { supabase } from './supabase';
import { Subscription, ExtendedSubscription, Purchase } from './db';
import { transformSubscriptionFromSupabase, transformPurchaseFromSupabase } from './transformers';
import { ProductAPI } from './api';

export const SubscriptionService = {
  async createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: subscription.userId,
          product_id: subscription.productId,
          bundle_id: subscription.bundleId,
          plan_id: subscription.planId,
          plan_name: subscription.planName,
          start_date: subscription.startDate.toISOString(),
          end_date: subscription.endDate.toISOString(),
          auto_renew: subscription.autoRenew,
          price: subscription.price,
          currency: subscription.currency,
          status: subscription.status,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating subscription:', error);
        return null;
      }

      return transformSubscriptionFromSupabase(data);
    } catch (error) {
      console.error('Error in createSubscription:', error);
      return null;
    }
  },

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    try {
      console.log('Fetching subscriptions for user:', userId);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user subscriptions:', error);
        return [];
      }

      console.log('Retrieved subscriptions:', data?.length || 0);
      return (data || []).map(transformSubscriptionFromSupabase);
    } catch (error) {
      console.error('Error in getUserSubscriptions:', error);
      return [];
    }
  },

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    try {
      console.log('Fetching purchases for user:', userId);
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching user purchases:', error);
        return [];
      }

      console.log('Retrieved purchases:', data?.length || 0);
      return (data || []).map(transformPurchaseFromSupabase);
    } catch (error) {
      console.error('Error in getUserPurchases:', error);
      return [];
    }
  },

  async cancelSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
    try {
      const today = new Date();
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancellation_date: today.toISOString(),
          cancellation_reason: reason || 'User cancelled',
          auto_renew: false
        })
        .eq('id', subscriptionId);

      if (error) {
        console.error('Error cancelling subscription:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      return false;
    }
  },

  async getExtendedUserSubscriptions(userId: string): Promise<ExtendedSubscription[]> {
    try {
      console.log('Fetching extended subscriptions for user:', userId);
      const subscriptions = await this.getUserSubscriptions(userId);
      
      if (subscriptions.length === 0) {
        console.log('No subscriptions found for user:', userId);
      }
      
      const extendedSubscriptions: ExtendedSubscription[] = [];
      
      for (const subscription of subscriptions) {
        let productName = subscription.planName;
        let productImage = '';
        
        // If we have a product ID, fetch the product details
        if (subscription.productId) {
          try {
            const product = await ProductAPI.getProductById(subscription.productId);
            if (product) {
              productName = product.name;
              productImage = product.logo || product.image || '';
            }
          } catch (error) {
            console.error('Error fetching product details:', error);
          }
        }
        
        // Calculate days remaining in trial/subscription
        const now = new Date();
        const endDate = subscription.endDate;
        const daysRemaining = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Check if subscription is still active based on end date
        let status = subscription.status;
        if (status === 'active' && now > endDate) {
          status = 'expired';
          // Update the subscription status in the database
          await supabase
            .from('subscriptions')
            .update({ status: 'expired' })
            .eq('id', subscription.id);
        }
        
        extendedSubscriptions.push({
          ...subscription,
          name: productName,
          image: productImage,
          plan: subscription.planName,
          renewalDate: subscription.endDate.toISOString(),
          monthlyPrice: subscription.price,
          users: 1, // Default to 1 user
          totalStorage: 50, // Sample value for UI
          usedStorage: 12, // Sample value for UI
          trialEndsIn: daysRemaining,
        });
      }
      
      console.log('Extended subscriptions:', extendedSubscriptions.length);
      return extendedSubscriptions;
    } catch (error) {
      console.error('Error in getExtendedUserSubscriptions:', error);
      return [];
    }
  },
  
  async updateExpiredSubscriptions(): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      // Find all subscriptions that have ended but are still marked as active
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('status', 'active')
        .lt('end_date', now)
        .select();
      
      if (error) {
        console.error('Error updating expired subscriptions:', error);
      } else {
        console.log('Updated expired subscriptions:', data?.length || 0);
      }
    } catch (error) {
      console.error('Error in updateExpiredSubscriptions:', error);
    }
  },
  
  // Insert a test subscription for debugging purposes
  async insertTestSubscription(userId: string): Promise<boolean> {
    try {
      // Generate dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      const testData = {
        user_id: userId,
        product_id: 'product123',
        plan_id: 'basic',
        plan_name: 'Basic Plan',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        auto_renew: true,
        price: 9.99,
        currency: 'USD',
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('subscriptions')
        .insert(testData);
        
      if (error) {
        console.error('Error inserting test subscription:', error);
        return false;
      }
      
      // Also insert a test purchase record
      const purchaseData = {
        user_id: userId,
        product_id: 'product123',
        plan_id: 'basic',
        plan_name: 'Basic Plan',
        date: new Date().toISOString(),
        amount: 9.99,
        currency: 'USD',
        status: 'completed',
        payment_method: 'Test',
        transaction_id: `test-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      
      const purchaseResult = await supabase
        .from('purchases')
        .insert(purchaseData);
        
      if (purchaseResult.error) {
        console.error('Error inserting test purchase:', purchaseResult.error);
      }
      
      return true;
    } catch (error) {
      console.error('Error in insertTestSubscription:', error);
      return false;
    }
  }
};
