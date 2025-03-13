
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

// Import Pages
import Index from './pages/Index';
import ProductPage from './pages/ProductPage';
import NotFound from './pages/NotFound';
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AccountPage from './pages/AccountPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SoftwareTablePage from './pages/SoftwareTablePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/checkout/:productId" element={<CheckoutPage />} />
        <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/subscription/:subscriptionId" element={<SubscriptionPage />} />
        <Route path="/software-table" element={<SoftwareTablePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
