
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiProxyController } from '@/utils/apiProxy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { category, search } = req.query;
  
  // Convert query params to the expected filter format
  const filters: { category?: string, searchQuery?: string } = {};
  
  if (category && !Array.isArray(category)) {
    filters.category = category;
  }
  
  if (search && !Array.isArray(search)) {
    filters.searchQuery = search;
  }

  try {
    console.log('API route: Fetching products with filters:', filters);
    const products = await ApiProxyController.getProducts(filters);
    return res.status(200).json(products);
  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
}
