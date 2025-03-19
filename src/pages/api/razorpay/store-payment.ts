
import { supabase } from '@/utils/supabase';

export default async function handler(
  req: Request
) {
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
      amount,
      currency,
      paymentMethod,
      transactionId,
      invoiceUrl,
      startDate,
      endDate,
      autoRenew
    } = await req.json();

    // Validate required fields
    if (!userId || !amount || !transactionId || !planId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create a purchase record
    const purchaseResult = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        product_id: productId,
        bundle_id: bundleId,
        plan_id: planId,
        plan_name: planName,
        date: new Date().toISOString(),
        amount,
        currency: currency || 'USD',
        status: 'completed',
        payment_method: paymentMethod,
        transaction_id: transactionId,
        invoice_url: invoiceUrl,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (purchaseResult.error) {
      console.error('Error creating purchase record:', purchaseResult.error);
      return new Response(JSON.stringify({ error: 'Failed to store payment information' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create a subscription record
    const subscriptionResult = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        product_id: productId,
        bundle_id: bundleId,
        plan_id: planId,
        plan_name: planName,
        start_date: startDate || new Date().toISOString(),
        end_date: endDate,
        auto_renew: autoRenew || false,
        price: amount,
        currency: currency || 'USD',
        status: 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (subscriptionResult.error) {
      console.error('Error creating subscription record:', subscriptionResult.error);
      // Continue since we already stored the payment
    }

    // Return both purchase and subscription records
    return new Response(JSON.stringify({
      purchase: purchaseResult.data,
      subscription: subscriptionResult.data || null,
      success: true
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing payment storage:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
