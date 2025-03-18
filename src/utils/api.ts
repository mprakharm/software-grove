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
  apiRegistry: {
    'linkedin': {
      handler: async (product: any) => {
        console.log('Calling LinkedIn API endpoint');
        try {
          const response = await fetch('https://api.example.com/linkedin/plans', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
          });
          
          if (response.ok) {
            return await response.json();
          }
          throw new Error('Failed to fetch LinkedIn plans');
        } catch (error) {
          console.error('Error calling LinkedIn API:', error);
          return null;
        }
      }
    },
    'salesforce': {
      handler: async (product: any) => {
        console.log('Calling Salesforce API endpoint');
        try {
          const response = await fetch('https://api.example.com/salesforce/plans', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
          });
          
          if (response.ok) {
            return await response.json();
          }
          throw new Error('Failed to fetch Salesforce plans');
        } catch (error) {
          console.error('Error calling Salesforce API:', error);
          return null;
        }
      }
    },
    'microsoft': {
      handler: async (product: any) => {
        console.log('Calling Microsoft API endpoint');
        try {
          const response = await fetch('https://api.example.com/microsoft/plans', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
          });
          
          if (response.ok) {
            return await response.json();
          }
          throw new Error('Failed to fetch Microsoft plans');
        } catch (error) {
          console.error('Error calling Microsoft API:', error);
          return null;
        }
      }
    }
  },
  
  findApiHandler: function(product: any): any {
    if (!product) return null;
    
    const productName = product.name?.toLowerCase() || '';
    const vendorName = product.vendor?.toLowerCase() || '';
    
    for (const key of Object.keys(this.apiRegistry)) {
      if (productName.includes(key) || vendorName.includes(key)) {
        console.log(`Found API handler for key: ${key}`);
        return this.apiRegistry[key];
      }
    }
    
    if (product.metadata && typeof product.metadata === 'object') {
      const apiProvider = product.metadata.apiProvider;
      if (apiProvider && this.apiRegistry[apiProvider]) {
        console.log(`Found API handler from metadata: ${apiProvider}`);
        return this.apiRegistry[apiProvider];
      }
    }
    
    console.log('No specific API handler found for this product');
    return null;
  },
  
  registerApiHandler: function(key: string, handler: Function): void {
    this.apiRegistry[key.toLowerCase()] = { handler };
    console.log(`Registered new API handler for: ${key}`);
  },
  
  async getProductPlans(productId: string): Promise<any[]> {
    if (process.env.NODE_ENV === 'development') {
      await delay(500);
    }
    
    console.log(`Fetching plans for product: ${productId}`);
    
    try {
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      console.log('Product info for API selection:', productData);
      
      if (productData) {
        // Try using the registered handler for the exact product name first
        const productName = productData.name ? productData.name.toLowerCase() : '';
        if (productName.includes('linkedin') && this.apiRegistry['linkedin']) {
          console.log('Trying LinkedIn specific handler first');
          const apiResult = await this.apiRegistry['linkedin'].handler(productData);
          if (apiResult && !apiResult.error) {
            console.log('API call successful, using returned plans');
            return apiResult;
          }
        }
        
        // Then try the generic handler finding logic
        const apiHandler = this.findApiHandler(productData);
        if (apiHandler) {
          const apiResult = await apiHandler.handler(productData);
          if (apiResult && !apiResult.error) {
            console.log('API call successful, using returned plans');
            return apiResult;
          }
        }
        
        const vendor = productData.vendor ? productData.vendor.toLowerCase() : '';
        
        if (productName.includes('linkedin')) {
          console.log('Falling back to LinkedIn Premium mock plans');
          return await this.getMockPlans('linkedin-premium');
        } else if (productName.includes('salesforce') || vendor.includes('salesforce')) {
          return await this.getMockPlans('salesforce');
        } else if (productName.includes('microsoft') || productName.includes('office') || vendor.includes('microsoft')) {
          return await this.getMockPlans('microsoft');
        }
      }
      
      console.log('No specific API found for this product, using default mock data');
      return await this.getMockPlans('default');
    } catch (error) {
      console.error('Error determining product API:', error);
      return await this.getMockPlans('default');
    }
  },
  
  async getMockPlans(productType: string): Promise<any[]> {
    console.log(`Getting mock plans for: ${productType}`);
    
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
      'microsoft': [
        {
          id: 'microsoft-basic',
          name: 'Microsoft 365 Basic',
          description: 'Essential Microsoft tools for individuals',
          price: 5.99,
          features: [
            'Web versions of Office apps',
            'Email and calendar',
            '1TB OneDrive storage',
            'Security features'
          ],
          billingOptions: ['monthly', 'annual'],
          discountPercentage: 10
        },
        {
          id: 'microsoft-standard',
          name: 'Microsoft 365 Standard',
          description: 'Complete Microsoft tools for small businesses',
          price: 12.99,
          features: [
            'Desktop versions of Office apps',
            'Email and calendar',
            '1TB OneDrive storage',
            'Security features'
          ],
          popular: true,
          billingOptions: ['monthly', 'annual'],
          discountPercentage: 15
        },
        {
          id: 'microsoft-premium',
          name: 'Microsoft 365 Premium',
          description: 'Advanced security and management for businesses',
          price: 22.99,
          features: [
            'All Standard features',
            'Advanced security',
            'Device management',
            'Cyber threat protection'
          ],
          billingOptions: ['monthly', 'annual'],
          discountPercentage: 20
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
    
    return mockPlans[productType as keyof typeof mockPlans] || mockPlans['default'];
  }
};

// Example of how to register a new API handler dynamically
// VendorAPI.registerApiHandler('zoom', async (product) => {
//   // Custom API integration for Zoom
//   const response = await fetch('https://api.zoom.us/v2/plans');
//   return await response.json();
// });
