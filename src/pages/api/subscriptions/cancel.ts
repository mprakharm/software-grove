
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
    const { subscriptionId, userId, reason } = await req.json();

    // Validate required fields
    if (!subscriptionId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify the user owns this subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !subscription) {
      return new Response(JSON.stringify({ error: 'Subscription not found or does not belong to user' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
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
      return new Response(JSON.stringify({ error: 'Failed to cancel subscription' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in subscription cancellation API:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
