
// Product related types
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  price: number;
  currency: string;
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
  color?: string;
  image?: string;
  vendor?: string;
  discount?: string;
  reviewCount?: number;
}

// Bundle related types
export interface BundleProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  discount?: number;
}

export interface Bundle {
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
  currency?: string;
  purchases?: number;
}

// Subscription related types
export interface Subscription {
  id: string;
  userId: string;
  productId?: string;
  bundleId?: string;
  planId: string;
  planName: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  price: number;
  currency: string;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  cancellationDate?: Date;
  cancellationReason?: string;
}

// Purchase related types
export interface Purchase {
  id: string;
  userId: string;
  productId?: string;
  bundleId?: string;
  planId: string;
  planName: string;
  date: Date;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  transactionId: string;
  invoiceUrl?: string;
}

// Extended subscription type with UI display data
export interface ExtendedSubscription extends Subscription {
  name: string;
  image?: string;
  plan: string;
  renewalDate: string;
  monthlyPrice: number;
  users: number;
  totalStorage?: number;
  usedStorage?: number;
  trialEndsIn?: number;
}
