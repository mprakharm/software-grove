
import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CATEGORY_COUNTS } from '@/pages/Index';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-semibold text-primary flex items-center">
              <img src="https://placehold.co/30x30/2D88FF/ffffff?text=R" alt="Razorpay Logo" className="h-8 w-8 mr-2 rounded" />
              <span>Razorpay BizTools Nexus</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/category/productivity" className="text-razorpay-gray hover:text-razorpay-blue transition-colors">
                Productivity ({CATEGORY_COUNTS.Productivity})
              </Link>
              <Link to="/category/marketing" className="text-razorpay-gray hover:text-razorpay-blue transition-colors">
                Marketing ({CATEGORY_COUNTS.Marketing})
              </Link>
              <Link to="/category/finance" className="text-razorpay-gray hover:text-razorpay-blue transition-colors">
                Finance ({CATEGORY_COUNTS.Finance})
              </Link>
              <Link to="/category/support" className="text-razorpay-gray hover:text-razorpay-blue transition-colors">
                Support ({CATEGORY_COUNTS.Support})
              </Link>
              <Link to="/category/communication" className="text-razorpay-gray hover:text-razorpay-blue transition-colors">
                Communication ({CATEGORY_COUNTS["Communication"]})
              </Link>
              <Link to="/category/ai & automation" className="text-razorpay-gray hover:text-razorpay-blue transition-colors">
                AI & Automation ({CATEGORY_COUNTS["AI & Automation"]})
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex relative w-64">
              <Input 
                type="search" 
                placeholder="Search software..." 
                className="pl-10 pr-4 bg-white/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-razorpay-gray" />
            </div>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
