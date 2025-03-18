
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiProxyController } from '@/utils/apiProxy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nameOrId } = req.query;

  if (!nameOrId || Array.isArray(nameOrId)) {
    return res.status(400).json({ message: 'Invalid product name or ID' });
  }

  try {
    console.log(`API route: Looking up product with name or ID: ${nameOrId}`);
    const product = await ApiProxyController.getProductByNameOrId(nameOrId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({ message: 'Failed to lookup product' });
  }
}
