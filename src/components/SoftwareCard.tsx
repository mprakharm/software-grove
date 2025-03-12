
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface SoftwareCardProps {
  name: string;
  description: string;
  category: string;
  price: string;
  discount: string;
  image: string;
}

const SoftwareCard = ({ name, description, category, price, discount, image }: SoftwareCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-up">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
        />
        <Badge className="absolute top-2 right-2 bg-primary">{discount} OFF</Badge>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>
          <span className="text-primary font-semibold">{price}</span>
        </div>
        <p className="text-secondary text-sm line-clamp-2">{description}</p>
      </div>
    </Card>
  );
};

export default SoftwareCard;
