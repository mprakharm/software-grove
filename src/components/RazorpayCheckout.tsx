import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionService } from '@/utils/subscriptionService';

interface RazorpayCheckoutProps {
  productId: string;
  planId: string;
  planName: string;
  amount: number; // in rupees
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
  productName?: string; // Added product name
  productLogo?: string; // Added product logo
}

const RATAN_NGROK_API_BASE_URL = 'https://205e-101-0-62-174.ngrok-free.app/proxy';

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  productId,
  planId,
  planName,
  amount,
  currency = 'INR', // Default to INR for Razorpay
  onSuccess,
  onCancel,
  productName = '',
  productLogo = ''
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
          userEmail: user.email,
          productName: productName, // Store product name in notes
          productLogo: productLogo // Store product logo in notes
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
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                startDate: today.toISOString(),
                endDate: oneMonthLater.toISOString(),
                amount: amount,
                currency: currency,
                status: 'active',
                planName: planName,
                autoRenew: true,
                productName: productName, // Pass product name
                productLogo: productLogo // Pass product logo
              };
              
              console.log('Storing subscription data:', subscriptionData);
              
              try {
                await SubscriptionService.storeSuccessfulPayment(subscriptionData);
                console.log('Subscription stored successfully');
                
                console.log('Refreshing subscriptions after successful payment');
                await refreshSubscriptions();
                
                toast({
                  title: "Payment Successful",
                  description: "Your subscription has been activated successfully!",
                });
                
                onSuccess();
              } catch (storeError: any) {
                console.error('Failed to store subscription details:', storeError);
                
                if (storeError.message) {
                  console.error('Error message:', storeError.message);
                }
                if (storeError.details) {
                  console.error('Error details:', storeError.details);
                }
                
                toast({
                  title: "Payment Processed",
                  description: "Your payment was successful, but we had trouble updating your account. Please contact support if you don't see your subscription.",
                  variant: "destructive"
                });
                
                onSuccess();
              }
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
