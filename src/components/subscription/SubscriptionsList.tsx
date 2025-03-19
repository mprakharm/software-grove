
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ExternalLink, Settings, AlertCircle } from 'lucide-react';
import { ExtendedSubscription } from '@/utils/db';
import { useToast } from '@/components/ui/use-toast';
import { SubscriptionService } from '@/utils/subscriptionService';

interface SubscriptionsListProps {
  subscriptions: ExtendedSubscription[];
  onRefresh: () => void;
}

const SubscriptionsList: React.FC<SubscriptionsListProps> = ({ subscriptions, onRefresh }) => {
  const { toast } = useToast();
  
  const handleCancelSubscription = async (subscriptionId: string, reason?: string) => {
    try {
      const success = await SubscriptionService.cancelSubscription(subscriptionId, reason);
      
      if (success) {
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription has been successfully cancelled.",
        });
        
        // Refresh the list
        onRefresh();
      } else {
        toast({
          title: "Cancellation Failed",
          description: "We couldn't cancel your subscription. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Cancellation Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (subscriptions.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent className="pt-6">
          <p className="text-gray-500 mb-4">You don't have any active subscriptions.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map((subscription) => (
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
              <StatusBadge status={subscription.status} />
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
                <div className="text-gray-500">Start Date</div>
                <div className="font-medium text-right">{new Date(subscription.startDate).toLocaleDateString()}</div>
                
                <div className="text-gray-500">End Date</div>
                <div className="font-medium text-right">{new Date(subscription.endDate).toLocaleDateString()}</div>
                
                <div className="text-gray-500">Price</div>
                <div className="font-medium text-right">{subscription.currency} {subscription.price.toFixed(2)}</div>
                
                <div className="text-gray-500">Auto-renew</div>
                <div className="font-medium text-right">{subscription.autoRenew ? 'Yes' : 'No'}</div>
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
                {subscription.status === 'active' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full flex items-center justify-center"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        <span>Cancel</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel your subscription to {subscription.name}? You will lose access at the end of your current billing period.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleCancelSubscription(subscription.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Cancel Subscription
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span>Manage</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'trial':
      return <Badge className="bg-amber-500">Trial</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500">Cancelled</Badge>;
    case 'expired':
      return <Badge className="bg-gray-500">Expired</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default SubscriptionsList;
