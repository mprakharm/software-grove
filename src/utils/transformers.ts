
import { Database } from './database.types';
import { Product, Bundle, BundleProduct, Subscription, Purchase } from './db';

// Transform Product from Supabase to App format
export function transformProductFromSupabase(
  supabaseProduct: Database['public']['Tables']['products']['Row']
): Product {
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    description: supabaseProduct.description,
    category: supabaseProduct.category,
    logo: supabaseProduct.logo,
    price: supabaseProduct.price,
    featuredBenefit: supabaseProduct.featured_benefit,
    benefits: supabaseProduct.benefits || [],
    integration: supabaseProduct.integration || [],
    popularity: supabaseProduct.popularity,
    rating: supabaseProduct.rating,
    reviews: supabaseProduct.reviews,
    users: supabaseProduct.users,
    inStock: supabaseProduct.in_stock,
    isHot: supabaseProduct.is_hot,
    banner: supabaseProduct.banner
  };
}

// Transform Product from App to Supabase format
export function transformProductToSupabase(
  product: Omit<Product, 'id'>
): Database['public']['Tables']['products']['Insert'] {
  return {
    name: product.name,
    description: product.description,
    category: product.category,
    logo: product.logo,
    price: product.price,
    featured_benefit: product.featuredBenefit,
    benefits: product.benefits || [],
    integration: product.integration || [],
    popularity: product.popularity,
    rating: product.rating,
    reviews: product.reviews,
    users: product.users,
    in_stock: product.inStock,
    is_hot: product.isHot,
    banner: product.banner,
    created_at: new Date().toISOString()
  };
}

// Transform Bundle from Supabase to App format
export function transformBundleFromSupabase(
  supabaseBundle: Database['public']['Tables']['bundles']['Row']
): Bundle {
  // Parse products JSON from Supabase
  const productsData = supabaseBundle.products as BundleProduct[] || [];
  
  return {
    id: supabaseBundle.id,
    name: supabaseBundle.name,
    description: supabaseBundle.description,
    category: supabaseBundle.category,
    targetUser: supabaseBundle.target_user,
    products: productsData,
    minProducts: supabaseBundle.min_products,
    maxProducts: supabaseBundle.max_products,
    requiredProductIds: supabaseBundle.required_product_ids,
    image: supabaseBundle.image,
    savings: supabaseBundle.savings,
    isCustomizable: supabaseBundle.is_customizable,
    isLimitedTime: supabaseBundle.is_limited_time,
    expiryDate: supabaseBundle.expiry_date,
    color: supabaseBundle.color,
    purchases: supabaseBundle.purchases || 0
  };
}

// Transform Bundle from App to Supabase format
export function transformBundleToSupabase(
  bundle: Omit<Bundle, 'id'>
): Database['public']['Tables']['bundles']['Insert'] {
  return {
    name: bundle.name,
    description: bundle.description,
    category: bundle.category,
    target_user: bundle.targetUser,
    products: bundle.products,
    min_products: bundle.minProducts,
    max_products: bundle.maxProducts,
    required_product_ids: bundle.requiredProductIds,
    image: bundle.image,
    savings: bundle.savings,
    is_customizable: bundle.isCustomizable,
    is_limited_time: bundle.isLimitedTime,
    expiry_date: bundle.expiryDate,
    color: bundle.color,
    purchases: bundle.purchases || 0,
    created_at: new Date().toISOString()
  };
}

// Transform Subscription from Supabase to App format
export function transformSubscriptionFromSupabase(
  supabaseSub: Database['public']['Tables']['subscriptions']['Row']
): Subscription {
  return {
    id: supabaseSub.id,
    userId: supabaseSub.user_id,
    productId: supabaseSub.product_id,
    bundleId: supabaseSub.bundle_id,
    planId: supabaseSub.plan_id,
    startDate: new Date(supabaseSub.start_date),
    endDate: new Date(supabaseSub.end_date),
    autoRenew: supabaseSub.auto_renew,
    price: supabaseSub.price
  };
}

// Transform Subscription from App to Supabase format
export function transformSubscriptionToSupabase(
  subscription: Omit<Subscription, 'id'>
): Database['public']['Tables']['subscriptions']['Insert'] {
  return {
    user_id: subscription.userId,
    product_id: subscription.productId,
    bundle_id: subscription.bundleId,
    plan_id: subscription.planId,
    start_date: subscription.startDate.toISOString(),
    end_date: subscription.endDate.toISOString(),
    auto_renew: subscription.autoRenew,
    price: subscription.price,
    created_at: new Date().toISOString()
  };
}

// Transform Purchase from Supabase to App format
export function transformPurchaseFromSupabase(
  supabasePurchase: Database['public']['Tables']['purchases']['Row']
): Purchase {
  return {
    id: supabasePurchase.id,
    userId: supabasePurchase.user_id,
    productId: supabasePurchase.product_id,
    bundleId: supabasePurchase.bundle_id,
    planId: supabasePurchase.plan_id,
    date: new Date(supabasePurchase.date),
    amount: supabasePurchase.amount,
    status: supabasePurchase.status as 'completed' | 'pending' | 'failed'
  };
}

// Transform Purchase from App to Supabase format
export function transformPurchaseToSupabase(
  purchase: Omit<Purchase, 'id'>
): Database['public']['Tables']['purchases']['Insert'] {
  return {
    user_id: purchase.userId,
    product_id: purchase.productId,
    bundle_id: purchase.bundleId,
    plan_id: purchase.planId,
    date: purchase.date.toISOString(),
    amount: purchase.amount,
    status: purchase.status,
    created_at: new Date().toISOString()
  };
}
