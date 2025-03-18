
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SoftwareCard from '@/components/SoftwareCard';
import Breadcrumb from '@/components/Breadcrumb';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { initializeDatabase } from '@/utils/initializeDb';
import { toast } from '@/components/ui/use-toast';
import { ProductAPI } from '@/utils/api';
import { Product } from '@/utils/db';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [sortBy, setSortBy] = useState('popularity');
  const [isInitializing, setIsInitializing] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      try {
        const success = await initializeDatabase();
        if (success) {
          toast({
            title: "Database Connected",
            description: "Successfully connected to Supabase database",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Database Configuration Needed",
            description: "Please create the required tables in your Supabase dashboard",
          });
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Failed to connect to Supabase database",
        });
      } finally {
        setIsInitializing(false);
      }
    };
    
    init();
  }, []);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch products filtered by category if categoryName is provided
        const filters = categoryName && categoryName !== 'all' ? { category: formatCategoryName(categoryName) } : undefined;
        const data = await ProductAPI.getProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load products",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryName]);

  // Function to format the category name for display
  const formatCategoryName = (name: string | undefined) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const breadcrumbItems = [
    {
      label: categoryName === 'all' ? 'All Software' : formatCategoryName(categoryName),
      href: `/category/${categoryName}`,
    },
  ];
  
  // Sort products based on the selected sorting option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        // Parse the price strings and compare numerically
        return parseFloat(String(a.price)) - parseFloat(String(b.price));
      case 'price-high-low':
        // Parse the price strings and compare numerically (reversed)
        return parseFloat(String(b.price)) - parseFloat(String(a.price));
      case 'alphabetical':
        // Sort alphabetically by name
        return a.name.localeCompare(b.name);
      case 'rating':
        // Sort by rating (highest first)
        return (b.rating || 0) - (a.rating || 0);
      case 'popularity':
      default:
        // Sort by review count (highest first) for popularity
        return (b.reviews || 0) - (a.reviews || 0);
    }
  });

  // Transform Product objects to SoftwareCard props
  const softwareCardItems = sortedProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: typeof product.price === 'number' ? `$${product.price}` : product.price,
    discount: product.featuredBenefit ? "10%" : "0%", // Example discount logic
    image: product.logo,
    vendor: product.vendor || "Vendor", // Use vendor from product or default
    rating: product.rating,
    reviewCount: product.reviews,
  }));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        {isInitializing && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md">
            Connecting to database...
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">
            {categoryName === 'all' ? 'All Software' : `${formatCategoryName(categoryName)} Software`}
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
        
        {loading ? (
          <div className="text-center py-16">
            <p className="text-secondary">Loading products...</p>
          </div>
        ) : softwareCardItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwareCardItems.map((software) => (
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
