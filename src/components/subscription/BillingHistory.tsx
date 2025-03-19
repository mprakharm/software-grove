
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Purchase } from '@/utils/db';

interface BillingHistoryProps {
  purchases: Purchase[];
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ purchases }) => {
  if (purchases.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent className="pt-6">
          <p className="text-gray-500 mb-4">You don't have any billing history yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
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
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Payment Method</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Transaction ID</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Amount</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Status</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{new Date(purchase.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm">{purchase.planName}</td>
                  <td className="py-3 px-4 text-sm">{purchase.paymentMethod || 'Razorpay'}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 truncate max-w-[120px]">{purchase.transactionId}</td>
                  <td className="py-3 px-4 text-sm text-right">{purchase.currency} {purchase.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={purchase.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {purchase.invoiceUrl ? (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={purchase.invoiceUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" disabled>
                        <FileText className="h-4 w-4 text-gray-400" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-normal">Completed</Badge>;
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-normal">Pending</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 font-normal">Failed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default BillingHistory;
