
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import { FEATURED_SOFTWARE } from './Index';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, ArrowRight, Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionAPI, VendorAPI } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/utils/supabase';

interface VendorPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
  billingOptions: string[];
  discountPercentage: number;
}

const SubscriptionPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [userCount, setUserCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [vendorPlans, setVendorPlans] = useState<VendorPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showPlans, setShowPlans] = useState(false);
  const { user, refreshSubscriptions } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const product = FEATURED_SOFTWARE.find(item => item.id === productId);
  
  // Fetch vendor plans
  const fetchVendorPlans = async () => {
    if (!productId) return;
    
    setIsLoadingPlans(true);
    try {
      const plans = await VendorAPI.getProductPlans(productId);
      setVendorPlans(plans);
      
      // Set default selected plan (usually the popular or middle one)
      const popularPlan = plans.find(plan => plan.popular);
      setSelectedPlan(popularPlan ? popularPlan.id : plans[1]?.id || plans[0]?.id);
      
      setShowPlans(true);
    } catch (error) {
      console.error('Error fetching vendor plans:', error);
      toast({
        title: "Failed to load plans",
        description: "We couldn't load the plans for this product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPlans(false);
    }
  };
  
  // Calculate plan price based on billing cycle and user count
  const calculatePlanPrice = (basePrice: number, discountPercentage: number) => {
    let price = basePrice * userCount;
    
    if (billingCycle === 'yearly') {
      // Apply annual discount
      price = price * (1 - (discountPercentage / 100));
    }
    
    return price;
  };
  
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
  
  const selectedVendorPlan = vendorPlans.find(plan => plan.id === selectedPlan);
  
  const handleInitialSubscribe = () => {
    fetchVendorPlans();
  };

  const handleCompletePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to this service.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }

    if (!selectedVendorPlan) {
      toast({
        title: "Please select a plan",
        description: "You need to select a subscription plan to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      if (billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const planPrice = calculatePlanPrice(
        selectedVendorPlan.price, 
        selectedVendorPlan.discountPercentage
      );

      const newSubscription = {
        userId: user.id,
        productId: productId,
        planId: selectedPlan,
        startDate: startDate,
        endDate: endDate,
        autoRenew: true,
        price: planPrice,
      };

      const subscriptionMetadata = {
        name: product.name,
        plan: selectedVendorPlan.name,
        users: userCount,
        renewalDate: endDate.toISOString(),
        monthlyPrice: planPrice,
        usedStorage: 0,
        totalStorage: 20,
        status: 'active',
        image: product.image
      };

      await SubscriptionAPI.createSubscription(newSubscription);
      
      await supabase.from('purchases').insert({
        user_id: user.id,
        product_id: productId,
        plan_id: selectedPlan,
        date: new Date().toISOString(),
        amount: billingCycle === 'yearly' ? planPrice * 12 : planPrice,
        status: 'paid',
        description: `${product.name} - ${selectedVendorPlan.name} (${userCount} users)`
      });

      await refreshSubscriptions();

      toast({
        title: "Subscription Successful",
        description: `You've successfully subscribed to ${product.name}!`,
      });

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
            <h1 className="text-3xl font-bold mb-3">Subscribe to {product.name}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {showPlans ? 
                "Select the plan that best fits your business needs." : 
                "Click the button below to see available plans and pricing options."}
            </p>
          </div>
          
          {!showPlans ? (
            <div className="text-center mb-12">
              <div className="relative mb-8">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 p-6 max-w-xl mx-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="h-16 w-16 rounded-lg flex-shrink-0 bg-cover bg-center"
                      style={{ 
                        backgroundColor: product.color,
                        backgroundImage: product.image ? `url(${product.image})` : 'none'
                      }}
                    />
                    <div>
                      <h2 className="text-xl font-bold">{product.name}</h2>
                      <div className="text-sm text-gray-600">{product.category}</div>
                      {product.rating && (
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={`${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} mr-0.5`} 
                            />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={handleInitialSubscribe}
                    disabled={isLoadingPlans}
                  >
                    {isLoadingPlans ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading plans...
                      </>
                    ) : (
                      <>
                        View available plans
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </Card>
              </div>
            </div>
          ) : (
            <>
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
                      <Badge className="ml-2 bg-green-500">Save up to 25%</Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <RadioGroup 
                value={selectedPlan} 
                onValueChange={setSelectedPlan}
                className="grid md:grid-cols-3 gap-6 mb-8"
              >
                {vendorPlans.map((plan) => {
                  const price = calculatePlanPrice(plan.price, plan.discountPercentage);
                  const annualPrice = price * 12;
                  
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
                              <div className="text-3xl font-bold">${price.toFixed(2)}</div>
                              <div className="text-sm text-gray-500">per user / {billingCycle === 'yearly' ? 'month, billed annually' : 'month'}</div>
                              {billingCycle === 'yearly' && (
                                <div className="text-xs text-gray-500">${annualPrice.toFixed(2)} per year</div>
                              )}
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
              
              {selectedVendorPlan && (
                <div className="bg-gray-50 p-6 rounded-lg border mb-8">
                  <div className="flex justify-between mb-2">
                    <span>Plan</span>
                    <span>{selectedVendorPlan.name}</span>
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
                      <div className="font-bold">
                        ${calculatePlanPrice(selectedVendorPlan.price, selectedVendorPlan.discountPercentage).toFixed(2)}/mo
                      </div>
                      <div className="text-sm text-gray-500">
                        {billingCycle === 'yearly' ? 
                          `$${(calculatePlanPrice(selectedVendorPlan.price, selectedVendorPlan.discountPercentage) * 12).toFixed(2)} billed annually` : 
                          ''}
                      </div>
                    </div>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="mt-2 text-sm text-green-600 text-right">
                      You save ${(selectedVendorPlan.price * userCount * 12 * (selectedVendorPlan.discountPercentage / 100)).toFixed(2)} per year
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  size="lg" 
                  onClick={handleCompletePurchase}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Processing...
                    </>
                  ) : (
                    'Complete Purchase'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage;
