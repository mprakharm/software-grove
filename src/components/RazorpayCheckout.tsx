
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionService } from '@/utils/subscriptionService';
import { supabase } from '@/utils/supabase';

interface RazorpayCheckoutProps {
  productId: string;
  planId: string;
  planName: string;
  amount: number; // in rupees
  currency?: string; // Added currency prop
  onSuccess: () => void;
  onCancel: () => void;
}

const RATAN_NGROK_API_BASE_URL = 'https://8bf8-121-242-131-242.ngrok-free.app/proxy';

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  productId,
  planId,
  planName,
  amount,
  currency = 'INR', // Default to INR for Razorpay
  onSuccess,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, refreshSubscriptions } = useAuth();
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to this service.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        amount: amount * 100, // Convert to smallest unit (paise)
        currency: currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          productId: productId,
          planId: planId,
          planName: planName,
          userId: user.id,
          userEmail: user.email
        }
      };

      const razorpayApiUrl = `${RATAN_NGROK_API_BASE_URL}/razorpay_order_create`;
      console.log("Creating Razorpay order with API URL:", razorpayApiUrl);
      console.log("Order data:", JSON.stringify(orderData));
      
      const response = await fetch(razorpayApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Razorpay API error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to create Razorpay order: ${response.status}`);
      }

      const order = await response.json();
      console.log('Razorpay order created successfully:', order);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: 'rzp_test_Qk71AJmUSRc1Oi', // Test key
          amount: amount * 100, // in paise
          currency: currency,
          name: 'SaaS Market',
          description: `${planName} Subscription`,
          order_id: order.id,
          handler: async function(response: any) {
            try {
              console.log('Payment successful:', response);
              
              const today = new Date();
              const oneMonthLater = new Date(today);
              oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
              
              const subscriptionData = {
                userId: user.id,
                productId: productId,
                planId: planId,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                startDate: today.toISOString(),
                endDate: oneMonthLater.toISOString(),
                amount: amount,
                currency: currency,
                status: 'active',
                planName: planName
              };
              
              console.log('Storing subscription data:', subscriptionData);
              
              try {
                // First, try with the SubscriptionService
                await SubscriptionService.storeSuccessfulPayment(subscriptionData);
                console.log('Subscription stored successfully');
              } catch (storeError: any) {
                console.error('Failed to store subscription:', storeError);
                
                // Handle specific schema cache errors
                if (storeError.message && (
                  storeError.message.includes('currency') ||
                  storeError.message.includes('order_id') ||
                  storeError.message.includes('payment_id') ||
                  storeError.message.includes('description') ||
                  storeError.message.includes('schema cache')
                )) {
                  try {
                    console.log('Attempting direct table insert as fallback due to schema cache issue...');
                    
                    // Format subscription data for direct insertion with minimal required fields
                    // Only include fields we know exist in the base schema
                    const directSubscriptionData = {
                      user_id: subscriptionData.userId,
                      product_id: subscriptionData.productId,
                      plan_id: subscriptionData.planId,
                      start_date: subscriptionData.startDate,
                      end_date: subscriptionData.endDate,
                      auto_renew: true,
                      price: subscriptionData.amount,
                      created_at: new Date().toISOString()
                    };
                    
                    // Try to add optional fields if available in schema
                    try {
                      // Direct insert to subscriptions table
                      const { error: subError } = await supabase
                        .from('subscriptions')
                        .insert(directSubscriptionData);
                        
                      if (subError) {
                        console.error('Direct subscription insert failed:', subError);
                      } else {
                        console.log('Direct subscription insert successful');
                      }
                    } catch (directSubError) {
                      console.error('Fallback subscription insert failed:', directSubError);
                    }
                    
                    // Format purchase data for direct insertion with minimal required fields
                    const directPurchaseData = {
                      user_id: subscriptionData.userId,
                      product_id: subscriptionData.productId,
                      plan_id: subscriptionData.planId,
                      date: subscriptionData.startDate,
                      amount: subscriptionData.amount,
                      status: 'completed',
                      created_at: new Date().toISOString()
                    };
                    
                    try {
                      // Direct insert to purchases table
                      const { error: purchError } = await supabase
                        .from('purchases')
                        .insert(directPurchaseData);
                        
                      if (purchError) {
                        console.error('Direct purchase insert failed:', purchError);
                      } else {
                        console.log('Direct purchase insert successful');
                      }
                    } catch (directPurchError) {
                      console.error('Fallback purchase insert failed:', directPurchError);
                    }
                    
                  } catch (fallbackError) {
                    console.error('All fallback attempts failed:', fallbackError);
                    toast({
                      title: "Database Update Error",
                      description: "We've recorded your payment but couldn't update your subscription details. Our team will fix this shortly.",
                      variant: "destructive"
                    });
                  }
                } else {
                  toast({
                    title: "Subscription Record Error",
                    description: "We couldn't store your subscription details. Please contact support.",
                    variant: "destructive"
                  });
                }
              }
              
              await refreshSubscriptions();
              
              toast({
                title: "Payment Successful",
                description: "Your subscription has been activated successfully!",
              });
              
              onSuccess();
            } catch (error) {
              console.error('Payment verification failed:', error);
              toast({
                title: "Payment Verification Failed",
                description: "We couldn't verify your payment. Please contact support.",
                variant: "destructive"
              });
            }
          },
          prefill: {
            email: user.email,
          },
          theme: {
            color: '#6366F1',
          },
          modal: {
            ondismiss: function() {
              setIsLoading(false);
              onCancel();
            }
          }
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.open();
      };

      script.onerror = () => {
        setIsLoading(false);
        toast({
          title: "Payment Gateway Error",
          description: "Failed to load payment gateway. Please try again later.",
          variant: "destructive"
        });
      };

    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Payment Initiation Failed",
        description: "We couldn't start the payment process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading} 
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Pay with Razorpay'
      )}
    </Button>
  );
};

export default RazorpayCheckout;
