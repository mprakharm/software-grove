
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, BarChart3, CreditCard } from 'lucide-react';
import { ExtendedSubscription, Purchase } from '@/utils/db';

interface SubscriptionStatsProps {
  subscriptions: ExtendedSubscription[];
  purchases: Purchase[];
}

const SubscriptionStats: React.FC<SubscriptionStatsProps> = ({ subscriptions, purchases }) => {
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active' || sub.status === 'trial');
  
  // Calculate total monthly spend
  const totalMonthlySpend = activeSubscriptions.reduce((total, sub) => total + sub.price, 0);
  
  // Get upcoming renewals
  const upcomingRenewals = [...activeSubscriptions]
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 3);
  
  // Get subscriptions with storage usage
  const subscriptionsWithStorage = activeSubscriptions.filter(sub => sub.totalStorage && sub.usedStorage);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            Upcoming Renewals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingRenewals.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming renewals</p>
          ) : (
            <div className="space-y-4">
              {upcomingRenewals.map((subscription) => (
                <div key={`renewal-${subscription.id}`} className="flex justify-between items-center pb-2 border-b last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{subscription.name}</div>
                    <div className="text-sm text-gray-500">{new Date(subscription.endDate).toLocaleDateString()}</div>
                  </div>
                  <div className="font-medium">{subscription.currency} {subscription.price.toFixed(2)}</div>
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
          {subscriptionsWithStorage.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No usage data available</p>
          ) : (
            <div className="space-y-4">
              {subscriptionsWithStorage.map((subscription) => (
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
            Monthly Spend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-full py-4">
            <div className="text-3xl font-bold mb-2">{activeSubscriptions.length > 0 ? activeSubscriptions[0].currency : '$'} {totalMonthlySpend.toFixed(2)}</div>
            <div className="text-sm text-gray-500">{activeSubscriptions.length} active subscription{activeSubscriptions.length !== 1 ? 's' : ''}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionStats;
