
import { supabase } from '@/utils/supabase';

export default async function handler(
  req: Request
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
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
    } = await req.json();

    // Validate required fields
    if (!userId || !planId || !startDate || !endDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
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
      return new Response(JSON.stringify({ error: 'Failed to create subscription' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in subscription creation API:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
