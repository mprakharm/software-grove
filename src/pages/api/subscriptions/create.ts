
import { supabase } from '@/utils/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      userId,
      productId,
      bundleId,
      planId,
      planName,
      startDate,
      endDate,
      autoRenew,
      price,
      currency,
      status,
    } = req.body;

    // Validate required fields
    if (!userId || !planId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the subscription record
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        product_id: productId,
        bundle_id: bundleId,
        plan_id: planId,
        plan_name: planName,
        start_date: startDate,
        end_date: endDate,
        auto_renew: autoRenew,
        price: price,
        currency: currency || 'USD',
        status: status || 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ error: 'Failed to create subscription' });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error in subscription creation API:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
