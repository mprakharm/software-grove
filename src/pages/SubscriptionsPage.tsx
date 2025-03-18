
import React, { useEffect, useState } from 'react';
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
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionAPI } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { useToast } from '@/components/ui/use-toast';

// Mock data for active subscriptions (fallback if no real subscriptions yet)
const ACTIVE_SUBSCRIPTIONS = [
  {
    id: 'sub-001',
    name: 'Google Workspace',
    plan: 'Business Standard',
    users: 5,
    usedStorage: 15,
    totalStorage: 30,
    renewalDate: '2023-12-01',
    monthlyPrice: 12,
    image: "https://placehold.co/600x400/e4e4e7/ffffff?text=Google+Workspace",
    status: 'active',
  },
  {
    id: 'sub-002',
    name: 'Notion',
    plan: 'Team',
    users: 8,
    usedStorage: 3,
    totalStorage: 10,
    renewalDate: '2023-11-15',
    monthlyPrice: 8,
    image: "https://placehold.co/600x400/e4e4e7/ffffff?text=Notion",
    status: 'active',
  },
  {
    id: 'sub-003',
    name: 'Zendesk',
    plan: 'Professional',
    users: 3,
    usedStorage: null,
    totalStorage: null,
    renewalDate: '2023-12-10',
    monthlyPrice: 49,
    image: "https://placehold.co/600x400/e4e4e7/ffffff?text=Zendesk",
    status: 'trial',
    trialEndsIn: 7,
  },
];

// Mock data for payment history
const PAYMENT_HISTORY = [
  {
    id: 'pay-001',
    date: '2023-10-01',
    description: 'Google Workspace - Business Standard (5 users)',
    amount: 60,
    status: 'paid',
  },
  {
    id: 'pay-002',
    date: '2023-10-01',
    description: 'Notion - Team (8 users)',
    amount: 64,
    status: 'paid',
  },
  {
    id: 'pay-003',
    date: '2023-09-01',
    description: 'Google Workspace - Business Standard (5 users)',
    amount: 60,
    status: 'paid',
  },
  {
    id: 'pay-004',
    date: '2023-09-01',
    description: 'Notion - Team (8 users)',
    amount: 64,
    status: 'paid',
  },
];

const SubscriptionsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch user's subscriptions
  const { data: userSubscriptions, isLoading, error } = useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await SubscriptionAPI.getUserSubscriptions(user.id);
    },
    enabled: !!user?.id
  });

  // Fetch user's payment history
  const { data: userPurchases } = useQuery({
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

  // Determine which subscriptions to display
  const subscriptionsToDisplay = userSubscriptions?.length ? userSubscriptions : ACTIVE_SUBSCRIPTIONS;
  // Ensure we safely access the data property from the response
  const purchasesToDisplay = userPurchases?.data?.length ? userPurchases.data : PAYMENT_HISTORY;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center" style={{ minHeight: "60vh" }}>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Error Loading Subscriptions</h1>
            <p className="text-gray-600 mb-6">There was a problem loading your subscription data.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionsToDisplay.map((subscription) => (
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
          </TabsContent>
          
          <TabsContent value="billing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
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
                {ACTIVE_SUBSCRIPTIONS.map((subscription) => (
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
              <div className="space-y-4">
                {ACTIVE_SUBSCRIPTIONS.filter(sub => sub.totalStorage).map((subscription) => (
                  <div key={`usage-${subscription.id}`} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{subscription.name} Storage</span>
                      <span>{Math.round((subscription.usedStorage! / subscription.totalStorage!) * 100)}%</span>
                    </div>
                    <Progress value={(subscription.usedStorage! / subscription.totalStorage!) * 100} className="h-2" />
                  </div>
                ))}
              </div>
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
      </div>
    </Layout>
  );
};

export default SubscriptionsPage;
