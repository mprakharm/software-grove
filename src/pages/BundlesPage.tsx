
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import BundleCard from '@/components/BundleCard';
import { Link } from 'react-router-dom';
import { Layers, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BUNDLES, BUNDLE_CATEGORIES, filterBundlesByCategory } from '@/data/bundlesData';

const BundlesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const filteredBundles = filterBundlesByCategory(activeCategory).filter(bundle => 
    searchQuery.trim() === '' || 
    bundle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bundle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bundle.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already filtered above
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative bg-blue-600 rounded-2xl overflow-hidden mb-12">
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
          <div className="relative py-16 px-8 text-center text-white">
            <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-full mb-4">
              <Layers className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Software Bundles</h1>
            <p className="text-xl max-w-2xl mx-auto mb-6">
              Save up to 30% with curated software bundles designed for your specific business needs
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                <Link to="/bundles">Browse Bundles</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-blue-700" asChild>
                <Link to="/bundle-builder">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your Bundle
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Explore Bundles</h2>
            <p className="text-gray-600">Find the perfect software bundle for your business</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="relative min-w-[200px]">
              <Input
                type="search"
                placeholder="Search bundles..."
                className="pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-400" />
              </button>
            </form>
            <Button className="whitespace-nowrap" asChild>
              <Link to="/bundle-builder">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Bundle
              </Link>
            </Button>
          </div>
        </div>

        {/* Tabs for Categories */}
        <Tabs defaultValue="All" className="mb-8">
          <TabsList className="mb-6 flex flex-wrap h-auto">
            <TabsTrigger value="All" onClick={() => setActiveCategory('All')}>
              All Bundles
            </TabsTrigger>
            {BUNDLE_CATEGORIES.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredBundles.map(bundle => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
          
          {/* Custom Bundle Card */}
          <Link to="/bundle-builder" className="block transform transition-all duration-300 hover:-translate-y-1">
            <div className="h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 flex flex-col items-center justify-center p-8 text-center bg-gray-50 hover:bg-blue-50">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create Your Own Bundle</h3>
              <p className="text-gray-600 mb-4">
                Build a custom bundle with your favorite software and save more
              </p>
              <Button>Start Building</Button>
            </div>
          </Link>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Benefits of Bundles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Save Up to 30%</h3>
              <p className="text-gray-600">
                Get substantial discounts when you purchase software as part of a bundle
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Curated Solutions</h3>
              <p className="text-gray-600">
                Expertly selected combinations of software that work seamlessly together
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Flexibility</h3>
              <p className="text-gray-600">
                Customize your bundles by adding or removing products to fit your needs
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </Layout>
  );
};

export default BundlesPage;
