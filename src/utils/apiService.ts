
// Front-end API service that calls our backend proxy endpoints
const API_BASE_URL = '/api';

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
      
      const data = await response.json();
      console.log('Vendor plans data received from backend:', data);
      return data;
    } catch (error) {
      console.error('Error in getVendorPlans:', error);
      throw error;
    }
  },
  
  // Products API 
  async getProducts(filters?: { category?: string, searchQuery?: string }): Promise<any[]> {
    try {
      // Build query params for the API endpoint
      const queryParams = new URLSearchParams();
      if (filters?.category && filters.category !== 'All') {
        queryParams.append('category', filters.category);
      }
      if (filters?.searchQuery) {
        queryParams.append('search', filters.searchQuery);
      }
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
      console.log(`Fetching products from backend API: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching products: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received ${data.length} products from backend API`);
      return data;
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },
  
  async getProductById(id: string): Promise<any> {
    try {
      console.log(`Fetching product with ID: ${id} from backend API`);
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Product with ID ${id} not found`);
          return null;
        }
        const errorText = await response.text();
        console.error(`Error fetching product: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Product data received from backend:', data);
      return data;
    } catch (error) {
      console.error(`Error in getProductById for ID ${id}:`, error);
      throw error;
    }
  },
  
  async getProductByNameOrId(nameOrId: string): Promise<any> {
    try {
      console.log(`Fetching product with name or ID: ${nameOrId} from backend API`);
      const response = await fetch(`${API_BASE_URL}/products/lookup/${nameOrId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Product with name or ID ${nameOrId} not found`);
          return null;
        }
        const errorText = await response.text();
        console.error(`Error fetching product: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Product data received from backend:', data);
      return data;
    } catch (error) {
      console.error(`Error in getProductByNameOrId for ${nameOrId}:`, error);
      throw error;
    }
  },
  
  // Additional API methods can be added here
};
