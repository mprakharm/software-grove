import { db, Product, Bundle, Subscription, Purchase } from './db';

// Simulate API response delay for development purposes
// In production, we would remove this delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ProductAPI = {
  // Get all products with optional filtering
  async getProducts(filters?: { category?: string, searchQuery?: string }): Promise<Product[]> {
    // Keep a small delay to simulate network request
    await delay(100);
    let products = await db.getAllProducts();
    
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
    return db.getProductById(id);
  },
  
  // Add a new product
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return db.addProduct(product);
  },
  
  // Update an existing product
  async updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
    return db.updateProduct(id, data);
  },
  
  // Delete a product
  async deleteProduct(id: string): Promise<boolean> {
    return db.deleteProduct(id);
  },
  
  // Bulk upload products
  async bulkUploadProducts(products: Omit<Product, 'id'>[]): Promise<Product[]> {
    const addedProducts: Product[] = [];
    
    for (const product of products) {
      try {
        const addedProduct = await db.addProduct(product);
        addedProducts.push(addedProduct);
      } catch (error) {
        console.error('Error adding product during bulk upload:', error);
      }
    }
    
    return addedProducts;
  }
};

export const BundleAPI = {
  // Get all bundles with optional filtering
  async getBundles(filters?: { category?: string, searchQuery?: string }): Promise<Bundle[]> {
    await delay(100);
    let bundles = await db.getAllBundles();
    
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
    return db.getBundleById(id);
  },
  
  // Add a new bundle
  async addBundle(bundle: Omit<Bundle, 'id'>): Promise<Bundle> {
    return db.addBundle(bundle);
  },
  
  // Update an existing bundle
  async updateBundle(id: string, data: Partial<Bundle>): Promise<Bundle | null> {
    return db.updateBundle(id, data);
  },
  
  // Delete a bundle
  async deleteBundle(id: string): Promise<boolean> {
    return db.deleteBundle(id);
  },
  
  // Bulk upload bundles
  async bulkUploadBundles(bundles: Omit<Bundle, 'id'>[]): Promise<Bundle[]> {
    const addedBundles: Bundle[] = [];
    
    for (const bundle of bundles) {
      try {
        const addedBundle = await db.addBundle(bundle);
        addedBundles.push(addedBundle);
      } catch (error) {
        console.error('Error adding bundle during bulk upload:', error);
      }
    }
    
    return addedBundles;
  }
};

export const SubscriptionAPI = {
  // Create a new subscription
  async createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    return db.createSubscription(subscription);
  },
  
  // Get all subscriptions for a user
  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return db.getUserSubscriptions(userId);
  }
};

export const PurchaseAPI = {
  // Create a new purchase
  async createPurchase(purchase: Omit<Purchase, 'id'>): Promise<Purchase> {
    return db.createPurchase(purchase);
  },
  
  // Get all purchases for a user
  async getUserPurchases(userId: string): Promise<Purchase[]> {
    return db.getUserPurchases(userId);
  }
};
