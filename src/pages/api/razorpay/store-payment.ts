
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
      orderId,
      paymentId,
      signature,
      userId,
      productId,
      bundleId,
      planId,
      planName,
      amount,
      currency,
      paymentMethod,
      transactionId
    } = req.body;

    // Validate required fields
    if (!userId || !planId || !amount || !paymentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the purchase record
    const { data, error } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        product_id: productId,
        bundle_id: bundleId,
        plan_id: planId,
        plan_name: planName || 'Subscription Plan',
        date: new Date().toISOString(),
        amount: amount,
        currency: currency || 'USD',
        status: 'completed',
        payment_method: paymentMethod || 'Razorpay',
        transaction_id: transactionId || paymentId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating purchase record:', error);
      return res.status(500).json({ error: 'Failed to store payment' });
    }

    // Create or update a subscription record
    const today = new Date();
    const endDate = new Date(today);
    // Default to monthly subscription (adjust as needed)
    endDate.setMonth(today.getMonth() + 1);

    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        product_id: productId,
        bundle_id: bundleId,
        plan_id: planId,
        plan_name: planName || 'Subscription Plan',
        start_date: today.toISOString(),
        end_date: endDate.toISOString(),
        auto_renew: true,
        price: amount,
        currency: currency || 'USD',
        status: 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating subscription record:', subscriptionError);
      // Continue processing even if subscription creation fails
    }

    return res.status(201).json({
      purchase: data,
      subscription: subscriptionData || null
    });
  } catch (error) {
    console.error('Error in store payment API:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
