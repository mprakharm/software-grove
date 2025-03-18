
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import { PRODUCT_CONTENT } from '@/data/productContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import { ProductAPI } from '@/utils/api';
import { Product } from '@/utils/db';
import { toast } from '@/components/ui/use-toast';

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const productContent = productId ? PRODUCT_CONTENT[productId] : undefined;
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        // Modified to handle both UUID and string IDs
        const data = await ProductAPI.getProductByNameOrId(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
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
      label: product.category,
      href: `/category/${product.category.toLowerCase()}`,
    },
    {
      label: product.name,
      href: `/product/${product.id}`,
    },
  ];

  // Calculate original price before discount (using 10% as default discount)
  const discountPercentage = 10;
  const currentPrice = product.price;
  const originalPrice = Math.round(currentPrice / (1 - discountPercentage / 100));
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
              <img 
                src={product.logo} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
              <div className="grid grid-cols-4 gap-2 p-2">
                <img src={product.logo} alt="Screenshot 1" className="rounded border cursor-pointer hover:border-primary" />
                <img src={product.logo} alt="Screenshot 2" className="rounded border cursor-pointer hover:border-primary" />
                <img src={product.logo} alt="Screenshot 3" className="rounded border cursor-pointer hover:border-primary" />
                <img src={product.logo} alt="Screenshot 4" className="rounded border cursor-pointer hover:border-primary" />
              </div>
            </div>
          </div>
          
          {/* Right Column - Product Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
              <div className="mb-4">
                <Badge className="mb-2">{product.category}</Badge>
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <p className="text-sm text-gray-500 mb-2">by {product.name} Inc.</p>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{product.rating || 0} ({product.reviews || 0} reviews)</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-1">
                  <span className="text-3xl font-bold text-primary">${product.price}</span>
                  <span className="ml-2 text-sm line-through text-gray-500">${originalPrice}/mo</span>
                  <Badge className="ml-2 bg-green-500">10% OFF</Badge>
                </div>
                <p className="text-sm text-gray-600">per user/month, billed annually</p>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link to={`/subscription/${product.id}`}>Subscribe Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent space-x-8">
              <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Overview</TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Features</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Reviews</TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">About {product.name}</h2>
                {productContent ? (
                  <p className="text-gray-700 mb-4">{productContent.overview}</p>
                ) : (
                  <>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    <p className="text-gray-700 mb-4">
                      {product.featuredBenefit || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.'}
                    </p>
                    <p className="text-gray-700">
                      Suspendisse in orci enim. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
                    </p>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                {productContent && productContent.features ? (
                  <ul className="space-y-4">
                    {productContent.features.map((feature, index) => (
                      <li key={index} className="flex">
                        <span className="mr-2 text-primary">✓</span>
                        <div>
                          <h3 className="font-medium">{feature.name}</h3>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : product.benefits && product.benefits.length > 0 ? (
                  <ul className="space-y-4">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex">
                        <span className="mr-2 text-primary">✓</span>
                        <div>
                          <h3 className="font-medium">{benefit}</h3>
                          <p className="text-gray-600 text-sm">This premium feature helps improve your productivity.</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-4">
                    <li className="flex">
                      <span className="mr-2 text-primary">✓</span>
                      <div>
                        <h3 className="font-medium">Feature 1</h3>
                        <p className="text-gray-600 text-sm">Description of feature 1 and what it can do for your business.</p>
                      </div>
                    </li>
                    <li className="flex">
                      <span className="mr-2 text-primary">✓</span>
                      <div>
                        <h3 className="font-medium">Feature 2</h3>
                        <p className="text-gray-600 text-sm">Description of feature 2 and what it can do for your business.</p>
                      </div>
                    </li>
                    <li className="flex">
                      <span className="mr-2 text-primary">✓</span>
                      <div>
                        <h3 className="font-medium">Feature 3</h3>
                        <p className="text-gray-600 text-sm">Description of feature 3 and what it can do for your business.</p>
                      </div>
                    </li>
                    <li className="flex">
                      <span className="mr-2 text-primary">✓</span>
                      <div>
                        <h3 className="font-medium">Feature 4</h3>
                        <p className="text-gray-600 text-sm">Description of feature 4 and what it can do for your business.</p>
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Customer Reviews</h2>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{product.rating || 0} out of 5</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b pb-6 last:border-b-0">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">John D.</div>
                        <div className="text-sm text-gray-500">2 months ago</div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, j) => (
                          <StarIcon 
                            key={j} 
                            className={`w-4 h-4 ${j < 4 + Math.floor(Math.random() * 2) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">How does the billing work?</h3>
                    <p className="text-gray-700">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Can I cancel at any time?</h3>
                    <p className="text-gray-700">
                      Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Is there a free trial?</h3>
                    <p className="text-gray-700">
                      Most plans come with a 14-day free trial. No credit card required to start your trial.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">What payment methods do you accept?</h3>
                    <p className="text-gray-700">
                      We accept all major credit cards, bank transfers, and various digital payment methods.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
