
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  BarChart3, 
  Settings, 
  Calendar, 
  CreditCard,
  AlertCircle,
  Loader2,
  PlusCircle,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Subscription type definition
interface Subscription {
  id: string;
  userId: string;
  productId?: string;
  bundleId?: string;
  planId: string;
  orderId?: string;
  planName?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'canceled';
  price: number;
  currency?: string;
  name: string;
  image?: string;
  plan?: string;
  users?: number;
  totalStorage?: number;
  usedStorage?: number;
  monthlyPrice?: number;
  renewalDate?: string;
  trialEndsIn?: number;
}

// Purchase type definition
interface Purchase {
  id: string;
  userId: string;
  productId?: string;
  bundleId?: string;
  planId: string;
  date: string;
  amount: number;
  currency?: string;
  status: string;
  description?: string;
  orderId?: string;
  paymentId?: string;
}

// Empty state component for when no subscriptions exist
const EmptySubscriptionsState = () => (
  <Card className="flex flex-col items-center justify-center p-10 text-center">
    <div className="rounded-full bg-primary/10 p-4 mb-4">
      <PlusCircle className="h-10 w-10 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">No subscriptions yet</h3>
    <p className="text-gray-500 max-w-md mb-6">
      You haven't subscribed to any software yet. Browse our marketplace to find the perfect software for your business.
    </p>
    <Button asChild>
      <Link to="/">Browse Software</Link>
    </Button>
  </Card>
);

