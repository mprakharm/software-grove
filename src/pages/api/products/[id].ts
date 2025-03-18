
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiProxyController } from '@/utils/apiProxy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    console.log(`API route: Fetching product with ID: ${id}`);
    const product = await ApiProxyController.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({ message: 'Failed to fetch product' });
  }
}
