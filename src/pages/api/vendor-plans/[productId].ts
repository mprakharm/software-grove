
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiProxyController } from '@/utils/apiProxy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { productId } = req.query;

  if (!productId || Array.isArray(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    console.log(`API route: Fetching vendor plans for product ID: ${productId}`);
    const plans = await ApiProxyController.getVendorPlans(productId);
    return res.status(200).json(plans);
  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({ message: 'Failed to fetch vendor plans' });
  }
}
