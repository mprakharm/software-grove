
import { supabase } from './supabase';
import type { Product, Bundle, Subscription, Purchase, BundleProduct } from './types';

// Transform functions to convert between app's format and Supabase format
export const transformProductFromSupabase = (item: any): Product => ({
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

export const transformProductToSupabase = (product: Omit<Product, 'id'>): any => ({
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

export const transformBundleFromSupabase = async (bundle: any): Promise<Bundle> => {
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

export const transformBundleToSupabase = (bundle: Omit<Bundle, 'id'>): any => ({
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

export const transformSubscriptionFromSupabase = (sub: any): Subscription => ({
  id: sub.id,
  userId: sub.user_id,
  productId: sub.product_id,
  bundleId: sub.bundle_id,
  planId: sub.plan_id,
  startDate: new Date(sub.start_date),
  endDate: new Date(sub.end_date),
  autoRenew: sub.auto_renew,
  price: sub.price
});

export const transformSubscriptionToSupabase = (subscription: Omit<Subscription, 'id'>): any => ({
  user_id: subscription.userId,
  product_id: subscription.productId,
  bundle_id: subscription.bundleId,
  plan_id: subscription.planId,
  start_date: subscription.startDate.toISOString(),
  end_date: subscription.endDate.toISOString(),
  auto_renew: subscription.autoRenew,
  price: subscription.price
});

export const transformPurchaseFromSupabase = (purchase: any): Purchase => ({
  id: purchase.id,
  userId: purchase.user_id,
  productId: purchase.product_id,
  bundleId: purchase.bundle_id,
  planId: purchase.plan_id,
  date: new Date(purchase.date),
  amount: purchase.amount,
  status: purchase.status as 'completed' | 'pending' | 'failed'
});

export const transformPurchaseToSupabase = (purchase: Omit<Purchase, 'id'>): any => ({
  user_id: purchase.userId,
  product_id: purchase.productId,
  bundle_id: purchase.bundleId,
  plan_id: purchase.planId,
  date: purchase.date.toISOString(),
  amount: purchase.amount,
  status: purchase.status
});
