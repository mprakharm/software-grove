
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductAPI, BundleAPI } from '@/utils/api';
import { Product, Bundle, BundleProduct } from '@/utils/db';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Plus, Trash, Edit, Save } from 'lucide-react';

const AdminPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingBundle, setIsAddingBundle] = useState(false);

  const newProductForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      logo: 'https://placehold.co/100x100',
      price: 0,
      inStock: true
    }
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, bundlesData] = await Promise.all([
          ProductAPI.getProducts(),
          BundleAPI.getBundles()
        ]);
        setProducts(productsData);
        setBundles(bundlesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Handle adding a new product
  const handleAddProduct = async (data: Omit<Product, 'id'>) => {
    try {
      const newProduct = await ProductAPI.addProduct(data);
      setProducts([...products, newProduct]);
      setIsAddingProduct(false);
      newProductForm.reset();
      toast({
        title: 'Success',
        description: 'Product added successfully!',
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductAPI.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast({
          title: 'Success',
          description: 'Product deleted successfully!',
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete product. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  // Update a product
  const handleUpdateProduct = async (product: Product) => {
    try {
      const updatedProduct = await ProductAPI.updateProduct(product.id, product);
      if (updatedProduct) {
        setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
        setEditingProduct(null);
        toast({
          title: 'Success',
          description: 'Product updated successfully!',
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="bundles">Bundles</TabsTrigger>
          </TabsList>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products</h2>
              <Button onClick={() => setIsAddingProduct(true)} disabled={isAddingProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
            
            {/* Add New Product Form */}
            {isAddingProduct && (
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h3 className="text-xl font-bold mb-4">Add New Product</h3>
                <Form {...newProductForm}>
                  <form onSubmit={newProductForm.handleSubmit(handleAddProduct)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={newProductForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Product name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={newProductForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Category" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={newProductForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                                placeholder="Price" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={newProductForm.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logo URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Logo URL" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={newProductForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Product description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddingProduct(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save Product
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
            
            {/* Products Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">Loading products...</TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">No products found</TableCell>
                    </TableRow>
                  ) : (
                    products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Bundles Tab */}
          <TabsContent value="bundles">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Bundles</h2>
              <Button onClick={() => setIsAddingBundle(true)} disabled={isAddingBundle}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bundle
              </Button>
            </div>
            
            {/* Bundles Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Savings</TableHead>
                    <TableHead>Purchases</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Loading bundles...</TableCell>
                    </TableRow>
                  ) : bundles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No bundles found</TableCell>
                    </TableRow>
                  ) : (
                    bundles.map(bundle => (
                      <TableRow key={bundle.id}>
                        <TableCell className="font-medium">{bundle.name}</TableCell>
                        <TableCell>{bundle.category}</TableCell>
                        <TableCell>{bundle.products?.length || 0} products</TableCell>
                        <TableCell>{bundle.savings}%</TableCell>
                        <TableCell>{bundle.purchases || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingBundle(bundle)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
