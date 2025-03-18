import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Types for our database entities
// Re-export from supabase types but maintain original structure for compatibility
export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  price: number;
  featuredBenefit?: string;
  benefits?: string[];
  integration?: string[];
  popularity?: number;
  rating?: number;
  reviews?: number;
  users?: number;
  inStock: boolean;
  isHot?: boolean;
  banner?: string;
};

export type BundleProduct = {
  productId: string;
  individualPrice: number;
  bundlePrice: number;
};

export type Bundle = {
  id: string;
  name: string;
  description: string;
  category: string;
  targetUser: string;
  products: BundleProduct[];
  minProducts?: number;
  maxProducts?: number;
  requiredProductIds?: string[];
  image: string;
  savings: number;
  isCustomizable: boolean;
  isLimitedTime?: boolean;
  expiryDate?: string;
  color: string;
  purchases?: number; // This property is needed for tracking bundle purchases
};

export type User = {
  id: string;
  email: string;
  name: string;
  subscriptions: Subscription[];
};

export type Subscription = {
  id: string;
  userId: string;
  productId?: string;
  bundleId?: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  price: number;
};

export type Purchase = {
  id: string;
  userId: string;
  productId?: string;
  bundleId?: string;
  planId: string;
  date: Date;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
};

// Transform functions to convert between our app's format and Supabase format
const transformProductFromSupabase = (item: any): Product => ({
  id: item.id,
  name: item.name,
  description: item.description,
  category: item.category,
  logo: item.logo,
  price: item.price,
  featuredBenefit: item.featured_benefit,
  benefits: item.benefits,
  integration: item.integration,
  popularity: item.popularity,
  rating: item.rating,
  reviews: item.reviews,
  users: item.users,
  inStock: item.in_stock,
  isHot: item.is_hot,
  banner: item.banner
});

const transformProductToSupabase = (product: Omit<Product, 'id'>): any => ({
  name: product.name,
  description: product.description,
  category: product.category,
  logo: product.logo,
  price: product.price,
  featured_benefit: product.featuredBenefit,
  benefits: product.benefits,
  integration: product.integration,
  popularity: product.popularity,
  rating: product.rating,
  reviews: product.reviews,
  users: product.users,
  in_stock: product.inStock,
  is_hot: product.isHot,
  banner: product.banner
});

const transformBundleFromSupabase = async (bundle: any): Promise<Bundle> => {
  // Fetch bundle products
  const { data: bundleProducts } = await supabase
    .from('bundle_products')
    .select('*')
    .eq('bundle_id', bundle.id);
  
  return {
    id: bundle.id,
    name: bundle.name,
    description: bundle.description,
    category: bundle.category,
    targetUser: bundle.target_user,
    products: bundleProducts?.map(bp => ({
      productId: bp.product_id,
      individualPrice: bp.individual_price,
      bundlePrice: bp.bundle_price
    })) || [],
    minProducts: bundle.min_products,
    maxProducts: bundle.max_products,
    requiredProductIds: bundle.required_product_ids,
    image: bundle.image,
    savings: bundle.savings,
    isCustomizable: bundle.is_customizable,
    isLimitedTime: bundle.is_limited_time,
    expiryDate: bundle.expiry_date,
    color: bundle.color,
    purchases: bundle.purchases
  };
};

const transformBundleToSupabase = (bundle: Omit<Bundle, 'id'>): any => ({
  name: bundle.name,
  description: bundle.description,
  category: bundle.category,
  target_user: bundle.targetUser,
  min_products: bundle.minProducts,
  max_products: bundle.maxProducts,
  required_product_ids: bundle.requiredProductIds,
  image: bundle.image,
  savings: bundle.savings,
  is_customizable: bundle.isCustomizable,
  is_limited_time: bundle.isLimitedTime,
  expiry_date: bundle.expiryDate,
  color: bundle.color,
  purchases: bundle.purchases || 0
});

// Database class to handle interactions with Supabase
class SupabaseDB {
  // Initialize with data
  constructor() {
    this.initializeSupabaseData();
  }

