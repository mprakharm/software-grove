import { Product, Bundle, Subscription, Purchase } from './db';
import { supabase } from './supabase';
import {
  transformProductFromSupabase,
  transformProductToSupabase,
  transformBundleFromSupabase,
  transformBundleToSupabase,
  transformSubscriptionFromSupabase,
  transformSubscriptionToSupabase,
  transformPurchaseFromSupabase,
  transformPurchaseToSupabase
} from './transformers';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ProductAPI = {
  async getProducts(filters?: { category?: string, searchQuery?: string }): Promise<Product[]> {
    if (process.env.NODE_ENV === 'development') {
      await delay(300);
    }
    
    let query = supabase.from('products').select();
    
    if (filters) {
      if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }
      
      if (filters.searchQuery) {
        const searchTerm = `%${filters.searchQuery.toLowerCase()}%`;
        query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm},vendor.ilike.${searchTerm}`);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    return (data || []).map(transformProductFromSupabase);
  },
  
  async getProductById(id: string): Promise<Product | null> {
    if (process.env.NODE_ENV === 'development') {
      await delay(200);
    }
    
    const { data, error } = await supabase
      .from('products')
      .select()
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching product:', error);
      throw error;
    }
    
    return data ? transformProductFromSupabase(data) : null;
  },
  
  async getProductByNameOrId(nameOrId: string): Promise<Product | null> {
    if (process.env.NODE_ENV === 'development') {
      await delay(200);
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select()
        .eq('id', nameOrId)
        .single();
      
      if (data) {
        return transformProductFromSupabase(data);
      }
      
      const formattedName = nameOrId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const { data: nameData, error: nameError } = await supabase
        .from('products')
        .select()
        .ilike('name', formattedName)
        .single();
      
      if (nameData) {
        return transformProductFromSupabase(nameData);
      }
      
      const { data: flexData, error: flexError } = await supabase
        .from('products')
        .select()
        .ilike('name', `%${nameOrId.replace(/-/g, '%')}%`)
        .single();
      
      if (flexData) {
        return transformProductFromSupabase(flexData);
      }
      
      return null;
    } catch (error) {
      console.error('Error in getProductByNameOrId:', error);
      return null;
    }
  },
  
  async searchProducts(searchQuery: string): Promise<Product[]> {
    if (process.env.NODE_ENV === 'development') {
      await delay(300);
    }
    
    if (!searchQuery || searchQuery.trim() === '') {
      return [];
    }
    
    const searchTerm = `%${searchQuery.toLowerCase()}%`;
    
    const { data, error } = await supabase
      .from('products')
      .select()
      .or(`name.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm},vendor.ilike.${searchTerm}`);
    
    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }
    
    return (data || []).map(transformProductFromSupabase);
  },
  
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    if (process.env.NODE_ENV === 'development') {
      await delay(500);
    }
    
    const supabaseProduct = transformProductToSupabase(product);
    const { data, error } = await supabase
      .from('products')
      .insert(supabaseProduct)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
    
    return transformProductFromSupabase(data);
  },
  
  async updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
    if (process.env.NODE_ENV === 'development') {
      await delay(500);
    }
    
    const existingProduct = await this.getProductById(id);
    if (!existingProduct) {
      return null;
    }
    
    const updatedProduct = { ...existingProduct, ...data };
    const supabaseProduct = transformProductToSupabase(updatedProduct);
    
    const { data: result, error } = await supabase
      .from('products')
      .update(supabaseProduct)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    return transformProductFromSupabase(result);
  },
  
  async deleteProduct(id: string): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
      await delay(500);
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    
    return true;
  },
  
  async bulkUploadProducts(products: Omit<Product, 'id'>[]): Promise<Product[]> {
    if (process.env.NODE_ENV === 'development') {
      await delay(1000);
    }
    
    const supabaseProducts = products.map(transformProductToSupabase);
    const { data, error } = await supabase
      .from('products')
      .insert(supabaseProducts)
      .select();
    
    if (error) {
      console.error('Error bulk uploading products:', error);
      throw error;
    }
    
    return (data || []).map(transformProductFromSupabase);
  }
};

export const BundleAPI = {
  async getBundles(filters?: { category?: string, searchQuery?: string }): Promise<Bundle[]> {
    if (process.env.NODE_ENV === 'development') {
      await delay(300);
    }
    
    let query = supabase.from('bundles').select();
    
    if (filters) {
      if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }
      
      if (filters.searchQuery) {
        const searchTerm = `%${filters.searchQuery.toLowerCase()}%`;
        query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching bundles:', error);
      throw error;
    }
    
    return (data || []).map(transformBundleFromSupabase);
  },
  
  async getBundleById(id: string): Promise<Bundle | null> {
    if (process.env.NODE_ENV === 'development') {
      await delay(200);
    }
    
    const { data, error } = await supabase
      .from('bundles')
      .select()
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching bundle:', error);
      throw error;
    }
    
    return data ? transformBundleFromSupabase(data) : null;
  },
  
  async addBundle(bundle: Omit<Bundle, 'id'>): Promise<Bundle> {
    if (process.env.NODE_ENV === 'development') {
      await delay(500);
    }
    
    const supabaseBundle = transformBundleToSupabase(bundle);
    const { data, error } = await supabase
      .from('bundles')
      .insert(supabaseBundle)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding bundle:', error);
      throw error;
    }
    
    return transformBundleFromSupabase(data);
  },
  
  async updateBundle(id: string, data: Partial<Bundle>): Promise<Bundle | null> {
    if (process.env.NODE_ENV === 'development') {
      await delay(500);
    }
    
    const existingBundle = await this.getBundleById(id);
    if (!existingBundle) {
      return null;
    }
    
    const updatedBundle = { ...existingBundle, ...data };
    const supabaseBundle = transformBundleToSupabase(updatedBundle);
    
    const { data: result, error } = await supabase
      .from('bundles')
      .update(supabaseBundle)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating bundle:', error);
      throw error;
    }
    
    return transformBundleFromSupabase(result);
  },
  
  async deleteBundle(id: string): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
      await delay(500);
    }
    
    const { error } = await supabase
      .from('bundles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting bundle:', error);
      throw error;
    }
    
    return true;
  },
  
  async bulkUploadBundles(bundles: Omit<Bundle, 'id'>[]): Promise<Bundle[]> {
    if (process.env.NODE_ENV === 'development') {
      await delay(1000);
    }
    
    const supabaseBundles = bundles.map(transformBundleToSupabase);
    const { data, error } = await supabase
      .from('bundles')
      .insert(supabaseBundles)
      .select();
    
    if (error) {
      console.error('Error bulk uploading bundles:', error);
      throw error;
    }
    
    return (data || []).map(transformBundleFromSupabase);
  }
};

export const SubscriptionAPI = {
  async createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    if (process.env.NODE_ENV === 'development') {
      await delay(700);
    }
    
    const supabaseSubscription = transformSubscriptionToSupabase(subscription);
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(supabaseSubscription)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
    
    return transformSubscriptionFromSupabase(data);
  },
  
  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    if (process.env.NODE_ENV === 'development') {
      await delay(300);
    }
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select()
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user subscriptions:', error);
      throw error;
    }
    
    return (data || []).map(transformSubscriptionFromSupabase);
  }
};

export const PurchaseAPI = {
  async createPurchase(purchase: Omit<Purchase, 'id'>): Promise<Purchase> {
    if (process.env.NODE_ENV === 'development') {
      await delay(700);
    }
    
    const supabasePurchase = transformPurchaseToSupabase(purchase);
    const { data, error } = await supabase
      .from('purchases')
      .insert(supabasePurchase)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating purchase:', error);
      throw error;
    }
    
    if (purchase.bundleId) {
      try {
        await supabase.rpc('increment_bundle_purchases', { 
          bundle_id: purchase.bundleId 
        });
      } catch (updateError) {
        console.error('Error updating bundle purchase count:', updateError);
      }
    }
    
    return transformPurchaseFromSupabase(data);
  },
  
  async getUserPurchases(userId: string): Promise<Purchase[]> {
    if (process.env.NODE_ENV === 'development') {
      await delay(300);
    }
    
    const { data, error } = await supabase
      .from('purchases')
      .select()
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user purchases:', error);
      throw error;
    }
    
    return (data || []).map(transformPurchaseFromSupabase);
  }
};

export const VendorAPI = {
  async getProductPlans(productId: string): Promise<any[]> {
    if (process.env.NODE_ENV === 'development') {
      await delay(500);
    }
    
    console.log(`Fetching plans for product: ${productId}`);
    
    try {
      const mockPlans = {
        'linkedin-premium': [
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
        ],
        'salesforce': [
          {
            id: 'salesforce-essentials',
            name: 'Essentials',
            description: 'Basic CRM for small business',
            price: 25,
            features: [
              'Account and contact management',
              'Opportunity tracking',
              'Lead management',
              'Email integration'
            ],
            billingOptions: ['monthly', 'annual'],
            discountPercentage: 15
          },
          {
            id: 'salesforce-professional',
            name: 'Professional',
            description: 'Complete CRM for any size business',
            price: 75,
            features: [
              'All Essentials features',
              'Forecasting',
              'Collaborative forecasting',
              'Lead scoring'
            ],
            popular: true,
            billingOptions: ['monthly', 'annual'],
            discountPercentage: 20
          },
          {
            id: 'salesforce-enterprise',
            name: 'Enterprise',
            description: 'Deeply customizable CRM',
            price: 150,
            features: [
              'All Professional features',
              'Workflow automation',
              'Approval automation',
              'Custom app development'
            ],
            billingOptions: ['monthly', 'annual'],
            discountPercentage: 25
          }
        ],
        'default': [
          {
            id: 'basic',
            name: 'Basic',
            description: 'Essential features for individuals',
            price: 9.99,
            features: [
              'Core functionality',
              'Email support',
              'Basic reporting',
              '1 user'
            ],
            billingOptions: ['monthly', 'annual'],
            discountPercentage: 10
          },
          {
            id: 'pro',
            name: 'Professional',
            description: 'Advanced features for teams',
            price: 19.99,
            features: [
              'All Basic features',
              'Advanced reporting',
              'Priority support',
              'Up to 5 users'
            ],
            popular: true,
            billingOptions: ['monthly', 'annual'],
            discountPercentage: 15
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'Complete solution for organizations',
            price: 49.99,
            features: [
              'All Professional features',
              'Custom integrations',
              'Dedicated support',
              'Unlimited users'
            ],
            billingOptions: ['monthly', 'annual'],
            discountPercentage: 20
          }
        ]
      };
      
      const plans = mockPlans[productId as keyof typeof mockPlans] || mockPlans['default'];
      return plans;
    } catch (error) {
      console.error('Error fetching product plans:', error);
      throw error;
    }
  }
};
