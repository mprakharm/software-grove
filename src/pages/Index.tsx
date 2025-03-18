import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import SoftwareCard from '@/components/SoftwareCard';
import { Percent, ListChecks, XCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductAPI } from '@/utils/api';
import { Product } from '@/utils/db';

// Software data with balanced categories (5-10 per category)
export const FEATURED_SOFTWARE = [
  // Productivity Category (8 apps)
  {
    id: "google-workspace",
    name: "Google Workspace",
    description: "Business email, calendar, meeting tools and more - everything you need to get work done.",
    category: "Productivity",
    price: "$6/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/2D88FF/ffffff?text=Google+Workspace",
    vendor: "Google",
    rating: 4.8,
    reviewCount: 2453,
    color: "#2D88FF"
  },
  {
    id: "notion",
    name: "Notion",
    description: "All-in-one workspace for notes, documents, wikis, projects, and collaboration.",
    category: "Productivity",
    price: "$8/mo",
    discount: "3%",
    image: "https://placehold.co/600x400/000000/ffffff?text=Notion",
    vendor: "Notion Labs",
    rating: 4.7,
    reviewCount: 1872,
    color: "#000000"
  },
  {
    id: "asana",
    name: "Asana",
    description: "Project management tool that helps teams organize, track, and manage their work.",
    category: "Productivity",
    price: "$10.99/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/F06A6A/ffffff?text=Asana",
    vendor: "Asana, Inc.",
    rating: 4.5,
    reviewCount: 2890,
    color: "#F06A6A"
  },
  {
    id: "jira",
    name: "Jira",
    description: "Issue and project tracking software for agile teams and software development.",
    category: "Productivity",
    price: "$7.75/mo",
    discount: "6%",
    image: "https://placehold.co/600x400/0052CC/ffffff?text=Jira",
    vendor: "Atlassian",
    rating: 4.5,
    reviewCount: 3420,
    color: "#0052CC"
  },
  {
    id: "o365",
    name: "Microsoft 365",
    description: "Productivity suite including Word, Excel, PowerPoint, and cloud services.",
    category: "Productivity",
    price: "$6/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/D83B01/ffffff?text=Microsoft+365",
    vendor: "Microsoft",
    rating: 4.6,
    reviewCount: 4350,
    color: "#D83B01"
  },
  {
    id: "slack",
    name: "Slack",
    description: "Business communication platform offering teams of all sizes message-based collaboration.",
    category: "Productivity",
    price: "$6.67/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/4A154B/ffffff?text=Slack",
    vendor: "Salesforce",
    rating: 4.7,
    reviewCount: 5670,
    color: "#4A154B"
  },
  {
    id: "figma",
    name: "Figma",
    description: "Collaborative interface design tool that enables team-based UI/UX design.",
    category: "Productivity",
    price: "$12/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/0ACF83/ffffff?text=Figma",
    vendor: "Figma, Inc.",
    rating: 4.8,
    reviewCount: 3240,
    color: "#0ACF83"
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Cloud storage service for file sharing and collaboration across devices.",
    category: "Productivity",
    price: "$9.99/mo",
    discount: "6%",
    image: "https://placehold.co/600x400/0061FF/ffffff?text=Dropbox",
    vendor: "Dropbox, Inc.",
    rating: 4.6,
    reviewCount: 3180,
    color: "#0061FF"
  },
  
  // Marketing Category (8 apps)
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM platform with marketing, sales, service, and operations tools.",
    category: "Marketing",
    price: "$45/mo",
    discount: "12%",
    image: "https://placehold.co/600x400/FF7A59/ffffff?text=HubSpot",
    vendor: "HubSpot, Inc.",
    rating: 4.6,
    reviewCount: 3470,
    color: "#FF7A59"
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Marketing automation platform and email marketing service for managing mailing lists.",
    category: "Marketing",
    price: "$14.99/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/FFE01B/000000?text=Mailchimp",
    vendor: "Intuit",
    rating: 4.4,
    reviewCount: 2980,
    color: "#FFE01B"
  },
  {
    id: "semrush",
    name: "SEMrush",
    description: "SEO tools, keyword research, competitor analysis, and marketing insights.",
    category: "Marketing",
    price: "$119.95/mo",
    discount: "15%",
    image: "https://placehold.co/600x400/FF642D/ffffff?text=SEMrush",
    vendor: "SEMrush",
    rating: 4.5,
    reviewCount: 1890,
    color: "#FF642D"
  },
  {
    id: "ahrefs",
    name: "Ahrefs",
    description: "SEO tools to grow search traffic, research competitors, and monitor your niche.",
    category: "Marketing",
    price: "$99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/0095FF/ffffff?text=Ahrefs",
    vendor: "Ahrefs",
    rating: 4.7,
    reviewCount: 1790,
    color: "#0095FF"
  },
  {
    id: "hootsuite",
    name: "Hootsuite",
    description: "Social media management platform for scheduling posts and tracking performance.",
    category: "Marketing",
    price: "$49/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/143059/ffffff?text=Hootsuite",
    vendor: "Hootsuite Inc.",
    rating: 4.3,
    reviewCount: 2450,
    color: "#143059"
  },
  {
    id: "canva",
    name: "Canva",
    description: "Graphic design platform for creating social media graphics, presentations, and other visual content.",
    category: "Marketing",
    price: "$12.99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/00C4CC/ffffff?text=Canva",
    vendor: "Canva",
    rating: 4.7,
    reviewCount: 4350,
    color: "#00C4CC"
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Web analytics service that tracks and reports website traffic for digital marketing.",
    category: "Marketing",
    price: "$0/mo",
    discount: "0%",
    image: "https://placehold.co/600x400/F9AB00/ffffff?text=Google+Analytics",
    vendor: "Google",
    rating: 4.7,
    reviewCount: 5840,
    color: "#F9AB00"
  },
  {
    id: "convertkit",
    name: "ConvertKit",
    description: "Email marketing platform designed for creators and content publishers.",
    category: "Marketing",
    price: "$29/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/FB6970/ffffff?text=ConvertKit",
    vendor: "ConvertKit",
    rating: 4.5,
    reviewCount: 1450,
    color: "#FB6970"
  },
  
  // Finance Category (8 apps)
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Accounting software for managing expenses, invoices, and financial reporting.",
    category: "Finance",
    price: "$25/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/2CA01C/ffffff?text=QuickBooks",
    vendor: "Intuit",
    rating: 4.3,
    reviewCount: 1830,
    color: "#2CA01C"
  },
  {
    id: "xero",
    name: "Xero",
    description: "Cloud-based accounting software for small and medium-sized businesses.",
    category: "Finance",
    price: "$22/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/13B5EA/ffffff?text=Xero",
    vendor: "Xero Limited",
    rating: 4.5,
    reviewCount: 2450,
    color: "#13B5EA"
  },
  {
    id: "freshbooks",
    name: "FreshBooks",
    description: "Cloud accounting software designed for small business owners and freelancers.",
    category: "Finance",
    price: "$15/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/0075DD/ffffff?text=FreshBooks",
    vendor: "FreshBooks",
    rating: 4.6,
    reviewCount: 1980,
    color: "#0075DD"
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Online payment processing for internet businesses. API-first platform.",
    category: "Finance",
    price: "2.9% + $0.30",
    discount: "5%",
    image: "https://placehold.co/600x400/635BFF/ffffff?text=Stripe",
    vendor: "Stripe, Inc.",
    rating: 4.8,
    reviewCount: 3680,
    color: "#635BFF"
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Online payments system supporting money transfers and online payments.",
    category: "Finance",
    price: "2.9% + $0.30",
    discount: "0%",
    image: "https://placehold.co/600x400/003087/ffffff?text=PayPal",
    vendor: "PayPal Holdings, Inc.",
    rating: 4.5,
    reviewCount: 4750,
    color: "#003087"
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Payment gateway solution for businesses in India, with subscription management.",
    category: "Finance",
    price: "2.0% + ₹3",
    discount: "10%",
    image: "https://placehold.co/600x400/2D88FF/ffffff?text=Razorpay",
    vendor: "Razorpay",
    rating: 4.7,
    reviewCount: 2160,
    color: "#2D88FF"
  },
  {
    id: "chargebee",
    name: "Chargebee",
    description: "Subscription billing and revenue management platform for growing businesses.",
    category: "Finance",
    price: "$249/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/5C3BFE/ffffff?text=Chargebee",
    vendor: "Chargebee",
    rating: 4.6,
    reviewCount: 890,
    color: "#5C3BFE"
  },
  {
    id: "expensify",
    name: "Expensify",
    description: "Expense management that automates receipt scanning, reimbursement, and expense reporting.",
    category: "Finance",
    price: "$4.99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/1A237E/ffffff?text=Expensify",
    vendor: "Expensify, Inc.",
    rating: 4.4,
    reviewCount: 1890,
    color: "#1A237E"
  },
  
  // Support Category (7 apps)
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Customer service software and support ticketing system.",
    category: "Support",
    price: "$19/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/03363D/ffffff?text=Zendesk",
    vendor: "Zendesk",
    rating: 4.6,
    reviewCount: 3250,
    color: "#03363D"
  },
  {
    id: "freshdesk",
    name: "Freshdesk",
    description: "Cloud-based customer support software that helps streamline customer conversations.",
    category: "Support",
    price: "$15/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/FA5F35/ffffff?text=Freshdesk",
    vendor: "Freshworks",
    rating: 4.5,
    reviewCount: 2780,
    color: "#FA5F35"
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Customer messaging platform that allows businesses to communicate with customers.",
    category: "Support",
    price: "$39/mo",
    discount: "12%",
    image: "https://placehold.co/600x400/1F8DED/ffffff?text=Intercom",
    vendor: "Intercom",
    rating: 4.7,
    reviewCount: 2430,
    color: "#1F8DED"
  },
  {
    id: "helpscout",
    name: "Help Scout",
    description: "Help desk software that provides an email-based customer support platform.",
    category: "Support",
    price: "$20/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/1292EE/ffffff?text=Help+Scout",
    vendor: "Help Scout",
    rating: 4.6,
    reviewCount: 1850,
    color: "#1292EE"
  },
  {
    id: "livechat",
    name: "LiveChat",
    description: "Live chat and help desk software for customer service and online sales.",
    category: "Support",
    price: "$16/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/FF5100/ffffff?text=LiveChat",
    vendor: "LiveChat, Inc.",
    rating: 4.5,
    reviewCount: 2340,
    color: "#FF5100"
  },
  {
    id: "tidio",
    name: "Tidio",
    description: "Live chat solution that combines chatbots with live chat functionality.",
    category: "Support",
    price: "$18/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/0566FF/ffffff?text=Tidio",
    vendor: "Tidio Ltd.",
    rating: 4.4,
    reviewCount: 1780,
    color: "#0566FF"
  },
  {
    id: "gorgias",
    name: "Gorgias",
    description: "Helpdesk designed for e-commerce to manage customer inquiries across channels.",
    category: "Support",
    price: "$60/mo",
    discount: "15%",
    image: "https://placehold.co/600x400/2032FA/ffffff?text=Gorgias",
    vendor: "Gorgias",
    rating: 4.5,
    reviewCount: 1450,
    color: "#2032FA"
  },
  
  // Communication Category (7 apps)
  {
    id: "zoom",
    name: "Zoom",
    description: "Video conferencing and online meeting solution for businesses.",
    category: "Communication",
    price: "$14.99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/2D8CFF/ffffff?text=Zoom",
    vendor: "Zoom Video Communications",
    rating: 4.6,
    reviewCount: 4850,
    color: "#2D8CFF"
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Collaboration platform with chat, video meetings, file storage, and app integration.",
    category: "Communication",
    price: "$12.50/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/6264A7/ffffff?text=Microsoft+Teams",
    vendor: "Microsoft",
    rating: 4.5,
    reviewCount: 4250,
    color: "#6264A7"
  },
  {
    id: "discord",
    name: "Discord",
    description: "Voice, video, and text communication service for building communities.",
    category: "Communication",
    price: "$9.99/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/5865F2/ffffff?text=Discord",
    vendor: "Discord Inc.",
    rating: 4.7,
    reviewCount: 3650,
    color: "#5865F2"
  },
  {
    id: "telegram",
    name: "Telegram Business",
    description: "Messaging app with a focus on speed and security for business communications.",
    category: "Communication",
    price: "$8/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/0088CC/ffffff?text=Telegram",
    vendor: "Telegram FZ LLC",
    rating: 4.5,
    reviewCount: 2970,
    color: "#0088CC"
  },
  {
    id: "skype",
    name: "Skype for Business",
    description: "Communication tool for video meetings, chat, and file sharing.",
    category: "Communication",
    price: "$5/mo",
    discount: "3%",
    image: "https://placehold.co/600x400/00AFF0/ffffff?text=Skype",
    vendor: "Microsoft",
    rating: 4.3,
    reviewCount: 3860,
    color: "#00AFF0"
  },
  {
    id: "webex",
    name: "Webex",
    description: "Enterprise video conferencing, online meetings, screen share, and webinars.",
    category: "Communication",
    price: "$13.50/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/005073/ffffff?text=Webex",
    vendor: "Cisco",
    rating: 4.4,
    reviewCount: 2560,
    color: "#005073"
  },
  {
    id: "ringcentral",
    name: "RingCentral",
    description: "Cloud-based communications platform for voice, video meetings, and messaging.",
    category: "Communication",
    price: "$19.99/mo",
    discount: "12%",
    image: "https://placehold.co/600x400/F80049/ffffff?text=RingCentral",
    vendor: "RingCentral, Inc.",
    rating: 4.5,
    reviewCount: 2340,
    color: "#F80049"
  },
  
  // AI & Automation Category (8 apps)
  {
    id: "chatgpt",
    name: "ChatGPT for Business",
    description: "AI-powered chatbot platform for businesses to automate customer service.",
    category: "AI & Automation",
    price: "$20/mo",
    discount: "15%",
    image: "https://placehold.co/600x400/10A37F/ffffff?text=ChatGPT",
    vendor: "OpenAI",
    rating: 4.8,
    reviewCount: 4250,
    color: "#10A37F"
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automation tool that connects apps and automates workflows without coding.",
    category: "AI & Automation",
    price: "$19.99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/FF4A00/ffffff?text=Zapier",
    vendor: "Zapier, Inc.",
    rating: 4.7,
    reviewCount: 3560,
    color: "#FF4A00"
  },
  {
    id: "make",
    name: "Make",
    description: "Visual platform to design, build, and automate workflows across applications.",
    category: "AI & Automation",
    price: "$16/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/00A98F/ffffff?text=Make",
    vendor: "Make.com",
    rating: 4.6,
    reviewCount: 2140,
    color: "#00A98F"
  },
  {
    id: "jasper",
    name: "Jasper",
    description: "AI content creation platform for marketing copy, emails, and blog posts.",
    category: "AI & Automation",
    price: "$49/mo",
    discount: "12%",
    image: "https://placehold.co/600x400/FF7D46/ffffff?text=Jasper",
    vendor: "Jasper AI",
    rating: 4.5,
    reviewCount: 1950,
    color: "#FF7D46"
  },
  {
    id: "ifttt",
    name: "IFTTT",
    description: "Platform that connects apps, devices and services to trigger automated actions.",
    category: "AI & Automation",
    price: "$5/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/33CCFF/000000?text=IFTTT",
    vendor: "IFTTT",
    rating: 4.3,
    reviewCount: 2750,
    color: "#33CCFF"
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    description: "AI-powered copywriting tool that helps create marketing copy and content.",
    category: "AI & Automation",
    price: "$36/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/1F1F2C/ffffff?text=Copy.ai",
    vendor: "Copy.ai",
    rating: 4.6,
    reviewCount: 1760,
    color: "#1F1F2C"
  },
  {
    id: "n8n",
    name: "n8n",
    description: "Workflow automation tool for connecting apps and services with an extensible API.",
    category: "AI & Automation",
    price: "$20/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/FF6D00/ffffff?text=n8n",
    vendor: "n8n.io",
    rating: 4.4,
    reviewCount: 980,
    color: "#FF6D00"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "AI image generation tool that creates high-quality visuals from text descriptions.",
    category: "AI & Automation",
    price: "$24/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/1A1B1E/ffffff?text=Midjourney",
    vendor: "Midjourney, Inc.",
    rating: 4.7,
    reviewCount: 2340,
    color: "#1A1B1E"
  }
];

