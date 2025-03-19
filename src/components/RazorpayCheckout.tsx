
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RazorpayService } from '@/utils/razorpayService';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  productId: string;
  planId: string;
  planName: string;
  amount: number; // in rupees
  currency?: string; // Added currency prop
  onSuccess: () => void;
  onCancel: () => void;
}

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

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
      // Create an order directly using RazorpayService
      const razorpayOrderRequest = {
        amount: amount * 100, // Convert to smallest unit (paise)
        currency: currency, // Use the provided currency or default
        receipt: `receipt_${Date.now()}`,
        notes: {
          productId: productId,
          planId: planId,
          planName: planName,
          userEmail: user.email
        },
        user_id: user.id,
        product_id: productId,
        plan_id: planId
      };
      
      console.log('Creating Razorpay order request:', razorpayOrderRequest);
      
      // Direct call to RazorpayService instead of going through apiService
      const orderData = await RazorpayService.createOrder(razorpayOrderRequest);
      
      console.log('Razorpay order created:', orderData);

      // Initialize Razorpay checkout
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Test key
        amount: orderData.amount, // Use amount from order response
        currency: orderData.currency, // Use currency from order response
        name: 'SaaS Market',
        description: `${planName} Subscription`,
        order_id: orderData.id, // Use order ID from response
        handler: async function(response: any) {
          try {
            // Process payment success
            const success = await RazorpayService.processSuccessfulPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            
            if (success) {
              // Refresh user subscriptions
              await refreshSubscriptions();
              
              toast({
                title: "Payment Successful",
                description: "Your subscription has been activated successfully!",
              });
              
              onSuccess();
            } else {
              throw new Error('Payment verification failed');
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

      const razorpay = new window.Razorpay(options);
      razorpay.open();
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
