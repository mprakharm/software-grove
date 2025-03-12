
import React from 'react';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AccountPage = () => {
  const breadcrumbItems = [
    { label: 'Account', href: '/account' }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold mt-4">Account Settings</h1>
          <p className="text-secondary mt-2">Manage your account preferences and information</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="First Name" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Last Name" defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Phone Number" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Company Name" defaultValue="Acme Inc." />
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-slate-200 rounded mr-4 flex items-center justify-center">
                        <span className="font-medium text-xs">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-secondary">Expires 12/25</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">Remove</Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">+ Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Invoice #INV-2023-001</p>
                      <p className="text-sm text-secondary">May 15, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$49.99</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Paid</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Invoice #INV-2023-002</p>
                      <p className="text-sm text-secondary">April 15, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$49.99</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Paid</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Invoice #INV-2023-003</p>
                      <p className="text-sm text-secondary">March 15, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$49.99</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Paid</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="Current Password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="New Password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm New Password" />
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-secondary">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AccountPage;
