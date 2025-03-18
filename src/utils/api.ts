
import { db, Product, Bundle, Subscription, Purchase } from './db';

// Simulate API response delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ProductAPI = {
  // Get all products with optional filtering
  async getProducts(filters?: { category?: string, searchQuery?: string }): Promise<Product[]> {
    await delay(300); // Simulate network delay
    let products = db.getAllProducts();
    
    if (filters) {
      if (filters.category && filters.category !== 'All') {
        products = products.filter(product => product.category === filters.category);
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
        );
      }
    }
    
    return products;
  },
  
  // Get a single product by ID
  async getProductById(id: string): Promise<Product | null> {
    await delay(200);
    return db.getProductById(id);
  },
  
  // Add a new product
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await delay(500);
    return db.addProduct(product);
  },
  
  // Update an existing product
  async updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
    await delay(500);
    return db.updateProduct(id, data);
  },
  
  // Delete a product
  async deleteProduct(id: string): Promise<boolean> {
    await delay(500);
    return db.deleteProduct(id);
  }
};

export const BundleAPI = {
  // Get all bundles with optional filtering
  async getBundles(filters?: { category?: string, searchQuery?: string }): Promise<Bundle[]> {
    await delay(300);
    let bundles = db.getAllBundles();
    
    if (filters) {
      if (filters.category && filters.category !== 'All') {
        bundles = bundles.filter(bundle => bundle.category === filters.category);
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        bundles = bundles.filter(bundle => 
          bundle.name.toLowerCase().includes(query) || 
          bundle.description.toLowerCase().includes(query)
        );
      }
    }
    
    return bundles;
  },
  
  // Get a single bundle by ID
  async getBundleById(id: string): Promise<Bundle | null> {
    await delay(200);
    return db.getBundleById(id);
  },
  
  // Add a new bundle
  async addBundle(bundle: Omit<Bundle, 'id'>): Promise<Bundle> {
    await delay(500);
    return db.addBundle(bundle);
  },
  
  // Update an existing bundle
  async updateBundle(id: string, data: Partial<Bundle>): Promise<Bundle | null> {
    await delay(500);
    return db.updateBundle(id, data);
  },
  
  // Delete a bundle
  async deleteBundle(id: string): Promise<boolean> {
    await delay(500);
    return db.deleteBundle(id);
  }
};

export const SubscriptionAPI = {
  // Create a new subscription
  async createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    await delay(700);
    return db.createSubscription(subscription);
  },
  
  // Get all subscriptions for a user
  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    await delay(300);
    return db.getUserSubscriptions(userId);
  }
};

export const PurchaseAPI = {
  // Create a new purchase
  async createPurchase(purchase: Omit<Purchase, 'id'>): Promise<Purchase> {
    await delay(700);
    return db.createPurchase(purchase);
  },
  
  // Get all purchases for a user
  async getUserPurchases(userId: string): Promise<Purchase[]> {
    await delay(300);
    return db.getUserPurchases(userId);
  }
};