  // Initialize data from in-memory to Supabase if needed
  async initializeSupabaseData() {
    try {
      // Check if products table is empty
      const { data: existingProducts } = await supabase
        .from('products')
        .select('id')
        .limit(1);
      
      if (!existingProducts || existingProducts.length === 0) {
        // Import initial data
        const indexModule = await import('@/pages/Index');
        
        if (indexModule.FEATURED_SOFTWARE && indexModule.FEATURED_SOFTWARE.length > 0) {
          // Map the data from FEATURED_SOFTWARE to Product type and insert into Supabase
          const products = indexModule.FEATURED_SOFTWARE.map((item: any) => ({
            name: item.name,
            description: item.description || '',
            category: item.category || 'Other',
            logo: item.image || '',  // Map image to logo field
            price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : (item.price || 0),
            rating: item.rating,
            reviews: item.reviewCount,
            in_stock: true, // Default value
            is_hot: item.isHot || false,
            popularity: item.popularity || 0
          }));
          
          // Insert products into Supabase
          await supabase.from('products').insert(products);
        }
      }
      
      // Check if bundles table is empty
      const { data: existingBundles } = await supabase
        .from('bundles')
        .select('id')
        .limit(1);
      
      if (!existingBundles || existingBundles.length === 0) {
        // Import initial bundle data
        const bundlesModule = await import('@/data/bundlesData');
        
        if (bundlesModule.BUNDLES && bundlesModule.BUNDLES.length > 0) {
          for (const bundle of bundlesModule.BUNDLES) {
            const newBundle = {
              name: bundle.name,
              description: bundle.description,
              category: bundle.category,
              target_user: bundle.targetUser,
              image: bundle.image,
              savings: bundle.savings,
              is_customizable: bundle.isCustomizable,
              is_limited_time: bundle.isLimitedTime || false,
              expiry_date: bundle.expiryDate,
              color: bundle.color,
              purchases: bundle.purchases || 0,
              min_products: bundle.minProducts,
              max_products: bundle.maxProducts,
              required_product_ids: bundle.requiredProductIds
            };
            
            // Insert bundle into Supabase
            const { data: insertedBundle } = await supabase
              .from('bundles')
              .insert(newBundle)
              .select();
            
            if (insertedBundle && insertedBundle[0] && bundle.products) {
              // Insert bundle products
              const bundleProducts = bundle.products.map(product => ({
                bundle_id: insertedBundle[0].id,
                product_id: product.productId,
                individual_price: product.individualPrice,
                bundle_price: product.bundlePrice
              }));
              
              await supabase.from('bundle_products').insert(bundleProducts);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error initializing Supabase data:', error);
    }
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data.map(transformProductFromSupabase);
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching product:', error);
      return null;
    }
    
    return transformProductFromSupabase(data);
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(transformProductToSupabase(product))
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error adding product:', error);
      throw new Error(error?.message || 'Failed to add product');
    }
    
    return transformProductFromSupabase(data);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
    const updateData = Object.entries(data).reduce((acc: any, [key, value]) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[snakeKey] = value;
      return acc;
    }, {});
    
    const { data: updatedData, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !updatedData) {
      console.error('Error updating product:', error);
      return null;
    }
    
    return transformProductFromSupabase(updatedData);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    
    return true;
  }

  // Bundle methods
  async getAllBundles(): Promise<Bundle[]> {
    const { data, error } = await supabase
      .from('bundles')
      .select('*');
    
    if (error) {
      console.error('Error fetching bundles:', error);
      return [];
    }
    
    const bundles = [];
    for (const bundle of data) {
      bundles.push(await transformBundleFromSupabase(bundle));
    }
    
    return bundles;
  }

  async getBundleById(id: string): Promise<Bundle | null> {
    const { data, error } = await supabase
      .from('bundles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching bundle:', error);
      return null;
    }
    
    return transformBundleFromSupabase(data);
  }

  async addBundle(bundle: Omit<Bundle, 'id'>): Promise<Bundle> {
    const bundleData = transformBundleToSupabase(bundle);
    
    // Insert bundle
    const { data, error } = await supabase
      .from('bundles')
      .insert(bundleData)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error adding bundle:', error);
      throw new Error(error?.message || 'Failed to add bundle');
    }
    
