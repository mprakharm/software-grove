import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, X, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { CATEGORY_COUNTS } from '@/pages/Index';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ProductAPI } from '@/utils/api';
import { Product } from '@/utils/db';

interface NavigationProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Navigation = ({ searchQuery = '', onSearchChange }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, signOut, activeSubscriptions } = useAuth();
  
  const subscriptionCount = activeSubscriptions?.length || 0;

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (localSearchQuery.trim() === '') {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const products = await ProductAPI.getProducts({ 
          searchQuery: localSearchQuery 
        });
        setSearchResults(products.slice(0, 6));
        setShowResults(products.length > 0);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimeout);
  }, [localSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(localSearchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }
    setShowResults(false);
  };

  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleResultClick = (id: string) => {
    navigate(`/product/${id}`);
    setShowResults(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-semibold text-primary flex items-center">
              <span>Razorpay Nexus</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link to="/category/productivity" className="text-razorpay-gray hover:text-[#2950DA] transition-colors whitespace-nowrap text-sm lg:text-base">
                Productivity <span className="text-xs text-razorpay-gray">({CATEGORY_COUNTS.Productivity})</span>
              </Link>
              <Link to="/category/marketing" className="text-razorpay-gray hover:text-[#2950DA] transition-colors whitespace-nowrap text-sm lg:text-base">
                Marketing <span className="text-xs text-razorpay-gray">({CATEGORY_COUNTS.Marketing})</span>
              </Link>
              <Link to="/category/finance" className="text-razorpay-gray hover:text-[#2950DA] transition-colors whitespace-nowrap text-sm lg:text-base">
                Finance <span className="text-xs text-razorpay-gray">({CATEGORY_COUNTS.Finance})</span>
              </Link>
              <Link to="/category/support" className="text-razorpay-gray hover:text-[#2950DA] transition-colors whitespace-nowrap text-sm lg:text-base">
                Support <span className="text-xs text-razorpay-gray">({CATEGORY_COUNTS.Support})</span>
              </Link>
              <Link to="/category/communication" className="text-razorpay-gray hover:text-[#2950DA] transition-colors whitespace-nowrap text-sm lg:text-base">
                Communication <span className="text-xs text-razorpay-gray">({CATEGORY_COUNTS["Communication"]})</span>
              </Link>
              <Link to="/category/ai & automation" className="text-razorpay-gray hover:text-[#2950DA] transition-colors whitespace-nowrap text-sm lg:text-base">
                AI & Automation <span className="text-xs text-razorpay-gray">({CATEGORY_COUNTS["AI & Automation"]})</span>
              </Link>
              <Link to="/bundles" className="text-razorpay-gray hover:text-[#2950DA] transition-colors whitespace-nowrap text-sm lg:text-base font-medium">
                Bundles
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div ref={searchRef} className="hidden md:block relative w-64">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input 
                  type="search" 
                  placeholder="Search software..." 
                  className="pl-10 pr-8 bg-white/50"
                  value={localSearchQuery}
                  onChange={handleLocalSearchChange}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="h-4 w-4 text-razorpay-gray" />
                </button>
                {localSearchQuery && (
                  <button 
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-razorpay-gray" />
                  </button>
                )}
              </form>
              
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      Searching...
                    </div>
                  ) : (
                    <>
                      {searchResults.map((product) => (
                        <div 
                          key={product.id}
                          className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleResultClick(product.id)}
                        >
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded flex-shrink-0 mr-3" 
                              style={{ backgroundColor: product.color || '#aaaaaa' }}
                            />
                            <div>
                              <h4 className="font-medium text-sm">{product.name}</h4>
                              <p className="text-xs text-gray-500 truncate">{product.category}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {searchResults.length > 0 && (
                        <div className="p-2 text-center">
                          <button 
                            onClick={handleSearchSubmit}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            See all results
                          </button>
                        </div>
                      )}
                      {searchResults.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          No results found
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            
            {user ? (
              <>
                <Link to="/subscriptions" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                  <ShoppingCart className="h-5 w-5 text-razorpay-gray" />
                  {subscriptionCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-razorpay-blue text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {subscriptionCount}
                    </span>
                  )}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <User className="h-5 w-5 text-razorpay-gray" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/subscriptions">My Subscriptions</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account">Account Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
