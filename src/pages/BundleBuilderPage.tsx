
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { 
  Package, Plus, Check, Search, Filter, ShoppingBag, 
  ArrowLeft, ChevronRight, AlertCircle, X, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { FEATURED_SOFTWARE } from '@/pages/Index';
import { toast } from 'sonner';

// Business types for recommendations
const BUSINESS_TYPES = [
  { id: 'startup', name: 'Startup', icon: Sparkles },
  { id: 'smb', name: 'Small Business', icon: ShoppingBag },
  { id: 'agency', name: 'Agency', icon: Package },
  { id: 'enterprise', name: 'Enterprise', icon: Package },
];

// Recommended starter bundles based on business type
const STARTER_BUNDLES = {
  startup: [
    'google-workspace', 'notion', 'canva', 'slack', 'figma'
  ],
  smb: [
    'o365', 'quickbooks', 'mailchimp', 'zendesk', 'canva'
  ],
  agency: [
    'asana', 'figma', 'slack', 'ahrefs', 'mailchimp'
  ],
  enterprise: [
    'o365', 'jira', 'teams', 'ahrefs', 'intercom'
  ]
};

// Product categories
const PRODUCT_CATEGORIES = [
  'All', 'Productivity', 'Marketing', 'Finance', 'Support', 'Communication', 'AI & Automation'
];

// Calculate base discount percentage based on number of products
const calculateDiscountPercentage = (numProducts: number) => {
  if (numProducts >= 7) return 30;
  if (numProducts >= 5) return 25;
  if (numProducts >= 3) return 20;
  if (numProducts >= 2) return 15;
  return 0;
};

const BundleBuilderPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBusinessType, setSelectedBusinessType] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bundleName, setBundleName] = useState('My Custom Bundle');
  
  // Filter products based on search and category
  const filteredProducts = FEATURED_SOFTWARE.filter(product => {
    const matchesSearch = searchQuery.trim() === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
      product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle searching
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already filtered above
  };
  
  // Handle selecting a product
  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  
  // Handle selecting a business type
  const selectBusinessType = (typeId: string) => {
    setSelectedBusinessType(typeId);
    setSelectedProducts(STARTER_BUNDLES[typeId as keyof typeof STARTER_BUNDLES]);
    toast.success(`${typeId.charAt(0).toUpperCase() + typeId.slice(1)} bundle template applied`);
  };
  
  // Handle clearing the selection
  const clearSelection = () => {
    setSelectedProducts([]);
    setSelectedBusinessType(null);
    setBundleName('My Custom Bundle');
    toast.info("Selection cleared");
  };
  
  // Calculate bundle metrics
  const selectedProductsData = FEATURED_SOFTWARE.filter(p => selectedProducts.includes(p.id));
  const discountPercentage = calculateDiscountPercentage(selectedProducts.length);
  
  const totalRegularPrice = selectedProductsData.reduce((total, product) => {
    // Extract numeric value from price string
    const priceStr = product.price.replace(/[^\d.]/g, '');
    const price = parseFloat(priceStr);
    return isNaN(price) ? total : total + price;
  }, 0);
  
  const totalBundlePrice = totalRegularPrice * (1 - (discountPercentage / 100));
  const totalSavings = totalRegularPrice - totalBundlePrice;
  
  // Handle creating the bundle
  const createBundle = () => {
    if (selectedProducts.length < 2) {
      toast.error("Please select at least 2 products for your bundle");
      return;
    }
    
    toast.success("Custom bundle created!");
    navigate('/subscriptions');
  };
  
  // Get compatible product recommendations
  const getCompatibleProducts = () => {
    if (selectedProducts.length === 0) return [];
    
    // Get categories of selected products
    const selectedCategories = new Set(
      selectedProductsData.map(p => p.category)
    );
    
    // Find products in complementary categories that aren't already selected
    return FEATURED_SOFTWARE
      .filter(p => !selectedProducts.includes(p.id) && !selectedCategories.has(p.category))
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 3); // Take 3 random recommendations
  };
  
  const compatibleRecommendations = getCompatibleProducts();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/bundles" className="hover:text-gray-800 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Bundles
          </a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-medium">Bundle Builder</span>
        </div>
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Custom Bundle</h1>
          <p className="text-lg text-gray-600">
            Build a personalized software bundle that fits your needs and save up to 30%
          </p>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Selection */}
          <div className="lg:col-span-2">
            {/* Business Type Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Start with a template</h2>
              <p className="text-gray-600 mb-4">
                Choose a business type to start with a recommended template or build from scratch
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {BUSINESS_TYPES.map(type => (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-all hover:border-blue-400 ${
                      selectedBusinessType === type.id ? 'border-blue-400 bg-blue-50' : ''
                    }`}
                    onClick={() => selectBusinessType(type.id)}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <type.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-500">template</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Product Filtering */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold">Select software for your bundle</h2>
                
                <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                  <Input
                    type="search"
                    placeholder="Search software..."
                    className="pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </form>
              </div>
              
              <Tabs defaultValue="All" className="mb-6">
                <TabsList className="mb-4 flex flex-wrap h-auto">
                  {PRODUCT_CATEGORIES.map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {filteredProducts.map(product => {
                const isSelected = selectedProducts.includes(product.id);
                
                return (
                  <div 
                    key={product.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                      isSelected ? 'border-blue-400 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                    onClick={() => toggleProductSelection(product.id)}
                  >
                    <div className="absolute right-3 top-3">
                      {isSelected ? (
                        <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <Plus className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start">
                      <div 
                        className="h-10 w-10 rounded flex-shrink-0 mr-3" 
                        style={{ backgroundColor: product.color }}
                      ></div>
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="flex items-center gap-2 my-1">
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{product.price}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Recommendations */}
            {compatibleRecommendations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Recommended additions</h3>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Based on your selection, these products would be great additions to your bundle.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {compatibleRecommendations.map(product => (
                    <div 
                      key={product.id}
                      className="border rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
                      onClick={() => toggleProductSelection(product.id)}
                    >
                      <div className="flex items-center mb-2">
                        <div 
                          className="h-8 w-8 rounded flex-shrink-0 mr-2" 
                          style={{ backgroundColor: product.color }}
                        ></div>
                        <h3 className="font-medium text-sm">{product.name}</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        <span className="text-xs font-medium">{product.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Bundle Summary */}
          <div>
            <div className="sticky top-24">
              <Card className="border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Bundle</h2>
                    {selectedProducts.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-gray-500"
                        onClick={clearSelection}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  
                  {/* Bundle Name Input */}
                  <div className="mb-6">
                    <Input
                      value={bundleName}
                      onChange={(e) => setBundleName(e.target.value)}
                      className="font-medium"
                      placeholder="Enter a name for your bundle"
                    />
                  </div>
                  
                  {selectedProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-3">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-2">No products selected yet</p>
                      <p className="text-sm text-gray-400">Select at least 2 products to create a bundle</p>
                    </div>
                  ) : (
                    <>
                      {/* Selected Products */}
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-2">Selected Products ({selectedProducts.length})</div>
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                          {selectedProductsData.map(product => (
                            <div key={product.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div 
                                  className="h-6 w-6 rounded flex-shrink-0 mr-2" 
                                  style={{ backgroundColor: product.color }}
                                ></div>
                                <span className="text-sm">{product.name}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleProductSelection(product.id);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Discount Tier */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Bundle Discount</span>
                          <span className="font-medium">{discountPercentage}%</span>
                        </div>
                        <Progress value={discountPercentage} max={30} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>2+ products (15%)</span>
                          <span>5+ products (25%)</span>
                          <span>7+ products (30%)</span>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      {/* Price Summary */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span>Regular Price (per month)</span>
                          <span>${totalRegularPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Bundle Discount ({discountPercentage}%)</span>
                          <span>-${totalSavings.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Bundle Price (per month)</span>
                          <span>${totalBundlePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Annual Price (10% additional discount)</span>
                          <span>${(totalBundlePrice * 12 * 0.9).toFixed(2)}/year</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={selectedProducts.length < 2}
                    onClick={createBundle}
                  >
                    Create Bundle
                  </Button>
                  
                  {selectedProducts.length < 2 && (
                    <div className="mt-3 text-center text-xs text-gray-500">
                      <AlertCircle className="h-3 w-3 inline mr-1" />
                      Select at least 2 products to create a bundle
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BundleBuilderPage;
