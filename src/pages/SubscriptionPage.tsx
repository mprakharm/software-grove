import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, ArrowRight, Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionAPI, ProductAPI } from '@/utils/api';
import { ApiService } from '@/utils/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/utils/supabase';
import { Product } from '@/utils/db';
import RazorpayCheckout from '@/components/RazorpayCheckout';

interface VendorPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
  billingOptions: string[];
  discountPercentage: number;
  currency?: string;
}

interface ApiPlan {
  plan_id?: string;
  plan_name?: string;
  coupon_type?: string;
  plan_description?: string;
  plan_cost?: number;
  plan_mrp?: number;
  vendor_name?: string;
  vendor_logo_url?: string;
  currency?: string;
  plan_activation_message?: string;
  steps_to_redeem_coupon?: string | null;
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  features?: string[];
  popular?: boolean;
  billingOptions?: string[];
  discountPercentage?: number;
}

const SubscriptionPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [userCount, setUserCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [vendorPlans, setVendorPlans] = useState<VendorPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showPlans, setShowPlans] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [hasMultipleBillingOptions, setHasMultipleBillingOptions] = useState(true);
  const { user, refreshSubscriptions } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isStreamingOrSocialProduct = () => {
    if (!productId || !product) return false;
    return productId === 'zee5' || 
           productId === 'linkedin-premium' || 
           productId === 'linkedin' ||
           (product.name && (
             product.name.toLowerCase().includes('zee5') || 
             product.name.toLowerCase().includes('linkedin')
           ));
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      
      setIsLoadingProduct(true);
      try {
        const fetchedProduct = await ProductAPI.getProductById(productId);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast({
          title: "Product not found",
          description: "We couldn't find the product you're looking for.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingProduct(false);
      }
    };
    
    fetchProductDetails();
  }, [productId, toast]);

  const normalizeAPIPlans = (apiPlans: any[]): VendorPlan[] => {
    if (!apiPlans || !Array.isArray(apiPlans) || apiPlans.length === 0) {
      console.warn('Invalid API plans format:', apiPlans);
      return [];
    }
    
    if (productId === 'linkedin-premium' || productId === 'linkedin' || productId === 'zee5' ||
        (product && (product.name.toLowerCase().includes('linkedin') || product.name.toLowerCase().includes('zee5')))) {
      
      console.log('Normalizing plans from API for:', product?.name, apiPlans);
      
      try {
        let plan: ApiPlan | undefined;
        
        if (apiPlans[0] && apiPlans[0].plan_list && Array.isArray(apiPlans[0].plan_list)) {
          console.log('Looking for plan_id=plan_A0qs3dlK in plan_list');
          
          for (const product of apiPlans) {
            if (product.plan_list && Array.isArray(product.plan_list)) {
              plan = product.plan_list.find((p: ApiPlan) => p.plan_id === 'plan_A0qs3dlK');
              if (plan) break;
            }
          }
          
          if (!plan && apiPlans[0].plan_list && apiPlans[0].plan_list.length > 0) {
            plan = apiPlans[0].plan_list[0];
          }
        } else {
          plan = apiPlans.find((p: ApiPlan) => p.plan_id === 'plan_A0qs3dlK');
          
          if (!plan && apiPlans.length > 0) {
            plan = apiPlans[0];
          }
        }
        
        console.log('Selected plan:', plan);
        
        if (plan) {
          setHasMultipleBillingOptions(false);
          
          const featuresList = plan.plan_description 
            ? plan.plan_description.split(/\r?\n/).filter(f => f.trim() !== '') 
            : ['Premium feature'];
          
          console.log('Extracted features:', featuresList);
          
          return [{
            id: plan.plan_id || `${product?.name.toLowerCase()}-premium-plan`,
            name: plan.plan_name || `${product?.name} Premium`,
            description: plan.plan_activation_message || `Premium ${product?.name} Subscription`,
            price: plan.plan_cost || plan.plan_mrp || 29.99,
            features: featuresList,
            popular: true,
            billingOptions: ['standard'],
            discountPercentage: plan.plan_mrp && plan.plan_cost
              ? Math.round(((plan.plan_mrp - plan.plan_cost) / plan.plan_mrp) * 100)
              : 0,
            currency: plan.currency?.toUpperCase() || 'INR'
          }];
        }
        
        return apiPlans.map((plan, index) => {
          setHasMultipleBillingOptions(false);
          
          const normalizedPlan: VendorPlan = {
            id: plan.id || plan.plan_id || `${product?.name.toLowerCase()}-plan-${index}`,
            name: plan.name || plan.plan_name || `${product?.name} Plan`,
            description: plan.description || plan.plan_description || `${product?.name} Subscription`,
            price: typeof plan.price === 'number' ? plan.price : 
                   (plan.plan_cost || plan.plan_mrp || 29.99 + (index * 30)),
            features: Array.isArray(plan.features) ? plan.features : 
                     (plan.plan_description ? plan.plan_description.split(/\r?\n/).filter(f => f.trim() !== '') : ['Premium feature']),
            popular: index === 0,
            billingOptions: ['standard'],
            discountPercentage: plan.discountPercentage || 
                              (plan.plan_mrp && plan.plan_cost 
                                ? Math.round(((plan.plan_mrp - plan.plan_cost) / plan.plan_mrp) * 100) 
                                : 0),
            currency: plan.currency?.toUpperCase() || 'INR'
          };
          
          console.log('Normalized plan:', normalizedPlan);
          return normalizedPlan;
        });
      } catch (error) {
        console.error('Error normalizing API plans:', error);
        return [];
      }
    }
    
    return apiPlans;
  };
  
  const fetchVendorPlans = async () => {
    if (!productId) return;
    
    setIsLoadingPlans(true);
    try {
      console.log('Fetching plans for product ID:', productId);
      
      const plansData = await ApiService.getVendorPlans(productId);
      console.log('Raw plans fetched from API service:', plansData);
      
      const normalizedPlans = normalizeAPIPlans(plansData);
      console.log('Normalized plans:', normalizedPlans);
      
      if (normalizedPlans.length > 0) {
        setVendorPlans(normalizedPlans);
        
        setSelectedPlan(normalizedPlans[0]?.id);
        
        setShowPlans(true);
      } else {
        throw new Error('No valid plans returned from API');
      }
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

  const calculatePlanPrice = (basePrice: number, discountPercentage: number) => {
    let price = isStreamingOrSocialProduct() ? basePrice : basePrice * userCount;
    
    if (hasMultipleBillingOptions && billingCycle === 'yearly') {
      price = price * (1 - (discountPercentage / 100));
    }
    
    return price;
  };

  const handleInitialSubscribe = () => {
    fetchVendorPlans();
  };

  const createRazorpayOrder = async (
    productId: string,
    planId: string,
    planName: string,
    amount: number
  ) => {
    try {
      const orderData = await ApiService.createRazorpayOrder({
        amount: amount * 100,
        currency: 'INR',
        notes: {
          productId: productId,
          planId: planId,
          planName: planName
        }
      });

      const options = {
        key: 'rzp_test_Qk71AJmUSRc1Oi',
        amount: amount * 100,
        currency: 'INR',
        name: 'SaaS Market',
        description: `${planName} Subscription`,
        order_id: orderData.id,
        handler: async function(response: any) {
          try {
            await ApiService.processRazorpayPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
            
            await refreshSubscriptions();
            
            toast({
              title: "Payment Successful",
              description: "Your subscription has been activated successfully!",
            });
            
            navigate('/subscriptions');
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: "Payment Verification Failed",
              description: "We couldn't verify your payment. Please contact support.",
              variant: "destructive"
            });
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          email: user!.email,
        },
        theme: {
          color: '#6366F1',
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
            toast({
              title: "Payment Cancelled",
              description: "You can try again when you're ready.",
              variant: "default"
            });
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
      setIsSubmitting(false);
    }
  };

  const handleCompletePurchase = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to this service.",
        variant: "destructive"
      });
      navigate('/sign-in');
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
    
    const amount = calculatePlanPrice(selectedVendorPlan.price, selectedVendorPlan.discountPercentage);
    
    createRazorpayOrder(
      product!.id,
      selectedPlan,
      selectedVendorPlan.name,
      amount
    );
  };

  const getCurrencySymbol = (currency?: string): string => {
    if (!currency) return '₹'; // Default to INR symbol for Indian Rupee
    
    switch (currency.toUpperCase()) {
      case 'USD':
        return '$';
      case 'INR':
        return '₹';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return '₹'; // Default to INR symbol
    }
  };

  if (isLoadingProduct) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </Layout>
    );
  }
  
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
      label: product?.category || 'Products',
      href: `/category/${product?.category?.toLowerCase() || 'all'}`,
    },
    {
      label: product?.name || 'Product',
      href: `/product/${product?.id}`,
    },
    {
      label: 'Subscribe',
      href: `/subscription/${product?.id}`,
    },
  ];
  
  const selectedVendorPlan = vendorPlans.find(plan => plan.id === selectedPlan);
  
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
                        backgroundColor: product.color || '#2D88FF',
                        backgroundImage: product.logo ? `url(${product.logo})` : 'none'
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
                            {product.rating} ({product.reviews || 0})
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
              {hasMultipleBillingOptions && (
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
              )}
              
              {vendorPlans.length > 0 ? (
                <RadioGroup 
                  value={selectedPlan} 
                  onValueChange={setSelectedPlan}
                  className="grid md:grid-cols-3 gap-6 mb-8"
                >
                  {vendorPlans.map((plan) => {
                    const price = calculatePlanPrice(plan.price, plan.discountPercentage);
                    const currencySymbol = getCurrencySymbol(plan.currency);
                    
                    return (
                      <div key={plan.id} className="relative">
                        {plan.popular && (
                          <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 bg-primary">
                            Recommended
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
                                <div className="text-3xl font-bold">{currencySymbol}{price.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">
                                  {hasMultipleBillingOptions 
                                    ? `per user / ${billingCycle === 'yearly' ? 'month, billed annually' : 'month'}`
                                    : 'per user'}
                                </div>
                                {plan.discountPercentage > 0 && (
                                  <div className="text-xs text-green-600 mt-1">
                                    Save {plan.discountPercentage}% off regular price
                                  </div>
                                )}
                              </div>
                              
                              {plan.description && (
                                <div className="text-sm text-center text-gray-600 mb-4 italic">
                                  {plan.description}
                                </div>
                              )}
                              
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
              ) : (
                <div className="text-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading plan options...</p>
                </div>
              )}
              
              {!isStreamingOrSocialProduct() && (
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
              )}
              
              {selectedVendorPlan && (
                <div className="bg-gray-50 p-6 rounded-lg border mb-8">
                  <div className="flex justify-between mb-2">
                    <span>Plan</span>
                    <span>{selectedVendorPlan.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Billing</span>
                    <span>
                      {hasMultipleBillingOptions 
                        ? (billingCycle === 'yearly' ? 'Annual' : 'Monthly')
                        : 'Standard'}
                    </span>
                  </div>
                  {!isStreamingOrSocialProduct() && (
                    <div className="flex justify-between mb-2">
                      <span>Users</span>
                      <span>{userCount}</span>
                    </div>
                  )}
                  <div className="border-t my-4"></div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <div className="text-right">
                      <div className="font-bold">
                        {getCurrencySymbol(selectedVendorPlan.currency)}{calculatePlanPrice(selectedVendorPlan.price, selectedVendorPlan.discountPercentage).toFixed(2)}
                        {hasMultipleBillingOptions ? '/mo' : ''}
                      </div>
                      {hasMultipleBillingOptions && billingCycle === 'yearly' && (
                        <div className="text-sm text-gray-500">
                          {getCurrencySymbol(selectedVendorPlan.currency)}{(calculatePlanPrice(selectedVendorPlan.price, selectedVendorPlan.discountPercentage) * 12).toFixed(2)} billed annually
                        </div>
                      )}
                    </div>
                  </div>
                  {hasMultipleBillingOptions && billingCycle === 'yearly' && selectedVendorPlan.discountPercentage > 0 && (
                    <div className="mt-2 text-sm text-green-600 text-right">
                      You save {getCurrencySymbol(selectedVendorPlan.currency)}{(selectedVendorPlan.price * (isStreamingOrSocialProduct() ? 1 : userCount) * 12 * (selectedVendorPlan.discountPercentage / 100)).toFixed(2)} per year
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

