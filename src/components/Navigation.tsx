
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Search, 
  ShoppingCart, 
  Menu, 
  X,
  Grid,
  Table as TableIcon
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FEATURED_SOFTWARE } from '@/pages/Index';

interface NavigationProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  searchQuery = '', 
  onSearchChange = () => {} 
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update local state when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle clicks outside of search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current && 
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    onSearchChange(query);
    setShowSearchResults(query.length > 0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
    navigate(`/?search=${encodeURIComponent(localSearchQuery)}`);
    setShowSearchResults(false);
  };

  const handleSearchResultClick = (softwareId: string) => {
    navigate(`/product/${softwareId}`);
    setShowSearchResults(false);
  };

  const filteredSoftware = FEATURED_SOFTWARE.filter(software => 
    localSearchQuery && 
    (software.name.toLowerCase().includes(localSearchQuery.toLowerCase()) || 
     software.description.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
     software.category.toLowerCase().includes(localSearchQuery.toLowerCase()))
  ).slice(0, 5);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                SoftwareMarket
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <Grid className="h-4 w-4 mr-2" />
                Browse
              </Link>
              <Link
                to="/category/all"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Categories
              </Link>
              <Link
                to="/software-table"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <TableIcon className="h-4 w-4 mr-2" />
                All Software
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2">
            <div className="relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-md"
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => localSearchQuery && setShowSearchResults(true)}
                />
              </form>
              
              {/* Dropdown search results */}
              {showSearchResults && (
                <div 
                  ref={searchResultsRef}
                  className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {filteredSoftware.length > 0 ? (
                    <ul className="py-1">
                      {filteredSoftware.map((software) => (
                        <li 
                          key={software.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSearchResultClick(software.id)}
                        >
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-md flex items-center justify-center mr-3 text-white text-xs"
                              style={{ backgroundColor: software.color }}
                            >
                              {software.name.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium">{software.name}</div>
                              <div className="text-xs text-gray-500">{software.category}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>
            
            <Link to="/subscriptions">
              <Button variant="outline" size="icon" aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/account">
              <Button variant="outline" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-0.5 -mr-0.5">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="h-full flex flex-col">
                  <div className="pt-5 pb-6 px-5">
                    <div className="flex items-center justify-between mb-8">
                      <Link to="/" className="text-xl font-bold text-blue-600">
                        SoftwareMarket
                      </Link>
                      <SheetClose className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                        <span className="sr-only">Close menu</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </SheetClose>
                    </div>
                    <div className="mb-6">
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          placeholder="Search..."
                          className="pl-10 pr-4 py-2 border rounded-md w-full"
                          value={localSearchQuery}
                          onChange={handleSearchChange}
                        />
                      </form>
                    </div>
                    <div className="space-y-1">
                      <SheetClose asChild>
                        <Link
                          to="/"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                        >
                          <Grid className="h-4 w-4 mr-2 inline" />
                          Browse
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/category/all"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                        >
                          Categories
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/software-table"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                        >
                          <TableIcon className="h-4 w-4 mr-2 inline" />
                          All Software
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/subscriptions"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2 inline" />
                          Subscriptions
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/account"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                        >
                          <User className="h-4 w-4 mr-2 inline" />
                          Account
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
