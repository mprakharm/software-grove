
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
    image: "https://placehold.co/600x400/e4e4e7/ffffff?text=Google+Workspace",
    vendor: "Google",
    rating: 4.8,
    reviewCount: 2453,
  },
  {
    id: "notion",
    name: "Notion",
    description: "All-in-one workspace for notes, documents, wikis, projects, and collaboration.",
    category: "Productivity",
    price: "$8/mo",
    discount: "3%",
    image: "https://placehold.co/600x400/e4e4e7/ffffff?text=Notion",
    vendor: "Notion Labs",
    rating: 4.7,
    reviewCount: 1872,
  },
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Customer service software and support ticket system for better customer relationships.",
    category: "Support",
    price: "$49/mo",
    discount: "4%",
    image: "https://placehold.co/600x400/e4e4e7/ffffff?text=Zendesk",
    vendor: "Zendesk Inc.",
    rating: 4.5,
    reviewCount: 1564,
  },
];

export const CATEGORIES = [
  { name: "Productivity", count: 145 },
  { name: "Marketing", count: 89 },
  { name: "Finance", count: 67 },
  { name: "Support", count: 45 },
  { name: "HR", count: 34 },
  { name: "Sales", count: 56 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Essential Business Software at Exclusive Prices
              </h1>
              <p className="text-secondary text-lg mb-8">
                Discover and manage all your business software in one place, with guaranteed savings.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Input 
                  type="search" 
                  placeholder="Search for software (e.g., 'CRM', 'Accounting', 'Email')" 
                  className="pl-12 pr-4 h-12 text-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow text-center animate-fade-up transform transition-transform hover:-translate-y-1"
              >
                <h3 className="font-medium mb-1">{category.name}</h3>
                <span className="text-sm text-secondary">{category.count} apps</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Software */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8">Featured Software</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_SOFTWARE.map((software) => (
              <SoftwareCard key={software.id} {...software} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
