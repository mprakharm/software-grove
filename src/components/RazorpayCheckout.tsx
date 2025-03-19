
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

interface RazorpayCheckoutProps {
  productId: string;
  planId: string;
  planName: string;
  amount: number; // in rupees
  currency?: string; // Added currency prop
  onSuccess: () => void;
  onCancel: () => void;
}

const RATAN_NGROK_API_BASE_URL = 'https://d547-121-242-131-242.ngrok-free.app/proxy';

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
  const queryClient = useQueryClient();

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
      // Format order data
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

      // Call Razorpay API directly
      const razorpayApiUrl = `${RATAN_NGROK_API_BASE_URL}/razorpay_order_create`;
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

      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // Initialize Razorpay checkout
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
              
              // Store purchase record
              const purchaseData = {
                userId: user.id,
                productId: productId,
                bundleId: null,
                planId: planId,
                planName: planName,
                amount: amount,
                currency: currency,
                paymentMethod: 'Razorpay',
                transactionId: response.razorpay_payment_id,
                invoiceUrl: null,
                startDate: new Date().toISOString(),
                endDate: getEndDate(new Date()).toISOString(),
                autoRenew: true
              };
              
              // Store payment in database
              const storeResult = await fetch('/api/razorpay/store-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(purchaseData)
              });
              
              if (!storeResult.ok) {
                console.error('Failed to store payment:', await storeResult.text());
                toast({
                  title: "Payment Processing Error",
                  description: "Your payment was successful, but we couldn't save your subscription data. Please contact support.",
                  variant: "destructive"
                });
              } else {
                // Invalidate any existing subscription queries to force a refresh
                queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
                queryClient.invalidateQueries({ queryKey: ['purchases'] });
                
                // Also refresh subscriptions through the auth context
                await refreshSubscriptions();
                
                toast({
                  title: "Payment Successful",
                  description: "Your subscription has been activated successfully!",
                });
              }
              
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

        // @ts-ignore - Razorpay is loaded via script
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

  // Helper function to calculate the end date based on plan
  const getEndDate = (startDate: Date): Date => {
    const endDate = new Date(startDate);
    // Default to 1 month subscription
    endDate.setMonth(endDate.getMonth() + 1);
    return endDate;
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
