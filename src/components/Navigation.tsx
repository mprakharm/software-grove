
import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-semibold text-primary">
              SaaS Market
            </a>
            <div className="hidden md:flex items-center space-x-6">
              <a href="/categories" className="text-secondary hover:text-primary transition-colors">
                Categories
              </a>
              <a href="/deals" className="text-secondary hover:text-primary transition-colors">
                Deals
              </a>
              <a href="/popular" className="text-secondary hover:text-primary transition-colors">
                Popular
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex relative w-64">
              <Input 
                type="search" 
                placeholder="Search software..." 
                className="pl-10 pr-4 bg-white/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="h-5 w-5 text-secondary" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="h-5 w-5 text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
