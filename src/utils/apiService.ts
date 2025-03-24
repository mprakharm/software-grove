
// Front-end API service that calls our backend proxy endpoints
const API_BASE_URL = '/api';
const RATAN_NGROK_BASE_URL = 'https://205e-101-0-62-174.ngrok-free.app/proxy';

// Front-end API service that calls our backend proxy endpoints
export const ApiService = {
  // Vendor Plans API
  async getVendorPlans(productId: string): Promise<any[]> {
    try {
      console.log(`Fetching vendor plans for product ID: ${productId} via backend proxy`);
      const response = await fetch(`${API_BASE_URL}/vendor-plans/${productId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching vendor plans: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch vendor plans: ${response.status}`);
      }
      
      // Try to parse the response as JSON
      try {
        const data = await response.json();
        console.log('Vendor plans data received from backend:', data);
        
        if (!data) {
          throw new Error('Empty response from server');
        }
        
        if (data && data.error) {
          console.error('Backend returned an error:', data.error);
          throw new Error(data.error);
        }
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
          console.warn('API returned non-array data:', data);
          throw new Error('Invalid response format: expected an array');
        }
        
        return data;
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error in getVendorPlans:', error);
      throw error;
    }
  },
  
  // Get all products for the admin page
  async getProductsForAdmin(): Promise<any[]> {
    try {
      console.log('Fetching all products for admin page');
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching products: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products data received:', data);
      return data;
    } catch (error) {
      console.error('Error in getProductsForAdmin:', error);
      // Try to use the ProductAPI as a fallback
      try {
        const { ProductAPI } = await import('./api');
        return await ProductAPI.getProducts();
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw error;
      }
    }
  },
  
  // Create a new product
  async createProduct(productData: any): Promise<any> {
    try {
      console.log('Creating new product via ApiService:', productData);
      
      // First try the API endpoint
      try {
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error creating product: ${response.status} - ${errorText}`);
          throw new Error(`Failed to create product: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Product created successfully via API:', data);
        return data;
      } catch (apiError) {
        console.warn('API endpoint failed, falling back to ProductAPI:', apiError);
        // Fallback to direct database access
        const { ProductAPI } = await import('./api');
        const createdProduct = await ProductAPI.addProduct(productData);
        console.log('Product created successfully via ProductAPI:', createdProduct);
        return createdProduct;
      }
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },
  
  // Create a Razorpay order
  async createRazorpayOrder(orderData: {
    amount: number;      // Amount in smallest currency unit (paise for INR)
    currency: string;    // Currency code (e.g., INR)
    receipt?: string;    // Your internal order ID
    notes?: Record<string, string>; // Optional metadata
  }): Promise<any> {
    try {
      console.log('Creating Razorpay order:', orderData);

      const response = await fetch(`${RATAN_NGROK_BASE_URL}/razorpay_order_create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error creating Razorpay order: ${response.status} - ${errorText}`);
        throw new Error(`Failed to create Razorpay order: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Razorpay order created:', data);
      return data;
    } catch (error) {
      console.error('Error in createRazorpayOrder:', error);
      throw error;
    }
  },
  
  // Process a successful Razorpay payment
  async processRazorpayPayment(paymentData: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<any> {
    try {
      console.log('Processing Razorpay payment:', paymentData);
      
      const response = await fetch(`${API_BASE_URL}/razorpay/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error processing payment: ${response.status} - ${errorText}`);
        throw new Error(`Failed to process payment: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Payment processed successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in processRazorpayPayment:', error);
      throw error;
    }
  },
  
  // Store subscription data after successful payment
  async storeSubscription(subscriptionData: {
    userId: string;
    productId: string;
    planId: string;
    orderId: string;
    paymentId: string;
    signature?: string;
    startDate: string;
    endDate: string;
    amount: number;
    currency?: string;
    status: string;
    planName?: string;
  }): Promise<any> {
    try {
      console.log('Storing subscription data:', subscriptionData);
      
      const response = await fetch(`${RATAN_NGROK_BASE_URL}/store_subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error storing subscription: ${response.status} - ${errorText}`);
        throw new Error(`Failed to store subscription: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Subscription stored successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in storeSubscription:', error);
      throw error;
    }
  },
  
  // Additional API methods can be added here
};
