
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Clock } from 'lucide-react';
import { Bundle, getBundleMetrics, getBundleProductsInfo } from '@/data/bundlesData';
import { FEATURED_SOFTWARE } from '@/pages/Index';

interface BundleCardProps {
  bundle: Bundle;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle }) => {
  const metrics = getBundleMetrics(bundle);
  const bundleProducts = getBundleProductsInfo(bundle);
  
  // Get highlight products (show up to 4)
  const highlightProducts = bundleProducts
    .slice(0, 4)
    .map(bp => FEATURED_SOFTWARE.find(p => p.id === bp.productId))
    .filter(Boolean);

  return (
    <Link to={`/bundles/${bundle.id}`} className="block transform transition-all duration-300 hover:-translate-y-1">
      <Card className="h-full hover:shadow-lg border border-gray-100 shadow-sm hover:border-blue-400 overflow-hidden relative">
        {bundle.isLimitedTime && (
          <Badge 
            className="absolute top-2 right-2 z-10 bg-red-500 text-white font-medium"
          >
            <Clock className="h-3 w-3 mr-1" /> Limited Time
          </Badge>
        )}
        
        <div 
          className="aspect-video p-6 relative flex flex-col justify-center items-center"
          style={{ backgroundColor: `${bundle.color}25` }}
        >
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
            }}
          ></div>
          
          <div className="flex justify-center items-center mb-4">
            <div className="bg-white rounded-xl p-2 shadow-sm">
              <Layers className="h-8 w-8" style={{ color: bundle.color }} />
            </div>
          </div>
          
          <h3 className="font-bold text-xl text-center mb-2 text-gray-800">{bundle.name}</h3>
          <Badge className="bg-blue-100 text-blue-800 font-normal hover:bg-blue-100">
            {bundle.category}
          </Badge>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex">
              {highlightProducts.map((product, index) => (
                <div 
                  key={product?.id} 
                  className="w-8 h-8 rounded-md overflow-hidden border border-gray-200"
                  style={{ marginLeft: index > 0 ? '-8px' : '0', zIndex: 10 - index }}
                >
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: product?.color || '#e5e7eb' }}
                  >
                    {product?.name.charAt(0)}
                  </div>
                </div>
              ))}
              {bundle.products.length > 4 && (
                <div 
                  className="w-8 h-8 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100 text-xs font-medium"
                  style={{ marginLeft: '-8px', zIndex: 6 }}
                >
                  +{bundle.products.length - 4}
                </div>
              )}
            </div>
            <Badge className="bg-green-100 text-green-800 font-medium hover:bg-green-100">
              {metrics.savingsPercentage}% OFF
            </Badge>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">{bundle.description}</p>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-gray-500">Bundle price</div>
              <div className="font-bold text-xl text-razorpay-blue">${metrics.bundlePrice.toFixed(2)}/mo</div>
              <div className="text-xs text-gray-500 line-through">${metrics.individualPrice.toFixed(2)}/mo</div>
            </div>
            <div className="text-sm text-gray-600">
              {metrics.totalProducts} Products
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BundleCard;
