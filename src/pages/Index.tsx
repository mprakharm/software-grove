
import React from 'react';
import Navigation from '@/components/Navigation';
import SoftwareCard from '@/components/SoftwareCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

// Mock data for the application
export const FEATURED_SOFTWARE = [
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
    id: "zendesk",
    name: "Zendesk",
    description: "Customer service software and support ticket system for better customer relationships.",
    category: "Support",
    price: "$49/mo",
    discount: "4%",
    image: "https://placehold.co/600x400/03363D/ffffff?text=Zendesk",
    vendor: "Zendesk Inc.",
    rating: 4.5,
    reviewCount: 1564,
    color: "#03363D"
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Video conferencing, online meetings, and group messaging in one platform.",
    category: "Communication",
    price: "$14.99/mo",
    discount: "7%",
    image: "https://placehold.co/600x400/2D8CFF/ffffff?text=Zoom",
    vendor: "Zoom Video Communications",
    rating: 4.6,
    reviewCount: 3560,
    color: "#2D8CFF"
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
    id: "tally",
    name: "Tally",
    description: "Business management software for accounting, inventory management, and taxation.",
    category: "Finance",
    price: "$18/mo",
    discount: "4%",
    image: "https://placehold.co/600x400/262F91/ffffff?text=Tally",
    vendor: "Tally Solutions",
    rating: 4.2,
    reviewCount: 1240,
    color: "#262F91"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "AI-powered language model for generating human-like text and conversations.",
    category: "AI & Automation",
    price: "$20/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/10A37F/ffffff?text=ChatGPT",
    vendor: "OpenAI",
    rating: 4.9,
    reviewCount: 5230,
    color: "#10A37F"
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    description: "Answer engine that delivers comprehensive, accurate responses backed by sources.",
    category: "AI & Automation",
    price: "$20/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/5436DA/ffffff?text=Perplexity",
    vendor: "Perplexity Labs",
    rating: 4.7,
    reviewCount: 1840,
    color: "#5436DA"
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
    id: "zapier",
    name: "Zapier",
    description: "Automation tool that connects your apps and automates workflows without coding.",
    category: "Automation",
    price: "$19.99/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/FF4A00/ffffff?text=Zapier",
    vendor: "Zapier, Inc.",
    rating: 4.7,
    reviewCount: 2540,
    color: "#FF4A00"
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
  }
];

export const CATEGORIES = [
  { name: "Productivity", count: 145 },
  { name: "Marketing", count: 89 },
  { name: "Finance", count: 67 },
  { name: "Support", count: 45 },
  { name: "Communication", count: 52 },
  { name: "AI & Automation", count: 38 },
  { name: "Automation", count: 29 },
  { name: "HR", count: 34 },
  { name: "Sales", count: 56 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-razorpay-lightgray">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-razorpay-navy">
                Essential Business Software at Exclusive Prices
              </h1>
              <p className="text-razorpay-gray text-lg mb-8">
                Discover and manage all your business software in one place, with guaranteed savings.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Input 
                  type="search" 
                  placeholder="Search for software (e.g., 'CRM', 'Accounting', 'Email')" 
                  className="pl-12 pr-4 h-12 text-lg rounded-md border-razorpay-blue border-2 focus-visible:ring-razorpay-blue"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-razorpay-gray" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 text-razorpay-navy">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center animate-fade-up transform transition-transform hover:-translate-y-1 border-l-4 border-razorpay-blue"
              >
                <h3 className="font-medium mb-1 text-razorpay-navy">{category.name}</h3>
                <span className="text-sm text-razorpay-gray">{category.count} apps</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Software */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 text-razorpay-navy">Featured Software</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_SOFTWARE.slice(0, 6).map((software) => (
              <SoftwareCard key={software.id} {...software} />
            ))}
          </div>
          
          {/* Recently Added Software */}
          <h2 className="text-2xl font-semibold mb-8 mt-16 text-razorpay-navy">Recently Added</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_SOFTWARE.slice(6, 12).map((software) => (
              <SoftwareCard key={software.id} {...software} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