    // Insert bundle products
    if (bundle.products && bundle.products.length > 0) {
      const bundleProducts = bundle.products.map(product => ({
        bundle_id: data.id,
        product_id: product.productId,
        individual_price: product.individualPrice,
        bundle_price: product.bundlePrice
      }));
      
      await supabase.from('bundle_products').insert(bundleProducts);
    }
    
    return transformBundleFromSupabase(data);
  }

  async updateBundle(id: string, data: Partial<Bundle>): Promise<Bundle | null> {
    let updateData: any = {};
    
    // Format data for Supabase update
    Object.entries(data).forEach(([key, value]) => {
      let snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      // Special handling for products which needs to be updated separately
      if (key !== 'products') {
        updateData[snakeKey] = value;
      }
    });
    
    // Update bundle
    const { data: updatedData, error } = await supabase
      .from('bundles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !updatedData) {
      console.error('Error updating bundle:', error);
      return null;
    }
    
    // Update bundle products if provided
    if (data.products) {
      // Delete existing bundle products
      await supabase
        .from('bundle_products')
        .delete()
        .eq('bundle_id', id);
      
      // Insert new bundle products
      const bundleProducts = data.products.map(product => ({
        bundle_id: id,
        product_id: product.productId,
        individual_price: product.individualPrice,
        bundle_price: product.bundlePrice
      }));
      
      await supabase.from('bundle_products').insert(bundleProducts);
    }
    
    return transformBundleFromSupabase(updatedData);
  }

  async deleteBundle(id: string): Promise<boolean> {
    // Delete bundle products first
    await supabase
      .from('bundle_products')
      .delete()
      .eq('bundle_id', id);
    
    // Delete bundle
    const { error } = await supabase
      .from('bundles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting bundle:', error);
      return false;
    }
    
    return true;
  }

  // Subscription methods
  async createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: subscription.userId,
        product_id: subscription.productId,
        bundle_id: subscription.bundleId,
        plan_id: subscription.planId,
        start_date: subscription.startDate.toISOString(),
        end_date: subscription.endDate.toISOString(),
        auto_renew: subscription.autoRenew,
        price: subscription.price
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating subscription:', error);
      throw new Error(error?.message || 'Failed to create subscription');
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      productId: data.product_id,
      bundleId: data.bundle_id,
      planId: data.plan_id,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      autoRenew: data.auto_renew,
      price: data.price
    };
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user subscriptions:', error);
      return [];
    }
    
    return data.map(sub => ({
      id: sub.id,
      userId: sub.user_id,
      productId: sub.product_id,
      bundleId: sub.bundle_id,
      planId: sub.plan_id,
      startDate: new Date(sub.start_date),
      endDate: new Date(sub.end_date),
      autoRenew: sub.auto_renew,
      price: sub.price
    }));
  }

  // Purchase methods
  async createPurchase(purchase: Omit<Purchase, 'id'>): Promise<Purchase> {
    const { data, error } = await supabase
      .from('purchases')
      .insert({
        user_id: purchase.userId,
        product_id: purchase.productId,
        bundle_id: purchase.bundleId,
        plan_id: purchase.planId,
        date: purchase.date.toISOString(),
        amount: purchase.amount,
        status: purchase.status
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating purchase:', error);
      throw new Error(error?.message || 'Failed to create purchase');
    }
    
    // Update purchase count on the bundle if applicable
    if (purchase.bundleId) {
      await supabase
        .from('bundles')
        .update({ purchases: supabase.rpc('increment', { x: 1 }) })
        .eq('id', purchase.bundleId);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      productId: data.product_id,
      bundleId: data.bundle_id,
      planId: data.plan_id,
      date: new Date(data.date),
      amount: data.amount,
      status: data.status as 'completed' | 'pending' | 'failed'
    };
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user purchases:', error);
      return [];
    }
    
    return data.map(purchase => ({
      id: purchase.id,
      userId: purchase.user_id,
      productId: purchase.product_id,
      bundleId: purchase.bundle_id,
      planId: purchase.plan_id,
      date: new Date(purchase.date),
      amount: purchase.amount,
      status: purchase.status as 'completed' | 'pending' | 'failed'
    }));
  }
}

// Export the Supabase database class
export const db = new SupabaseDB();
