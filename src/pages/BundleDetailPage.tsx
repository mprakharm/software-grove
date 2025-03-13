
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Layers, Check, AlertCircle, Edit, Clock, ArrowLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { BUNDLES, getBundleMetrics, getBundleProductsInfo } from '@/data/bundlesData';
import { FEATURED_SOFTWARE } from '@/pages/Index';
import { toast } from 'sonner';

const BundleDetailPage = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const [customizationMode, setCustomizationMode] = useState(false);
  
  // Find the bundle by ID
  const bundle = BUNDLES.find(b => b.id === bundleId);
  
  // If bundle not found, redirect to bundles page
  if (!bundle) {
    navigate('/bundles');
    return null;
  }
  
  // Get bundle metrics for display
  const metrics = getBundleMetrics(bundle);
  const bundleProducts = getBundleProductsInfo(bundle);
  
  // Calculate monthly and annual costs
  const monthlyPrice = metrics.bundlePrice;
  const annualPrice = monthlyPrice * 12 * 0.9; // 10% additional discount for annual
  
  // Selected software (for customization mode)
  const [selectedProducts, setSelectedProducts] = useState(
    bundle.products.map(p => p.productId)
  );
  
  // Handle adding/removing products from the bundle
  const toggleProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      // Check if it's a required product
      if (bundle.requiredProductIds?.includes(productId)) {
        toast.error("This product cannot be removed from the bundle");
        return;
      }
      
      // Check minimum products constraint
      if (selectedProducts.length <= (bundle.minProducts || 2)) {
        toast.error(`Bundle must contain at least ${bundle.minProducts || 2} products`);
        return;
      }
      
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      // Check maximum products constraint
      if (selectedProducts.length >= (bundle.maxProducts || 6)) {
        toast.error(`Bundle cannot contain more than ${bundle.maxProducts || 6} products`);
        return;
      }
      
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  
  // Calculate custom bundle metrics
  const customBundleProducts = bundle.products.filter(p => 
    selectedProducts.includes(p.productId)
  );
  
  const customMetrics = {
    individualPrice: customBundleProducts.reduce((total, p) => total + p.individualPrice, 0),
    bundlePrice: customBundleProducts.reduce((total, p) => total + p.bundlePrice, 0),
    totalProducts: customBundleProducts.length,
    savingsPercentage: bundle.savings,
    savingsAmount: customBundleProducts.reduce((total, p) => total + (p.individualPrice - p.bundlePrice), 0)
  };
  
  // Handle subscription purchase
  const handleSubscribe = () => {
    // In a real app, this would create a cart item or redirect to checkout
    toast.success("Bundle added to your cart");
    navigate('/subscriptions');
  };
  
  // Recommended bundles (other bundles in the same category)
  const recommendedBundles = BUNDLES
    .filter(b => b.category === bundle.category && b.id !== bundle.id)
    .slice(0, 3);
  
  // Format the expiry date
  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/bundles" className="hover:text-gray-800 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Bundles
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-medium">{bundle.name}</span>
        </div>
        
        {/* Bundle Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-blue-100 text-blue-800 font-normal hover:bg-blue-100">
                {bundle.category}
              </Badge>
              
              {bundle.isLimitedTime && (
                <Badge className="bg-red-100 text-red-800 font-normal hover:bg-red-100 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Limited Offer until {formatExpiryDate(bundle.expiryDate)}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: bundle.color }}
              >
                <Layers className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">{bundle.name}</h1>
            </div>
            
            <p className="text-lg text-gray-600 mb-6">{bundle.description}</p>
            
            <div className="flex flex-wrap gap-3 items-center mb-4">
              <div className="flex items-center text-sm font-medium">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                {metrics.totalProducts} Products Included
              </div>
              <div className="flex items-center text-sm font-medium">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                Save {metrics.savingsPercentage}% vs. Individual Purchase
              </div>
              <div className="flex items-center text-sm font-medium">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                {bundle.isCustomizable ? 'Customizable Bundle' : 'Curated Selection'}
              </div>
            </div>
            
            {/* Target user info */}
            <div className="bg-blue-50 p-4 rounded-lg inline-flex items-start mb-6">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">Recommended for:</span> {bundle.targetUser}
              </div>
            </div>
          </div>
          
          {/* Pricing Card */}
          <div>
            <Card className="border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-1">Bundle Price</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold">${customizationMode ? customMetrics.bundlePrice.toFixed(2) : monthlyPrice.toFixed(2)}</div>
                    <div className="text-gray-500 mb-1">/month</div>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="text-sm text-gray-500 line-through mr-2">
                      ${customizationMode ? customMetrics.individualPrice.toFixed(2) : metrics.individualPrice.toFixed(2)}/mo
                    </div>
                    <Badge className="bg-green-100 text-green-800 font-medium hover:bg-green-100">
                      SAVE {customizationMode ? customMetrics.savingsPercentage : metrics.savingsPercentage}%
                    </Badge>
                  </div>
                </div>
                
                <Tabs defaultValue="monthly" className="mb-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
                    <TabsTrigger value="annual" className="flex-1">Annual (Save 10%)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="monthly">
                    <div className="text-sm text-gray-500 mt-4 mb-2">
                      Monthly billing, cancel anytime
                    </div>
                  </TabsContent>
                  <TabsContent value="annual">
                    <div className="mt-4 mb-2">
                      <div className="text-sm text-gray-500">Annual Price</div>
                      <div className="flex items-end gap-2">
                        <div className="text-xl font-bold">${(customizationMode ? customMetrics.bundlePrice * 12 * 0.9 : annualPrice).toFixed(2)}</div>
                        <div className="text-gray-500 mb-0.5">/year</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        That's just ${(customizationMode ? (customMetrics.bundlePrice * 0.9) : (annualPrice / 12)).toFixed(2)}/month
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Products Included</span>
                    <span>{customizationMode ? customMetrics.totalProducts : metrics.totalProducts}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Savings</span>
                    <span>${customizationMode ? customMetrics.savingsAmount.toFixed(2) : metrics.savingsAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Annual Savings</span>
                    <span>${customizationMode ? (customMetrics.savingsAmount * 12 + customMetrics.bundlePrice * 12 * 0.1).toFixed(2) : (metrics.savingsAmount * 12 + monthlyPrice * 12 * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Value</span>
                    <span>${customizationMode ? customMetrics.individualPrice.toFixed(2) : metrics.individualPrice.toFixed(2)}/mo</span>
                  </div>
                </div>
                
                {bundle.isCustomizable && (
                  <Button 
                    variant="outline" 
                    className="w-full mb-3"
                    onClick={() => setCustomizationMode(!customizationMode)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {customizationMode ? 'Cancel Customization' : 'Customize Bundle'}
                  </Button>
                )}
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSubscribe}
                >
                  Subscribe to Bundle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Product List */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Included Software</h2>
          
          {customizationMode ? (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">Customization Mode</div>
                  <p className="text-sm text-gray-600">
                    Click on products to add or remove them from your bundle. 
                    Bundle must contain at least {bundle.minProducts || 2} products and 
                    can have up to {bundle.maxProducts || 6} products.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 gap-4">
            {(customizationMode ? FEATURED_SOFTWARE : bundleProducts.map(bp => FEATURED_SOFTWARE.find(p => p.id === bp.productId))).map(product => {
              if (!product) return null;
              
              const bundleProduct = bundle.products.find(bp => bp.productId === product.id);
              const isSelected = customizationMode ? selectedProducts.includes(product.id) : true;
              const isRequired = bundle.requiredProductIds?.includes(product.id);
              
              return (
                <div 
                  key={product.id}
                  className={`relative border rounded-lg p-4 ${
                    customizationMode 
                      ? isSelected 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-200' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => customizationMode && toggleProduct(product.id)}
                  style={{ cursor: customizationMode ? 'pointer' : 'default' }}
                >
                  {customizationMode && (
                    <div className="absolute right-4 top-4">
                      {isSelected ? (
                        <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Minus className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <Plus className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <div 
                      className="h-12 w-12 rounded mr-4 flex-shrink-0"
                      style={{ backgroundColor: product.color }}
                    ></div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        {isRequired && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Required</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                      
                      {isSelected && (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">Regular price:</span>
                            <span className="line-through">{bundleProduct?.individualPrice ? `$${bundleProduct.individualPrice.toFixed(2)}/mo` : product.price}</span>
                          </div>
                          <div className="flex items-center font-medium">
                            <span className="text-gray-500 mr-2">Bundle price:</span>
                            <span className="text-blue-600">${bundleProduct?.bundlePrice.toFixed(2)}/mo</span>
                          </div>
                          <div className="flex items-center">
                            <Badge className="bg-green-100 text-green-800 font-normal hover:bg-green-100">
                              SAVE {bundleProduct ? Math.round(((bundleProduct.individualPrice - bundleProduct.bundlePrice) / bundleProduct.individualPrice) * 100) : product.discount}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do software bundles work?</AccordionTrigger>
              <AccordionContent>
                Software bundles combine multiple complementary software products at a discounted rate. 
                When you subscribe to a bundle, you get access to all included software with a single 
                subscription payment, saving you money compared to purchasing each product individually.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I customize my bundle?</AccordionTrigger>
              <AccordionContent>
                {bundle.isCustomizable 
                  ? "Yes! This bundle is customizable. You can add or remove products within the constraints specified for the bundle. Some products may be required and cannot be removed."
                  : "This particular bundle is not customizable. It's a curated selection of software designed to work together. However, we offer other bundles that allow customization."}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How are the discounts calculated?</AccordionTrigger>
              <AccordionContent>
                Bundle discounts are calculated based on the regular price of each included product. 
                The larger the bundle, the bigger the discount percentage. Additionally, annual 
                subscriptions receive an extra 10% discount compared to monthly billing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I add more products to my bundle later?</AccordionTrigger>
              <AccordionContent>
                Yes, you can modify your bundle after subscribing by adding or removing products 
                within the allowed range. Your subscription price will be adjusted accordingly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What happens if I want to cancel my bundle subscription?</AccordionTrigger>
              <AccordionContent>
                You can cancel your bundle subscription at any time. Your access to the bundled 
                software will continue until the end of your current billing period. There are no 
                cancellation fees or hidden charges.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {/* Recommended Bundles */}
        {recommendedBundles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Similar Bundles You Might Like</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedBundles.map(recBundle => {
                const recMetrics = getBundleMetrics(recBundle);
                
                return (
                  <Link 
                    key={recBundle.id} 
                    to={`/bundles/${recBundle.id}`} 
                    className="block border rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="h-8 w-8 rounded flex items-center justify-center"
                        style={{ backgroundColor: recBundle.color }}
                      >
                        <Layers className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-medium">{recBundle.name}</h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recBundle.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">${recMetrics.bundlePrice.toFixed(2)}/mo</div>
                        <div className="text-xs text-gray-500">{recMetrics.totalProducts} products</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 font-normal hover:bg-green-100">
                        {recMetrics.savingsPercentage}% OFF
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BundleDetailPage;
