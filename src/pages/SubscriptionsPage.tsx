
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { SubscriptionService } from '@/utils/subscriptionService';
import SubscriptionsList from '@/components/subscription/SubscriptionsList';
import BillingHistory from '@/components/subscription/BillingHistory';
import SubscriptionStats from '@/components/subscription/SubscriptionStats';
import { ExtendedSubscription, Purchase } from '@/utils/db';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Update expired subscriptions when the page loads
  useEffect(() => {
    const updateExpiredSubs = async () => {
      if (user?.id) {
        await SubscriptionService.updateExpiredSubscriptions();
        // Refresh the subscriptions data
        queryClient.invalidateQueries({ queryKey: ['subscriptions', user.id] });
      }
    };
    
    updateExpiredSubs();
  }, [user?.id, queryClient]);
  
  // Fetch user's subscriptions with extended data
  const { 
    data: subscriptions, 
    isLoading: subscriptionsLoading,
    refetch: refetchSubscriptions
  } = useQuery<ExtendedSubscription[]>({
    queryKey: ['subscriptions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await SubscriptionService.getExtendedUserSubscriptions(user.id);
    },
    enabled: !!user?.id
  });
  
  // Fetch user's payment history
  const { 
    data: purchases, 
    isLoading: purchasesLoading 
  } = useQuery<Purchase[]>({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await SubscriptionService.getUserPurchases(user.id);
    },
    enabled: !!user?.id
  });

  const activeSubscriptions = subscriptions?.filter(sub => 
    sub.status === 'active' || sub.status === 'trial'
  ) || [];
  
  const cancelledSubscriptions = subscriptions?.filter(sub => 
    sub.status === 'cancelled' || sub.status === 'expired'
  ) || [];

  const handleRefreshSubscriptions = () => {
    refetchSubscriptions();
  };

  const isLoading = subscriptionsLoading || purchasesLoading;
  const hasSubscriptions = (subscriptions?.length || 0) > 0;
  const hasPurchases = (purchases?.length || 0) > 0;

  if (isLoading) {
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
            <p className="text-gray-600">Manage all your software subscriptions in one place.</p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/">Browse More Software</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="active" className="mb-8">
          <TabsList>
            <TabsTrigger value="active">Active Subscriptions</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled Subscriptions</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            {!hasSubscriptions || activeSubscriptions.length === 0 ? (
              <EmptySubscriptionsState />
            ) : (
              <>
                <SubscriptionsList 
                  subscriptions={activeSubscriptions} 
                  onRefresh={handleRefreshSubscriptions} 
                />
                
                {/* Add New Subscription Card */}
                <div className="mt-6">
                  <Link to="/" className="block">
                    <Card className="border-dashed border-2 hover:border-primary hover:bg-blue-50/30 transition-colors cursor-pointer">
                      <CardContent className="flex flex-col items-center justify-center py-12">
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
              </>
            )}
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-6">
            {cancelledSubscriptions.length === 0 ? (
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <p className="text-gray-500 mb-4">You don't have any cancelled or expired subscriptions.</p>
                </CardContent>
              </Card>
            ) : (
              <SubscriptionsList 
                subscriptions={cancelledSubscriptions} 
                onRefresh={handleRefreshSubscriptions} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="billing" className="mt-6">
            <BillingHistory purchases={purchases || []} />
          </TabsContent>
        </Tabs>
        
        {hasSubscriptions && activeSubscriptions.length > 0 && (
          <SubscriptionStats 
            subscriptions={activeSubscriptions} 
            purchases={purchases || []} 
          />
        )}
      </div>
    </Layout>
  );
};

export default SubscriptionsPage;
