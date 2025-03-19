
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Razorpay from 'react-razorpay';

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
      const razorpayApiUrl = 'https://api.razorpay.com/v1/orders';
      const response = await fetch(razorpayApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('rzp_test_Qk71AJmUSRc1Oi:i5GWHCPoDcSV14JLbZWV73uQ')
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
            
            // Store order in database
            const storeResult = await fetch('/api/razorpay/store-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId: user.id,
                productId: productId,
                planId: planId,
                amount: amount,
                planName: planName
              })
            });
            
            if (!storeResult.ok) {
              console.error('Failed to store payment:', await storeResult.text());
            }
            
            // Refresh user subscriptions
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

      const RazorpayCheckout = new Razorpay(options);
      RazorpayCheckout.open();
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
