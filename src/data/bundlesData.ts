
import { FEATURED_SOFTWARE } from '@/pages/Index';

export type BundleProduct = {
  productId: string;
  individualPrice: number;
  bundlePrice: number;
};

export type Bundle = {
  id: string;
  name: string;
  description: string;
  category: string;
  targetUser: string;
  products: BundleProduct[];
  minProducts?: number;
  maxProducts?: number;
  requiredProductIds?: string[];
  image: string;
  savings: number;
  isCustomizable: boolean;
  isLimitedTime?: boolean;
  expiryDate?: string;
  color: string;
};

// Find a product by ID in the FEATURED_SOFTWARE array
const findProductById = (id: string) => {
  return FEATURED_SOFTWARE.find(product => product.id === id);
};

// Calculate total individual price
const calculateIndividualPrice = (products: BundleProduct[]) => {
  return products.reduce((total, product) => total + product.individualPrice, 0);
};

// Calculate total bundle price
const calculateBundlePrice = (products: BundleProduct[]) => {
  return products.reduce((total, product) => total + product.bundlePrice, 0);
};

// Calculate savings percentage
const calculateSavings = (individualPrice: number, bundlePrice: number) => {
  return Math.round(((individualPrice - bundlePrice) / individualPrice) * 100);
};

export const BUNDLES: Bundle[] = [
  {
    id: 'business-essentials',
    name: 'Business Essentials Starter Pack',
    description: 'Everything a new business needs to get started with professional tools',
    category: 'Starter',
    targetUser: 'New Businesses',
    products: [
      { productId: 'google-workspace', individualPrice: 6, bundlePrice: 4.5 },
      { productId: 'canva', individualPrice: 12.99, bundlePrice: 9.74 },
      { productId: 'slack', individualPrice: 6.67, bundlePrice: 5 },
      { productId: 'zoom', individualPrice: 14.99, bundlePrice: 11.24 }
    ],
    minProducts: 3,
    maxProducts: 5,
    image: 'https://placehold.co/600x400/5C3BFE/ffffff?text=Business+Essentials',
    savings: 25,
    isCustomizable: true,
    color: '#5C3BFE'
  },
  {
    id: 'marketing-suite',
    name: 'Digital Marketing Command Center',
    description: 'Complete toolkit for managing your online marketing efforts',
    category: 'Marketing',
    targetUser: 'Marketing Teams',
    products: [
      { productId: 'mailchimp', individualPrice: 14.99, bundlePrice: 11.24 },
      { productId: 'semrush', individualPrice: 119.95, bundlePrice: 89.96 },
      { productId: 'canva', individualPrice: 12.99, bundlePrice: 9.74 },
      { productId: 'hootsuite', individualPrice: 49, bundlePrice: 36.75 },
      { productId: 'google-analytics', individualPrice: 0, bundlePrice: 0 }
    ],
    minProducts: 4,
    maxProducts: 6,
    requiredProductIds: ['mailchimp', 'semrush'],
    image: 'https://placehold.co/600x400/FF7A59/ffffff?text=Marketing+Suite',
    savings: 25,
    isCustomizable: true,
    color: '#FF7A59'
  },
  {
    id: 'developer-toolkit',
    name: 'Software Development Powerpack',
    description: 'Essential tools for software development teams',
    category: 'Developer',
    targetUser: 'Development Teams',
    products: [
      { productId: 'jira', individualPrice: 7.75, bundlePrice: 5.81 },
      { productId: 'figma', individualPrice: 12, bundlePrice: 9 },
      { productId: 'slack', individualPrice: 6.67, bundlePrice: 5 },
      { productId: 'o365', individualPrice: 6, bundlePrice: 4.5 },
      { productId: 'notion', individualPrice: 8, bundlePrice: 6 }
    ],
    minProducts: 3,
    maxProducts: 5,
    image: 'https://placehold.co/600x400/0052CC/ffffff?text=Developer+Toolkit',
    savings: 25,
    isCustomizable: true,
    color: '#0052CC'
  },
  {
    id: 'finance-stack',
    name: 'Financial Management Bundle',
    description: 'Comprehensive financial tools for accounting, billing, and expense management',
    category: 'Finance',
    targetUser: 'Finance Teams',
    products: [
      { productId: 'quickbooks', individualPrice: 25, bundlePrice: 17.5 },
      { productId: 'stripe', individualPrice: 0, bundlePrice: 0 },
      { productId: 'chargebee', individualPrice: 249, bundlePrice: 174.3 },
      { productId: 'expensify', individualPrice: 4.99, bundlePrice: 3.49 }
    ],
    minProducts: 3,
    maxProducts: 4,
    requiredProductIds: ['quickbooks'],
    image: 'https://placehold.co/600x400/2CA01C/ffffff?text=Finance+Stack',
    savings: 30,
    isCustomizable: true,
    color: '#2CA01C'
  },
  {
    id: 'customer-support',
    name: 'Customer Support Suite',
    description: 'Tools to provide exceptional customer service across all channels',
    category: 'Support',
    targetUser: 'Support Teams',
    products: [
      { productId: 'zendesk', individualPrice: 19, bundlePrice: 13.3 },
      { productId: 'intercom', individualPrice: 39, bundlePrice: 27.3 },
      { productId: 'livechat', individualPrice: 16, bundlePrice: 11.2 }
    ],
    minProducts: 2,
    maxProducts: 3,
    image: 'https://placehold.co/600x400/03363D/ffffff?text=Support+Suite',
    savings: 30,
    isCustomizable: true,
    color: '#03363D'
  },
  {
    id: 'productivity-pack',
    name: 'Team Productivity Boost',
    description: 'Essential productivity tools for teams to collaborate efficiently',
    category: 'Productivity',
    targetUser: 'All Teams',
    products: [
      { productId: 'asana', individualPrice: 10.99, bundlePrice: 7.69 },
      { productId: 'dropbox', individualPrice: 9.99, bundlePrice: 6.99 },
      { productId: 'notion', individualPrice: 8, bundlePrice: 5.6 },
      { productId: 'slack', individualPrice: 6.67, bundlePrice: 4.67 }
    ],
    minProducts: 3,
    maxProducts: 4,
    image: 'https://placehold.co/600x400/F06A6A/ffffff?text=Productivity+Pack',
    savings: 30,
    isCustomizable: true,
    color: '#F06A6A'
  },
  {
    id: 'ai-automation',
    name: 'AI & Automation Power Bundle',
    description: 'Next-generation AI and automation tools to streamline your workflows',
    category: 'AI & Automation',
    targetUser: 'Forward-thinking Teams',
    products: [
      { productId: 'chatgpt', individualPrice: 20, bundlePrice: 14 },
      { productId: 'zapier', individualPrice: 19.99, bundlePrice: 13.99 },
      { productId: 'jasper', individualPrice: 49, bundlePrice: 34.3 },
      { productId: 'make', individualPrice: 16, bundlePrice: 11.2 }
    ],
    isLimitedTime: true,
    expiryDate: '2024-12-31',
    minProducts: 2,
    maxProducts: 4,
    image: 'https://placehold.co/600x400/10A37F/ffffff?text=AI+Bundle',
    savings: 30,
    isCustomizable: true,
    color: '#10A37F'
  }
];

// Calculate bundle metrics for display
export const getBundleMetrics = (bundle: Bundle) => {
  const totalProducts = bundle.products.length;
  const individualPrice = calculateIndividualPrice(bundle.products);
  const bundlePrice = calculateBundlePrice(bundle.products);
  const savingsPercentage = bundle.savings;
  const savingsAmount = individualPrice - bundlePrice;
  
  return {
    totalProducts,
    individualPrice,
    bundlePrice,
    savingsPercentage,
    savingsAmount
  };
};

// Get products info for bundles
export const getBundleProductsInfo = (bundle: Bundle) => {
  return bundle.products.map(bundleProduct => {
    const product = findProductById(bundleProduct.productId);
    return {
      ...bundleProduct,
      product
    };
  });
};

// Get all bundle categories
export const BUNDLE_CATEGORIES = Array.from(new Set(BUNDLES.map(bundle => bundle.category)));

// Filter bundles by category
export const filterBundlesByCategory = (category: string) => {
  if (category === 'All') {
    return BUNDLES;
  }
  return BUNDLES.filter(bundle => bundle.category === category);
};
