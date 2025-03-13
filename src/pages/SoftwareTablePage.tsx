
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FEATURED_SOFTWARE } from './Index';
import Navigation from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

type SortField = 'name' | 'category' | 'price' | 'rating';
type SortDirection = 'asc' | 'desc';

const SoftwareTablePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredSoftware = FEATURED_SOFTWARE
    .filter(software => 
      searchQuery === '' || 
      software.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      software.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      software.vendor?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === 'price') {
        // Extract numeric value from price for comparison
        const priceA = a.price.replace(/[^0-9.]/g, '');
        const priceB = b.price.replace(/[^0-9.]/g, '');
        comparison = parseFloat(priceA || '0') - parseFloat(priceB || '0');
      } else if (sortField === 'rating') {
        comparison = (a.rating || 0) - (b.rating || 0);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Software Directory</h1>
          <p className="text-gray-600 mb-6">
            Browse our complete directory of software applications. Sort by name, category, price, or rating.
          </p>
          
          <div className="relative max-w-md mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search software by name, category, or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableCaption>
              {filteredSoftware.length} software applications found
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSortClick('name')}>
                  <div className="flex items-center">
                    Software
                    {sortField === 'name' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortClick('category')}>
                  <div className="flex items-center">
                    Category
                    {sortField === 'category' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSortClick('price')}>
                  <div className="flex items-center justify-end">
                    Price
                    {sortField === 'price' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSortClick('rating')}>
                  <div className="flex items-center justify-end">
                    Rating
                    {sortField === 'rating' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSoftware.map((software) => (
                <TableRow key={software.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <Link to={`/product/${software.id}`} className="flex items-center hover:text-blue-600 transition-colors">
                      <div 
                        className="w-8 h-8 rounded flex items-center justify-center mr-3 text-white text-xs font-bold"
                        style={{ backgroundColor: software.color }}
                      >
                        {software.name.substring(0, 2)}
                      </div>
                      {software.name}
                      {software.discount !== "0%" && (
                        <Badge className="ml-2 text-xs" style={{ backgroundColor: software.color }}>
                          {software.discount} OFF
                        </Badge>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {software.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{software.vendor}</TableCell>
                  <TableCell className="text-right">{software.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      {software.rating && (
                        <>
                          <span className="mr-1">{software.rating}</span>
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-500 ml-1">({software.reviewCount})</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SoftwareTablePage;
