
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SoftwareCard from '@/components/SoftwareCard';
import Breadcrumb from '@/components/Breadcrumb';
import { FEATURED_SOFTWARE } from './Index';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { initializeDatabase } from '@/utils/initializeDb';
import { toast } from '@/components/ui/use-toast';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [sortBy, setSortBy] = useState('popularity');
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      try {
        await initializeDatabase();
        toast({
          title: "Database Connected",
          description: "Supabase database schema has been initialized",
        });
      } catch (error) {
        console.error("Failed to initialize database:", error);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Failed to initialize Supabase database",
        });
      } finally {
        setIsInitializing(false);
      }
    };
    
    init();
  }, []);
  
  // Filter software by category
  const filteredSoftware = FEATURED_SOFTWARE.filter(
    software => software.category.toLowerCase() === categoryName?.toLowerCase()
  );

  // Function to format the category name for display
  const formatCategoryName = (name: string | undefined) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const breadcrumbItems = [
    {
      label: formatCategoryName(categoryName),
      href: `/category/${categoryName}`,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        {isInitializing && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md">
            Initializing database connection...
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">
            {formatCategoryName(categoryName)} Software
          </h1>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm text-secondary">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredSoftware.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSoftware.map((software) => (
              <SoftwareCard key={software.id} {...software} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No software found</h3>
            <p className="text-secondary">There are no products in this category yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
