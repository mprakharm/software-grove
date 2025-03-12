
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, BarChart, Calendar, Settings } from 'lucide-react';

const ConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-green-100">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been successfully processed.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
                <div className="font-medium">Order #: {orderId}</div>
                <div className="text-sm text-gray-500">A confirmation email has been sent to your inbox.</div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Next Steps:</h3>
                <div className="grid md:grid-cols-3 gap-4 text-left">
                  <div className="bg-white p-4 rounded-lg border">
                    <Settings className="h-5 w-5 text-gray-600 mb-2" />
                    <div className="font-medium mb-1">Set Up Your Account</div>
                    <p className="text-sm text-gray-600">Configure your new software with guided setup.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <Calendar className="h-5 w-5 text-gray-600 mb-2" />
                    <div className="font-medium mb-1">Schedule Training</div>
                    <p className="text-sm text-gray-600">Book a demo with our product specialists.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <BarChart className="h-5 w-5 text-gray-600 mb-2" />
                    <div className="font-medium mb-1">Explore Features</div>
                    <p className="text-sm text-gray-600">Discover all the capabilities of your new software.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild variant="default">
                  <Link to="/subscriptions">
                    Manage Subscriptions <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmationPage;