const SubscriptionsPage = () => {
  const { user, refreshSubscriptions } = useAuth();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch user's subscriptions
  const { 
    data: subscriptionsData, 
    isLoading: subscriptionsLoading, 
    refetch: refetchSubscriptions 
  } = useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: async () => {
      if (!user?.id) return { data: [] };
      console.log("Fetching subscriptions for user:", user.id);
      const response = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);
      
      console.log("Subscriptions response:", response);
      return response;
    },
    enabled: !!user?.id
  });

  // Fetch user's payment history
  const { 
    data: purchasesData, 
    isLoading: purchasesLoading,
    refetch: refetchPurchases 
  } = useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user?.id) return { data: [] };
      console.log("Fetching purchases for user:", user.id);
      const response = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      console.log("Purchases response:", response);
      return response;
    },
    enabled: !!user?.id
  });

  // Refresh all data
  const handleRefreshData = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchSubscriptions(),
        refetchPurchases(),
        refreshSubscriptions()
      ]);
      
      toast({
        title: "Data Refreshed",
        description: "Your subscription information has been updated.",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!user) return;
    
    try {
      // Update subscription status to canceled
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('id', subscriptionId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error canceling subscription:", error);
        throw new Error(error.message);
      }
      
      // Refresh the data
      await Promise.all([
        refetchSubscriptions(),
        refreshSubscriptions()
      ]);
      
      toast({
        title: "Subscription Canceled",
        description: "Your subscription has been successfully canceled.",
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast({
        title: "Cancellation Failed",
        description: "There was an error canceling your subscription. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get product or bundle name from purchases for display
  const getProductNameFromPurchase = (purchase: Purchase) => {
    // This would be better if we fetched the actual product/bundle data
    return purchase.productId || purchase.bundleId || 'Unknown Product';
  };

  // Format subscriptions data
  const formatSubscriptions = (subs: any[]): Subscription[] => {
    if (!subs || !Array.isArray(subs)) return [];
    
    return subs.map(sub => {
      const startDate = new Date(sub.start_date);
      const endDate = new Date(sub.end_date);
      const now = new Date();
      
      // Calculate trial days remaining if applicable
      const trialEndsIn = sub.status === 'trial' 
        ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) 
        : undefined;
      
      return {
        id: sub.id,
        userId: sub.user_id,
        productId: sub.product_id,
        bundleId: sub.bundle_id,
        planId: sub.plan_id,
        orderId: sub.order_id,
        planName: sub.plan_id, // Placeholder - you might want to fetch actual plan name
        startDate: sub.start_date,
        endDate: sub.end_date,
        status: sub.status || 'active',
        price: sub.price,
        currency: sub.currency,
        name: sub.product_name || 'Subscription',
        image: sub.product_image || "https://placehold.co/600x400/e4e4e7/ffffff?text=Software",
        plan: sub.plan_name || sub.plan_id,
        users: 1, // Default value
        monthlyPrice: sub.price / 12, // Assuming yearly price
        renewalDate: sub.end_date,
        trialEndsIn,
        // Optional fields for display
        totalStorage: sub.total_storage || (Math.random() > 0.5 ? 100 : undefined),
        usedStorage: sub.total_storage ? sub.used_storage || Math.floor(Math.random() * sub.total_storage) : undefined,
      };
    });
  };

  // Transform the raw data into our application format
  const allSubscriptions = formatSubscriptions(subscriptionsData?.data || []);
  const activeSubscriptions = allSubscriptions.filter(sub => sub.status === 'active');
  const purchasesToDisplay = purchasesData?.data || [];
  
  const hasSubscriptions = allSubscriptions.length > 0;
  const hasPurchases = purchasesToDisplay.length > 0;
  const isLoading = subscriptionsLoading || purchasesLoading;

  if (isLoading && !hasSubscriptions && !hasPurchases) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center" style={{ minHeight: "60vh" }}>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Subscriptions</h1>
            <p className="text-gray-600">Manage all your business software subscriptions in one place.</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              onClick={handleRefreshData} 
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button asChild>
              <Link to="/">Browse More Software</Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="mb-8">
          <TabsList>
            <TabsTrigger value="active">Active Subscriptions</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            {activeSubscriptions.length === 0 ? (
              <EmptySubscriptionsState />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSubscriptions.map((subscription) => (
                  <Card key={subscription.id} className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded mr-3">
                            <img 
                              src={subscription.image || "https://placehold.co/600x400/e4e4e7/ffffff?text=Software"} 
                              alt={subscription.name}
                              className="h-full w-full object-cover rounded"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{subscription.name}</CardTitle>
                            <div className="text-sm text-gray-500">{subscription.plan}</div>
                          </div>
                        </div>
                        {subscription.status === 'trial' ? (
                          <Badge className="bg-amber-500">Trial</Badge>
                        ) : (
                          <Badge className="bg-green-500">Active</Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {subscription.status === 'trial' && subscription.trialEndsIn && (
                          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-2 flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Trial ends in {subscription.trialEndsIn} days</span>
                          </div>
                        )}
                      
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-500">Order ID</div>
                          <div className="font-medium text-right truncate" title={subscription.orderId}>
                            {subscription.orderId ? subscription.orderId.substring(0, 12) + '...' : 'N/A'}
                          </div>
                          
                          <div className="text-gray-500">Start Date</div>
                          <div className="font-medium text-right">
                            {new Date(subscription.startDate).toLocaleDateString()}
                          </div>
                          
                          <div className="text-gray-500">Next Renewal</div>
                          <div className="font-medium text-right">
                            {new Date(subscription.endDate).toLocaleDateString()}
                          </div>
                          
                          <div className="text-gray-500">Price</div>
                          <div className="font-medium text-right">
                            {subscription.currency || '₹'}{subscription.price}
                          </div>
                        </div>
                        
                        {subscription.totalStorage && (
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Storage</span>
                              <span>{subscription.usedStorage}GB / {subscription.totalStorage}GB</span>
                            </div>
                            <Progress value={(subscription.usedStorage! / subscription.totalStorage!) * 100} className="h-2" />
                          </div>
                        )}
                        
                        <div className="pt-2 grid grid-cols-2 gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full flex items-center justify-center text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                <span>Cancel</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel your {subscription.name} subscription? 
                                  You will lose access to this service at the end of your current billing period.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleCancelSubscription(subscription.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Cancel Subscription
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <span>Open</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Add New Subscription Card */}
                <Link to="/" className="block h-full">
                  <Card className="h-full border-dashed border-2 hover:border-primary hover:bg-blue-50/30 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center h-full py-12">
                      <div className="rounded-full bg-blue-100 p-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-lg mb-1">Add New Software</h3>
                      <p className="text-gray-500 text-sm text-center">Browse our marketplace to find new software for your business</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="billing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {!hasPurchases ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You don't have any payment history yet.</p>
                    <Button asChild variant="outline">
                      <Link to="/">Browse Software</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Description</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Order ID</th>
                          <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Amount</th>
                          <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchasesToDisplay.map((payment) => (
                          <tr key={payment.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-sm">
                              {payment.description || `Payment for ${getProductNameFromPurchase(payment)}`}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {payment.orderId ? (
                                <span className="font-mono text-xs" title={payment.orderId}>
                                  {payment.orderId.substring(0, 12)}...
                                </span>
                              ) : 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-sm text-right">
                              {payment.currency || '₹'}{payment.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Badge className={`bg-${payment.status === 'completed' ? 'green' : 'amber'}-100 
                                text-${payment.status === 'completed' ? 'green' : 'amber'}-800 
                                hover:bg-${payment.status === 'completed' ? 'green' : 'amber'}-100 font-normal`}>
                                {payment.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {hasSubscriptions && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  Upcoming Renewals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSubscriptions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming renewals</p>
                ) : (
                  <div className="space-y-4">
                    {activeSubscriptions.map((subscription) => (
                      <div key={`renewal-${subscription.id}`} className="flex justify-between items-center pb-2 border-b last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{subscription.name}</div>
                          <div className="text-sm text-gray-500">{new Date(subscription.endDate).toLocaleDateString()}</div>
                        </div>
                        <div className="font-medium">{subscription.currency || '₹'}{subscription.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-gray-500" />
                  Usage Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSubscriptions.filter(sub => sub.totalStorage).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No usage data available</p>
                ) : (
                  <div className="space-y-4">
                    {activeSubscriptions.filter(sub => sub.totalStorage).map((subscription) => (
                      <div key={`usage-${subscription.id}`} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{subscription.name} Storage</span>
                          <span>{Math.round((subscription.usedStorage! / subscription.totalStorage!) * 100)}%</span>
                        </div>
                        <Progress value={(subscription.usedStorage! / subscription.totalStorage!) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="mr-3 bg-gray-100 p-2 rounded">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-xs text-gray-500">Expires 12/24</div>
                    </div>
                    <Badge className="ml-auto">Default</Badge>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubscriptionsPage;
