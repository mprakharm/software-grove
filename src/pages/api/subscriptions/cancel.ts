
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
    const { subscriptionId, userId, reason } = req.body;

    // Validate required fields
    if (!subscriptionId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the user owns this subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !subscription) {
      return res.status(404).json({ error: 'Subscription not found or does not belong to user' });
    }

    // Update the subscription status
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancellation_date: new Date().toISOString(),
        cancellation_reason: reason || 'User cancelled',
        auto_renew: false
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error cancelling subscription:', error);
      return res.status(500).json({ error: 'Failed to cancel subscription' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in subscription cancellation API:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
