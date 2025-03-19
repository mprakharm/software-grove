
import React from 'react';
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
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

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
  const { user, userSubscriptions, subscriptionsLoading } = useAuth();
  const { toast } = useToast();
  
  // Fetch user's payment history
  const { data: userPurchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user?.id) return { data: [] };
      const response = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      return response;
    },
    enabled: !!user?.id
  });

  const handleRenewSubscription = async (subscriptionId: string) => {
    try {
      // In a real application, this would connect to a payment processing system
      toast({
        title: "Subscription Renewed",
        description: "Your subscription has been successfully renewed.",
      });
    } catch (error) {
      toast({
        title: "Renewal Failed",
        description: "There was an error renewing your subscription. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Ensure we safely access the data property from the response
  const purchasesToDisplay = userPurchases?.data || [];
  const hasSubscriptions = userSubscriptions.length > 0;
  const hasPurchases = purchasesToDisplay.length > 0;

  if (subscriptionsLoading) {
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
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/">Browse More Software</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="active" className="mb-8">
          <TabsList>
            <TabsTrigger value="active">Active Subscriptions</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            {!hasSubscriptions ? (
              <EmptySubscriptionsState />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSubscriptions.map((subscription) => (
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
                        {subscription.status === 'trial' && (
                          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-2 flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Trial ends in {subscription.trialEndsIn} days</span>
                          </div>
                        )}
                      
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-500">Users</div>
                          <div className="font-medium text-right">{subscription.users}</div>
                          
                          <div className="text-gray-500">Next Renewal</div>
                          <div className="font-medium text-right">{new Date(subscription.renewalDate).toLocaleDateString()}</div>
                          
                          <div className="text-gray-500">Monthly Cost</div>
                          <div className="font-medium text-right">${subscription.monthlyPrice * subscription.users}</div>
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full flex items-center justify-center"
                            onClick={() => handleRenewSubscription(subscription.id)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            <span>Renew</span>
                          </Button>
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
                          <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Amount</th>
                          <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchasesToDisplay.map((payment) => (
                          <tr key={payment.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-sm">{payment.description || `Payment for ${payment.product_id || payment.bundle_id || 'subscription'}`}</td>
                            <td className="py-3 px-4 text-sm text-right">${payment.amount.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-normal">
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
                <div className="space-y-4">
                  {userSubscriptions.map((subscription) => (
                    <div key={`renewal-${subscription.id}`} className="flex justify-between items-center pb-2 border-b last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{subscription.name}</div>
                        <div className="text-sm text-gray-500">{new Date(subscription.renewalDate).toLocaleDateString()}</div>
                      </div>
                      <div className="font-medium">${subscription.monthlyPrice * subscription.users}</div>
                    </div>
                  ))}
                </div>
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
                {userSubscriptions.filter(sub => sub.totalStorage).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No usage data available</p>
                ) : (
                  <div className="space-y-4">
                    {userSubscriptions.filter(sub => sub.totalStorage).map((subscription) => (
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
