
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface SoftwareCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string | number;
  discount: string;
  image: string;
  vendor?: string;
  rating?: number;
  reviewCount?: number;
  color?: string;
}

const SoftwareCard = ({ 
  id, 
  name, 
  description, 
  category, 
  price, 
  discount, 
  image,
  vendor,
  rating,
  reviewCount,
  color = "#2D88FF" 
}: SoftwareCardProps) => {
  // Set a different default color for Entertainment category
  const cardColor = category === 'Entertainment' ? "#8B5CF6" : color;
  
  // Properly handle different types of price values
  const formattedPrice = (() => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    } else if (typeof price === 'string') {
      // If it's already a string, return it or try to format if it's a numeric string
      if (price.trim() === '') return 'Free';
      
      // Try to parse it as a number if it's a numeric string without $ sign
      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
      if (!isNaN(numericPrice) && !price.includes('$')) {
        return `$${numericPrice.toFixed(2)}`;
      }
      return price;
    }
    return 'Free'; // Default fallback
  })();

  // Customize the pricing label based on category
  const pricingLabel = category === 'Entertainment' ? 'per month' : 'per user/month';
    
  return (
    <Link to={`/product/${id}`} className="block transform transition-all duration-300 hover:-translate-y-1">
      <Card className="h-full group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-up border border-gray-100 shadow-sm hover:border-razorpay-blue">
        <div className="relative aspect-video overflow-hidden group-hover:border-2 group-hover:border-razorpay-blue" style={{ backgroundColor: cardColor + '15' }}>
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
          />
          {discount && discount !== "0%" && (
            <Badge className="absolute top-2 right-2" style={{ backgroundColor: cardColor }}>{discount} OFF</Badge>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg mb-1 text-razorpay-navy">{name}</h3>
              <div className="flex items-center mb-1">
                <span className="text-xs text-razorpay-gray mr-2">by {vendor || 'Unknown vendor'}</span>
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              </div>
              {rating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={`${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} mr-0.5`} 
                    />
                  ))}
                  <span className="text-xs text-razorpay-gray ml-1">
                    {rating} ({reviewCount})
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-razorpay-blue">{formattedPrice}</span>
              {formattedPrice && formattedPrice.includes('$') && !formattedPrice.includes('%') && (
                <span className="text-xs text-razorpay-gray">{pricingLabel}</span>
              )}
            </div>
          </div>
          <p className="text-razorpay-gray text-sm line-clamp-2">{description}</p>
        </div>
      </Card>
    </Link>
  );
};

export default SoftwareCard;
