import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, X, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { CATEGORY_COUNTS, FEATURED_SOFTWARE } from '@/pages/Index';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Navigation = ({ searchQuery = '', onSearchChange }: NavigationProps) => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof FEATURED_SOFTWARE>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = FEATURED_SOFTWARE.filter(software => 
        software.name.toLowerCase().includes(query) || 
        software.description.toLowerCase().includes(query) || 
        software.category.toLowerCase().includes(query) ||
        software.vendor.toLowerCase().includes(query)
      ).slice(0, 6);
      
      setSearchResults(filtered);
      setShowResults(filtered.length > 0);
    }
  }, [searchQuery]);

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
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange('');
    }
    setShowResults(false);
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
                  value={searchQuery}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="h-4 w-4 text-razorpay-gray" />
                </button>
                {searchQuery && (
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
                  {searchResults.map((software) => (
                    <div 
                      key={software.id}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleResultClick(software.id)}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded flex-shrink-0 mr-3" 
                          style={{ backgroundColor: software.color }}
                        />
                        <div>
                          <h4 className="font-medium text-sm">{software.name}</h4>
                          <p className="text-xs text-gray-500 truncate">{software.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-2 text-center">
                    <button 
                      onClick={handleSearchSubmit}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      See all results
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {user ? (
              <>
                <Link to="/subscriptions" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                  <ShoppingCart className="h-5 w-5 text-razorpay-gray" />
                  <span className="absolute -top-1 -right-1 bg-razorpay-blue text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    2
                  </span>
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