// Calculate actual category counts based on the software list
export const CATEGORY_COUNTS = {
  "Productivity": FEATURED_SOFTWARE.filter(s => s.category === "Productivity").length,
  "Marketing": FEATURED_SOFTWARE.filter(s => s.category === "Marketing").length,
  "Finance": FEATURED_SOFTWARE.filter(s => s.category === "Finance").length,
  "Support": FEATURED_SOFTWARE.filter(s => s.category === "Support").length,
  "Communication": FEATURED_SOFTWARE.filter(s => s.category === "Communication").length,
  "AI & Automation": FEATURED_SOFTWARE.filter(s => s.category === "AI & Automation").length,
};

// Home page component
const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filteredSoftware, setFilteredSoftware] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Load initial featured products
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setIsLoading(true);
      try {
        const products = await ProductAPI.getProducts();
        setFeaturedProducts(products.slice(0, 8)); // Show 8 featured products
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    // Update URL when search changes
    if (searchQuery) {
      searchParams.set('search', searchQuery);
      setSearchParams(searchParams);
    } else {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }

    // Search products from API
    const searchProducts = async () => {
      if (searchQuery.trim() === '') {
        setFilteredSoftware([]);
        return;
      }

      setIsLoading(true);
      try {
        const products = await ProductAPI.getProducts({ searchQuery });
        setFilteredSoftware(products);
      } catch (error) {
        console.error('Error searching products:', error);
        setFilteredSoftware([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [searchQuery, searchParams, setSearchParams]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleBannerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled in useEffect
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      
      {/* Imageon Banner Section with Circuit Board Pattern */}
      <div className="relative bg-blue-600 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Circuit Board Pattern Background */}
        <div className="absolute inset-0 opacity-15">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20,0 L20,100 M40,0 L40,100 M60,0 L60,100 M80,0 L80,100 M0,20 L100,20 M0,40 L100,40 M0,60 L100,60 M0,80 L100,80" 
                    stroke="white" strokeWidth="1" fill="none" />
              <circle cx="20" cy="20" r="3" fill="white" />
              <circle cx="60" cy="20" r="3" fill="white" />
              <circle cx="20" cy="60" r="3" fill="white" />
              <circle cx="60" cy="60" r="3" fill="white" />
              <circle cx="40" cy="40" r="3" fill="white" />
              <circle cx="80" cy="40" r="3" fill="white" />
              <circle cx="40" cy="80" r="3" fill="white" />
              <circle cx="80" cy="80" r="3" fill="white" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Find the Perfect Software <br className="hidden sm:block" />
            for Your Business
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
            Browse thousands of business applications across all categories.
            Save time and money with our exclusive subscription deals.
          </p>
          <div className="mt-10 max-w-xl mx-auto">
            <form onSubmit={handleBannerSearch} className="relative rounded-full shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                className="form-input block w-full pl-10 py-6 text-lg rounded-full"
                placeholder="Search for software, tools, and applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
      
      {/* Subscription Benefits - Moved to above Categories */}
      <div className="bg-gray-50 py-16 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Save with Software Subscriptions
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Get exclusive deals when subscribing through our platform. 
              Manage all your software subscriptions in one place.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <Percent className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Save up to 20%</h3>
              <p className="mt-2 text-base text-gray-600">
                Get exclusive discounts on software subscriptions not available elsewhere.
              </p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <ListChecks className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Centralized Management</h3>
              <p className="mt-2 text-base text-gray-600">
                Manage all your software subscriptions from a single dashboard.
              </p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <XCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Hassle-free Cancellation</h3>
              <p className="mt-2 text-base text-gray-600">
                Cancel any subscription with one click, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Buttons - Moved after Subscription Benefits */}
      <div className="container mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(CATEGORY_COUNTS).map(([category, count]) => (
            <Link key={category} to={`/category/${category.toLowerCase()}`} className="group">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center text-center">
                <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {count} apps
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Search Results or Featured Software */}
      <div className="container mx-auto mt-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Software"}
        </h2>
        
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        )}
        
        {!isLoading && filteredSoftware.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No software found matching your search criteria.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(searchQuery ? filteredSoftware : featuredProducts).map((product) => (
            <SoftwareCard 
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              category={product.category}
              price={typeof product.price === 'number' ? `$${product.price}` : (product.price?.toString() || '$0')}
              discount={product.discount || '0%'}
              image={product.image || product.logo || `https://placehold.co/600x400/aaaaaa/ffffff?text=${encodeURIComponent(product.name)}`}
              vendor={product.vendor || 'Vendor'}
              rating={product.rating || 4.5}
              reviewCount={product.reviewCount || product.reviews || 100}
              color={product.color || '#aaaaaa'}
            />
          ))}
        </div>
        
        {!searchQuery && (
          <div className="text-center mt-10">
            <Link 
              to="/category/all" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse All Software
            </Link>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-white mt-16 pt-12 pb-8 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Marketplace</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">About</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-500 text-center">
              &copy; 2023 Software Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
