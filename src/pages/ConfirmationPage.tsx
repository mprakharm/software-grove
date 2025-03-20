
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border-green-100">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              
              <h1 className="text-3xl font-medium mb-3 text-apple-black tracking-tight">Order Confirmed!</h1>
              <p className="text-apple-gray mb-6 text-lg">
                Thank you for your purchase. Your order has been successfully processed.
              </p>
              
              <div className="bg-apple-lightgray rounded-xl p-5 mb-8 inline-block">
                <div className="font-medium text-apple-black">Order #: {orderId}</div>
                <div className="text-sm text-apple-gray mt-1">A confirmation email has been sent to your inbox.</div>
              </div>
              
              <div className="mb-10">
                <h3 className="font-medium mb-5 text-lg">Next Steps:</h3>
                <div className="grid md:grid-cols-3 gap-5 text-left">
                  <div className="bg-white p-6 rounded-xl border border-gray-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                    <Settings className="h-5 w-5 text-apple-blue mb-3" />
                    <div className="font-medium mb-2 text-apple-black">Set Up Your Account</div>
                    <p className="text-sm text-apple-gray">Configure your new software with guided setup.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                    <Calendar className="h-5 w-5 text-apple-blue mb-3" />
                    <div className="font-medium mb-2 text-apple-black">Schedule Training</div>
                    <p className="text-sm text-apple-gray">Book a demo with our product specialists.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                    <BarChart className="h-5 w-5 text-apple-blue mb-3" />
                    <div className="font-medium mb-2 text-apple-black">Explore Features</div>
                    <p className="text-sm text-apple-gray">Discover all the capabilities of your new software.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-5">
                <Button asChild variant="default">
                  <Link to="/subscriptions">
                    Manage Subscriptions <ArrowRight className="ml-1 h-4 w-4" />
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
