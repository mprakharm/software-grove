
// Simple in-memory database for demo purposes
// In a real application, you would use a proper database like Supabase or Firebase

// Types for our database entities
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
  purchases?: number;
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

// In-memory database
class InMemoryDB {
  private products: Record<string, Product> = {};
  private bundles: Record<string, Bundle> = {};
  private users: Record<string, User> = {};
  private subscriptions: Record<string, Subscription> = {};
  private purchases: Record<string, Purchase> = {};

  // Initialize with data from our data files
  constructor() {
    // Import initial data
    import('@/data/bundlesData').then(bundlesModule => {
      if (bundlesModule.BUNDLES) {
        bundlesModule.BUNDLES.forEach((bundle: Bundle) => {
          this.bundles[bundle.id] = bundle;
        });
      }
    });

    import('@/pages/Index').then(indexModule => {
      if (indexModule.FEATURED_SOFTWARE) {
        indexModule.FEATURED_SOFTWARE.forEach((product: Product) => {
          this.products[product.id] = product;
        });
      }
    });
  }

  // Product methods
  getAllProducts(): Product[] {
    return Object.values(this.products);
  }

  getProductById(id: string): Product | null {
    return this.products[id] || null;
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const id = this.generateId();
    const newProduct = { ...product, id };
    this.products[id] = newProduct;
    return newProduct;
  }

  updateProduct(id: string, data: Partial<Product>): Product | null {
    if (!this.products[id]) return null;
    this.products[id] = { ...this.products[id], ...data };
    return this.products[id];
  }

  deleteProduct(id: string): boolean {
    if (!this.products[id]) return false;
    delete this.products[id];
    return true;
  }

  // Bundle methods
  getAllBundles(): Bundle[] {
    return Object.values(this.bundles);
  }

  getBundleById(id: string): Bundle | null {
    return this.bundles[id] || null;
  }

  addBundle(bundle: Omit<Bundle, 'id'>): Bundle {
    const id = this.generateId();
    const newBundle = { ...bundle, id };
    this.bundles[id] = newBundle;
    return newBundle;
  }

  updateBundle(id: string, data: Partial<Bundle>): Bundle | null {
    if (!this.bundles[id]) return null;
    this.bundles[id] = { ...this.bundles[id], ...data };
    return this.bundles[id];
  }

  deleteBundle(id: string): boolean {
    if (!this.bundles[id]) return false;
    delete this.bundles[id];
    return true;
  }

  // Subscription methods
  createSubscription(subscription: Omit<Subscription, 'id'>): Subscription {
    const id = this.generateId();
    const newSubscription = { ...subscription, id };
    this.subscriptions[id] = newSubscription;
    return newSubscription;
  }

  getUserSubscriptions(userId: string): Subscription[] {
    return Object.values(this.subscriptions).filter(sub => sub.userId === userId);
  }

  // Purchase methods
  createPurchase(purchase: Omit<Purchase, 'id'>): Purchase {
    const id = this.generateId();
    const newPurchase = { ...purchase, id };
    this.purchases[id] = newPurchase;
    
    // Update purchase count on the bundle if applicable
    if (purchase.bundleId && this.bundles[purchase.bundleId]) {
      const bundle = this.bundles[purchase.bundleId];
      this.bundles[purchase.bundleId] = {
        ...bundle,
        purchases: (bundle.purchases || 0) + 1
      };
    }
    
    return newPurchase;
  }

  getUserPurchases(userId: string): Purchase[] {
    return Object.values(this.purchases).filter(purchase => purchase.userId === userId);
  }

  // Helper methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// Export a singleton instance
export const db = new InMemoryDB();
