
// Types for database entities
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
