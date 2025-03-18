import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import { FEATURED_SOFTWARE } from './Index';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionAPI } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 6,
    yearlyPrice: 5, // 16% discount
    features: [
      '1 user',
      'Basic features',
      'Email support',
      '5GB storage',
      'Limited integrations',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 12,
    yearlyPrice: 10, // 16% discount
    features: [
      'Up to 5 users',
      'All Basic features',
      'Priority email support',
      '20GB storage',
      'Full integrations',
      'Advanced analytics',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 24,
    yearlyPrice: 20, // 16% discount
    features: [
      'Unlimited users',
      'All Pro features',
      '24/7 phone support',
      'Unlimited storage',
      'Custom integrations',
      'Dedicated account manager',
      'Custom branding',
    ],
    popular: false,
  }
];

const SubscriptionPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1].id);
  const [userCount, setUserCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshSubscriptions } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const product = FEATURED_SOFTWARE.find(item => item.id === productId);
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const breadcrumbItems = [
    {
      label: product.category,
      href: `/category/${product.category.toLowerCase()}`,
    },
    {
      label: product.name,
      href: `/product/${product.id}`,
    },
    {
      label: 'Subscribe',
      href: `/subscription/${product.id}`,
    },
  ];

  // Calculate the number of months for the saving calculation
  const monthCount = billingCycle === 'yearly' ? 12 : 1;
  
  // Calculate the total cost
  const selectedPlanData = subscriptionPlans.find(plan => plan.id === selectedPlan);
  const pricePerUser = billingCycle === 'yearly' 
    ? selectedPlanData?.yearlyPrice 
    : selectedPlanData?.monthlyPrice;
    
  const totalPrice = (pricePerUser || 0) * userCount;
  const yearlyTotalPrice = (selectedPlanData?.yearlyPrice || 0) * userCount * 12;
  const monthlyTotalPrice = (selectedPlanData?.monthlyPrice || 0) * userCount * 12;
  const annualSavings = monthlyTotalPrice - yearlyTotalPrice;
  const annualSavingsPercentage = Math.round((annualSavings / monthlyTotalPrice) * 100);

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to this service.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate renewal date (1 month or 1 year from now)
      const startDate = new Date();
      const endDate = new Date();
      if (billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // Create subscription
      const newSubscription = {
        user_id: user.id,
        product_id: productId,
        plan_id: selectedPlan,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        auto_renew: true,
        price: totalPrice,
        name: product.name,
        plan: selectedPlanData?.name || 'Unknown',
        users: userCount,
        renewalDate: endDate.toISOString(),
        monthlyPrice: pricePerUser || 0,
        usedStorage: 0,
        totalStorage: 20,
        status: 'active',
        image: product.image
      };

      await SubscriptionAPI.createSubscription(newSubscription);
      
      // Create a purchase record
      await supabase.from('purchases').insert({
        user_id: user.id,
        product_id: productId,
        plan_id: selectedPlan,
        date: new Date().toISOString(),
        amount: billingCycle === 'yearly' ? totalPrice * 12 : totalPrice,
        status: 'paid',
        description: `${product.name} - ${selectedPlanData?.name} (${userCount} users)`
      });

      // Refresh subscriptions in context
      await refreshSubscriptions();

      toast({
        title: "Subscription Successful",
        description: `You've successfully subscribed to ${product.name}!`,
      });

      // Navigate to subscriptions page
      navigate('/subscriptions');
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Choose your {product.name} plan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the plan that best fits your business needs. All plans include a 14-day free trial.
            </p>
          </div>
          
          <div className="flex justify-center mb-10">
            <Tabs 
              value={billingCycle} 
              onValueChange={setBillingCycle}
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly
                  <Badge className="ml-2 bg-green-500">Save {annualSavingsPercentage}%</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <RadioGroup 
            value={selectedPlan} 
            onValueChange={setSelectedPlan}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            {subscriptionPlans.map((plan) => {
              const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <div key={plan.id} className="relative">
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  <Label 
                    htmlFor={plan.id}
                    className={`block h-full cursor-pointer transition-all ${
                      selectedPlan === plan.id 
                        ? 'border-primary' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Card className={`h-full border-2 ${
                      selectedPlan === plan.id ? 'border-primary' : ''
                    }`}>
                      <div className="p-6">
                        <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                        
                        <h3 className="text-xl font-bold text-center mb-2">{plan.name}</h3>
                        
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold">${price}</div>
                          <div className="text-sm text-gray-500">per user / {billingCycle === 'yearly' ? 'month, billed annually' : 'month'}</div>
                        </div>
                        
                        <div className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <h3 className="font-medium mb-4">Number of Users</h3>
            <div className="flex items-center space-x-4 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setUserCount(Math.max(1, userCount - 1))}
                disabled={userCount <= 1}
              >
                -
              </Button>
              <span className="font-medium">{userCount}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setUserCount(userCount + 1)}
              >
                +
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              You can add more users at any time from your account dashboard.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border mb-8">
            <div className="flex justify-between mb-2">
              <span>Plan</span>
              <span>{selectedPlanData?.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Billing</span>
              <span>{billingCycle === 'yearly' ? 'Annual' : 'Monthly'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Users</span>
              <span>{userCount}</span>
            </div>
            <div className="border-t my-4"></div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <div className="text-right">
                <div className="font-bold">${totalPrice}{billingCycle === 'yearly' ? '/mo' : '/mo'}</div>
                <div className="text-sm text-gray-500">
                  {billingCycle === 'yearly' ? `$${totalPrice * 12} billed annually` : ''}
                </div>
              </div>
            </div>
            {billingCycle === 'yearly' && (
              <div className="mt-2 text-sm text-green-600 text-right">
                You save ${annualSavings} per year
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              size="lg" 
              onClick={handleSubscribe}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Processing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage;
