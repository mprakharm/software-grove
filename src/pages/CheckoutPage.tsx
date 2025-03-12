
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import { FEATURED_SOFTWARE } from './Index';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CreditCard, 
  Building, 
  ArrowRight,
  Check,
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const { productId, planId } = useParams<{ productId: string; planId: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      label: product.name,
      href: `/product/${product.id}`,
    },
    {
      label: 'Checkout',
      href: `/checkout/${product.id}/${planId}`,
    },
  ];

  const handleSubmitOrder = () => {
    if (!acceptTerms) {
      toast({
        title: "Please accept the terms",
        description: "You must accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would submit the order to the server
    // For this prototype, we'll just navigate to the confirmation page
    navigate(`/confirmation/ORDER${Math.floor(Math.random() * 10000)}`);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            
            {/* Progress Steps */}
            <div className="flex justify-between mb-8">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {currentStep > 1 ? <Check className="h-4 w-4" /> : 1}
                </div>
                <div className="ml-2 font-medium">Review Order</div>
              </div>
              <div className="hidden sm:block border-t border-gray-300 flex-grow mx-4 mt-4"></div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {currentStep > 2 ? <Check className="h-4 w-4" /> : 2}
                </div>
                <div className="ml-2 font-medium">Payment</div>
              </div>
              <div className="hidden sm:block border-t border-gray-300 flex-grow mx-4 mt-4"></div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {currentStep > 3 ? <Check className="h-4 w-4" /> : 3}
                </div>
                <div className="ml-2 font-medium">Confirmation</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {currentStep === 1 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 bg-gray-200 rounded flex-shrink-0 mr-4">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="h-full w-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-500">{planId === 'basic' ? 'Basic' : planId === 'pro' ? 'Pro' : 'Enterprise'} Plan</p>
                          <p className="text-sm text-gray-500">Annual billing</p>
                        </div>
                      </div>
                      
                      <Accordion type="single" collapsible>
                        <AccordionItem value="details">
                          <AccordionTrigger>Plan Details</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Plan:</span>
                                <span>{planId === 'basic' ? 'Basic' : planId === 'pro' ? 'Pro' : 'Enterprise'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Billing Cycle:</span>
                                <span>Annual</span>
                              </div>
                              <div className="flex justify-between">
                                <span>User Licenses:</span>
                                <span>5</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>Price per user:</span>
                                <span>${planId === 'basic' ? '5' : planId === 'pro' ? '10' : '20'}/mo</span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => setCurrentStep(2)}>
                        Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {currentStep === 2 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'credit-card' ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                        <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
                          <RadioGroupItem value="credit-card" id="credit-card" className="mr-2" />
                          <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                          <span>Credit or Debit Card</span>
                        </Label>
                        
                        {paymentMethod === 'credit-card' && (
                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label htmlFor="card-name">Cardholder Name</Label>
                                <Input id="card-name" placeholder="John Smith" className="mt-1" />
                              </div>
                              <div>
                                <Label htmlFor="card-number">Card Number</Label>
                                <Input id="card-number" placeholder="•••• •••• •••• ••••" className="mt-1" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="expiry">Expiry Date</Label>
                                  <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                                </div>
                                <div>
                                  <Label htmlFor="cvc">CVC</Label>
                                  <Input id="cvc" placeholder="123" className="mt-1" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'bank-transfer' ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                        <Label htmlFor="bank-transfer" className="flex items-center cursor-pointer">
                          <RadioGroupItem value="bank-transfer" id="bank-transfer" className="mr-2" />
                          <Building className="h-5 w-5 mr-2 text-gray-600" />
                          <span>Bank Transfer</span>
                        </Label>
                        
                        {paymentMethod === 'bank-transfer' && (
                          <div className="mt-4 space-y-4">
                            <p className="text-sm text-gray-600">
                              We'll provide bank transfer details on the next screen. Your subscription will be activated once payment is confirmed.
                            </p>
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                    
                    <div className="mt-6">
                      <div className="flex items-start space-x-2 mb-4">
                        <Checkbox 
                          id="terms" 
                          checked={acceptTerms} 
                          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} 
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I accept the terms and conditions
                          </label>
                          <p className="text-sm text-gray-500">
                            I authorize SaaS Market to charge my payment method on a recurring basis.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
                        Back
                      </Button>
                      <Button onClick={handleSubmitOrder}>
                        Complete Purchase
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{planId?.charAt(0).toUpperCase() + planId?.slice(1)} Plan</span>
                      <span>${planId === 'basic' ? '300' : planId === 'pro' ? '600' : '1,200'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform discount</span>
                      <span className="text-green-600">-${planId === 'basic' ? '15' : planId === 'pro' ? '30' : '60'}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between font-medium">
                      <span>Annual Total</span>
                      <span>${planId === 'basic' ? '285' : planId === 'pro' ? '570' : '1,140'}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ${planId === 'basic' ? '23.75' : planId === 'pro' ? '47.50' : '95'}/mo, billed annually
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-4">
                    <p className="mb-2">Your subscription includes:</p>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>14-day free trial</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Cancel anytime</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Dedicated support</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
