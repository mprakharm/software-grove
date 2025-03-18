
import { VendorAPI } from './api';

// Server-side proxy controller for vendor API calls
export const ApiProxyController = {
  async getVendorPlans(productId: string): Promise<any[]> {
    console.log(`Backend proxy: Processing vendor plans request for product ID: ${productId}`);
    try {
      // Use the VendorAPI to get the plans - this happens server-side
      const plans = await VendorAPI.getProductPlans(productId);
      return plans;
    } catch (error) {
      console.error('Backend proxy: Error fetching vendor plans:', error);
      throw error;
    }
  },
  
  async getProducts(filters?: { category?: string, searchQuery?: string }): Promise<any[]> {
    console.log(`Backend proxy: Processing products request with filters:`, filters);
    try {
      // This will be executed server-side in Next.js API routes
      const supabase = (await import('./supabase')).supabase;
      const { data, error } = await supabase
        .from('products')
        .select();
      
      if (error) {
        console.error('Error fetching products from Supabase:', error);
        throw error;
      }
      
      let filteredData = data || [];
      
      // Apply filters on the server side
      if (filters) {
        if (filters.category && filters.category !== 'All') {
          filteredData = filteredData.filter(product => 
            product.category.toLowerCase() === filters.category?.toLowerCase()
          );
        }
        
        if (filters.searchQuery) {
          const search = filters.searchQuery.toLowerCase();
          filteredData = filteredData.filter(product => 
            product.name.toLowerCase().includes(search) ||
            (product.description && product.description.toLowerCase().includes(search)) ||
            (product.category && product.category.toLowerCase().includes(search)) ||
            (product.vendor && product.vendor.toLowerCase().includes(search))
          );
        }
      }
      
      const transformers = await import('./transformers');
      
      // Transform product data before returning
      return Promise.all(filteredData.map(product => {
        // Apply any needed transformations
        return transformers.transformProductFromSupabase(product);
      }));
    } catch (error) {
      console.error('Backend proxy: Error fetching products:', error);
      throw error;
    }
  },
  
  async getProductById(id: string): Promise<any | null> {
    console.log(`Backend proxy: Fetching product with ID: ${id}`);
    try {
      const supabase = (await import('./supabase')).supabase;
      const transformers = await import('./transformers');
      
      const { data, error } = await supabase
        .from('products')
        .select()
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`Product with ID ${id} not found`);
          return null;
        }
        console.error('Error fetching product from Supabase:', error);
        throw error;
      }
      
      return data ? transformers.transformProductFromSupabase(data) : null;
    } catch (error) {
      console.error(`Backend proxy: Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },
  
  async getProductByNameOrId(nameOrId: string): Promise<any | null> {
    console.log(`Backend proxy: Looking up product with name or ID: ${nameOrId}`);
    try {
      const supabase = (await import('./supabase')).supabase;
      const transformers = await import('./transformers');
      
      // First try by ID
      const { data: idData, error: idError } = await supabase
        .from('products')
        .select()
        .eq('id', nameOrId)
        .single();
      
      if (idData) {
        return transformers.transformProductFromSupabase(idData);
      }
      
      // Then try by formatting the name
      const formattedName = nameOrId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const { data: nameData } = await supabase
        .from('products')
        .select()
        .ilike('name', formattedName)
        .single();
      
      if (nameData) {
        return transformers.transformProductFromSupabase(nameData);
      }
      
      // Try a more flexible match
      const { data: flexData } = await supabase
        .from('products')
        .select()
        .ilike('name', `%${nameOrId.replace(/-/g, '%')}%`)
        .single();
      
      if (flexData) {
        return transformers.transformProductFromSupabase(flexData);
      }
      
      console.log(`No product found with name or ID: ${nameOrId}`);
      return null;
    } catch (error) {
      console.error(`Backend proxy: Error in getProductByNameOrId for ${nameOrId}:`, error);
      return null;
    }
  },
  
  // Additional proxy methods can be added here
};
