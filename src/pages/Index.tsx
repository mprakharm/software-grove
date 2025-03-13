
import React from 'react';
import Navigation from '@/components/Navigation';
import SoftwareCard from '@/components/SoftwareCard';
import { Percent, ListChecks, XCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

// Calculate and export category counts
export const CATEGORY_COUNTS = {
  "Productivity": 21,
  "Marketing": 19,
  "Finance": 18,
  "Support": 15,
  "Communication": 16,
  "AI & Automation": 17,
  "Automation": 29,
  "HR": 34,
  "Sales": 56,
};

// Mock data for the application
export const FEATURED_SOFTWARE = [
  // Productivity Category (21 apps)
  {
    id: "google-workspace",
    name: "Google Workspace",
    description: "Business email, calendar, meeting tools and more - everything you need to get work done.",
    category: "Productivity",
    price: "$6/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/2D88FF/ffffff?text=Google+Workspace",
    vendor: "Google",
    rating: 4.8,
    reviewCount: 2453,
    color: "#2D88FF"
  },
  {
    id: "notion",
    name: "Notion",
    description: "All-in-one workspace for notes, documents, wikis, projects, and collaboration.",
    category: "Productivity",
    price: "$8/mo",
    discount: "3%",
    image: "https://placehold.co/600x400/000000/ffffff?text=Notion",
    vendor: "Notion Labs",
    rating: 4.7,
    reviewCount: 1872,
    color: "#000000"
  },
  {
    id: "asana",
    name: "Asana",
    description: "Project management tool that helps teams organize, track, and manage their work.",
    category: "Productivity",
    price: "$10.99/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/F06A6A/ffffff?text=Asana",
    vendor: "Asana, Inc.",
    rating: 4.5,
    reviewCount: 2890,
    color: "#F06A6A"
  },
  {
    id: "jira",
    name: "Jira",
    description: "Issue and project tracking software for agile teams and software development.",
    category: "Productivity",
    price: "$7.75/mo",
    discount: "6%",
    image: "https://placehold.co/600x400/0052CC/ffffff?text=Jira",
    vendor: "Atlassian",
    rating: 4.5,
    reviewCount: 3420,
    color: "#0052CC"
  },
  {
    id: "o365",
    name: "Microsoft 365",
    description: "Productivity suite including Word, Excel, PowerPoint, and cloud services.",
    category: "Productivity",
    price: "$6/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/D83B01/ffffff?text=Microsoft+365",
    vendor: "Microsoft",
    rating: 4.6,
    reviewCount: 4350,
    color: "#D83B01"
  },
  {
    id: "evernote",
    name: "Evernote",
    description: "Note-taking app that helps you capture and prioritize ideas, projects, and to-do lists.",
    category: "Productivity",
    price: "$7.99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/00A82D/ffffff?text=Evernote",
    vendor: "Evernote Corporation",
    rating: 4.4,
    reviewCount: 3245,
    color: "#00A82D"
  },
  {
    id: "trello",
    name: "Trello",
    description: "Visual collaboration tool that creates a shared perspective on any project.",
    category: "Productivity",
    price: "$5/mo",
    discount: "7%",
    image: "https://placehold.co/600x400/0079BF/ffffff?text=Trello",
    vendor: "Atlassian",
    rating: 4.5,
    reviewCount: 2970,
    color: "#0079BF"
  },
  {
    id: "todoist",
    name: "Todoist",
    description: "Task management app that helps you organize and prioritize your projects.",
    category: "Productivity",
    price: "$3.99/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/E44332/ffffff?text=Todoist",
    vendor: "Doist",
    rating: 4.6,
    reviewCount: 2100,
    color: "#E44332"
  },
  {
    id: "monday",
    name: "Monday.com",
    description: "Work OS that powers teams to run processes, projects, and workflows in one digital workspace.",
    category: "Productivity",
    price: "$8/mo",
    discount: "15%",
    image: "https://placehold.co/600x400/FF3D57/ffffff?text=Monday.com",
    vendor: "monday.com",
    rating: 4.4,
    reviewCount: 2850,
    color: "#FF3D57"
  },
  {
    id: "clickup",
    name: "ClickUp",
    description: "All-in-one productivity platform that brings teams, tasks, and tools together.",
    category: "Productivity",
    price: "$5/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/7B68EE/ffffff?text=ClickUp",
    vendor: "ClickUp",
    rating: 4.5,
    reviewCount: 1980,
    color: "#7B68EE"
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Part spreadsheet, part database, and entirely flexible for organizing anything.",
    category: "Productivity",
    price: "$10/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/18BFFF/ffffff?text=Airtable",
    vendor: "Airtable",
    rating: 4.7,
    reviewCount: 2340,
    color: "#18BFFF"
  },
  {
    id: "slack",
    name: "Slack",
    description: "Business communication platform offering teams of all sizes message-based collaboration.",
    category: "Productivity",
    price: "$6.67/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/4A154B/ffffff?text=Slack",
    vendor: "Salesforce",
    rating: 4.7,
    reviewCount: 5670,
    color: "#4A154B"
  },
  {
    id: "miro",
    name: "Miro",
    description: "Online collaborative whiteboard platform designed for remote and distributed teams.",
    category: "Productivity",
    price: "$8/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/FFD02F/000000?text=Miro",
    vendor: "Miro",
    rating: 4.6,
    reviewCount: 2130,
    color: "#FFD02F"
  },
  {
    id: "figma",
    name: "Figma",
    description: "Collaborative interface design tool that enables team-based UI/UX design.",
    category: "Productivity",
    price: "$12/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/0ACF83/ffffff?text=Figma",
    vendor: "Figma, Inc.",
    rating: 4.8,
    reviewCount: 3240,
    color: "#0ACF83"
  },
  {
    id: "basecamp",
    name: "Basecamp",
    description: "Project management and team communication software for streamlined collaboration.",
    category: "Productivity",
    price: "$11/mo",
    discount: "7%",
    image: "https://placehold.co/600x400/1D2D35/ffffff?text=Basecamp",
    vendor: "Basecamp LLC",
    rating: 4.5,
    reviewCount: 2150,
    color: "#1D2D35"
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Cloud storage service for file sharing and collaboration across devices.",
    category: "Productivity",
    price: "$9.99/mo",
    discount: "6%",
    image: "https://placehold.co/600x400/0061FF/ffffff?text=Dropbox",
    vendor: "Dropbox, Inc.",
    rating: 4.6,
    reviewCount: 3180,
    color: "#0061FF"
  },
  {
    id: "box",
    name: "Box",
    description: "Cloud content management platform for secure file sharing and collaboration.",
    category: "Productivity",
    price: "$15/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/0061D5/ffffff?text=Box",
    vendor: "Box, Inc.",
    rating: 4.4,
    reviewCount: 1920,
    color: "#0061D5"
  },
  {
    id: "onedrive",
    name: "OneDrive",
    description: "Microsoft's cloud storage service for file sharing and access across devices.",
    category: "Productivity",
    price: "$5/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/0078D4/ffffff?text=OneDrive",
    vendor: "Microsoft",
    rating: 4.5,
    reviewCount: 2850,
    color: "#0078D4"
  },
  {
    id: "onenote",
    name: "OneNote",
    description: "Digital note-taking application that helps you organize ideas and information.",
    category: "Productivity",
    price: "$4/mo",
    discount: "3%",
    image: "https://placehold.co/600x400/7719AA/ffffff?text=OneNote",
    vendor: "Microsoft",
    rating: 4.5,
    reviewCount: 2240,
    color: "#7719AA"
  },
  {
    id: "grammarly",
    name: "Grammarly",
    description: "AI-powered writing assistant that helps with grammar, spelling, and style.",
    category: "Productivity",
    price: "$12/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/15C39A/ffffff?text=Grammarly",
    vendor: "Grammarly, Inc.",
    rating: 4.7,
    reviewCount: 3450,
    color: "#15C39A"
  },
  {
    id: "coda",
    name: "Coda",
    description: "Document platform combining the best of documents, spreadsheets, and applications.",
    category: "Productivity",
    price: "$10/mo",
    discount: "7%",
    image: "https://placehold.co/600x400/F46A54/ffffff?text=Coda",
    vendor: "Coda Inc.",
    rating: 4.5,
    reviewCount: 1480,
    color: "#F46A54"
  },
  
  // Marketing Category (19 apps)
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM platform with marketing, sales, service, and operations tools.",
    category: "Marketing",
    price: "$45/mo",
    discount: "12%",
    image: "https://placehold.co/600x400/FF7A59/ffffff?text=HubSpot",
    vendor: "HubSpot, Inc.",
    rating: 4.6,
    reviewCount: 3470,
    color: "#FF7A59"
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Marketing automation platform and email marketing service for managing mailing lists.",
    category: "Marketing",
    price: "$14.99/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/FFE01B/000000?text=Mailchimp",
    vendor: "Intuit",
    rating: 4.4,
    reviewCount: 2980,
    color: "#FFE01B"
  },
  {
    id: "semrush",
    name: "SEMrush",
    description: "SEO tools, keyword research, competitor analysis, and marketing insights.",
    category: "Marketing",
    price: "$119.95/mo",
    discount: "15%",
    image: "https://placehold.co/600x400/FF642D/ffffff?text=SEMrush",
    vendor: "SEMrush",
    rating: 4.5,
    reviewCount: 1890,
    color: "#FF642D"
  },
  {
    id: "ahrefs",
    name: "Ahrefs",
    description: "SEO tools to grow search traffic, research competitors, and monitor your niche.",
    category: "Marketing",
    price: "$99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/0095FF/ffffff?text=Ahrefs",
    vendor: "Ahrefs",
    rating: 4.7,
    reviewCount: 1790,
    color: "#0095FF"
  },
  {
    id: "hootsuite",
    name: "Hootsuite",
    description: "Social media management platform for scheduling posts and tracking performance.",
    category: "Marketing",
    price: "$49/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/143059/ffffff?text=Hootsuite",
    vendor: "Hootsuite Inc.",
    rating: 4.3,
    reviewCount: 2450,
    color: "#143059"
  },
  {
    id: "buffer",
    name: "Buffer",
    description: "Social media management software for scheduling posts across platforms.",
    category: "Marketing",
    price: "$15/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/2C4BFF/ffffff?text=Buffer",
    vendor: "Buffer",
    rating: 4.4,
    reviewCount: 1870,
    color: "#2C4BFF"
  },
  {
    id: "canva",
    name: "Canva",
    description: "Graphic design platform for creating social media graphics, presentations, and other visual content.",
    category: "Marketing",
    price: "$12.99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/00C4CC/ffffff?text=Canva",
    vendor: "Canva",
    rating: 4.7,
    reviewCount: 4350,
    color: "#00C4CC"
  },
  {
    id: "hotjar",
    name: "Hotjar",
    description: "Behavior analytics tools that make it easy to understand how users experience your website.",
    category: "Marketing",
    price: "$31/mo",
    discount: "7%",
    image: "https://placehold.co/600x400/FD3A5C/ffffff?text=Hotjar",
    vendor: "Hotjar",
    rating: 4.5,
    reviewCount: 1580,
    color: "#FD3A5C"
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Web analytics service that tracks and reports website traffic for digital marketing.",
    category: "Marketing",
    price: "$0/mo",
    discount: "0%",
    image: "https://placehold.co/600x400/F9AB00/ffffff?text=Google+Analytics",
    vendor: "Google",
    rating: 4.7,
    reviewCount: 5840,
    color: "#F9AB00"
  },
  {
    id: "sprout-social",
    name: "Sprout Social",
    description: "Social media management and optimization platform for businesses.",
    category: "Marketing",
    price: "$99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/75DD66/ffffff?text=Sprout+Social",
    vendor: "Sprout Social, Inc.",
    rating: 4.4,
    reviewCount: 1950,
    color: "#75DD66"
  },
  {
    id: "klaviyo",
    name: "Klaviyo",
    description: "Email marketing platform focused on ecommerce with advanced segmentation.",
    category: "Marketing",
    price: "$45/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/0A1424/ffffff?text=Klaviyo",
    vendor: "Klaviyo",
    rating: 4.6,
    reviewCount: 1870,
    color: "#0A1424"
  },
  {
    id: "convertkit",
    name: "ConvertKit",
    description: "Email marketing platform designed for creators and content publishers.",
    category: "Marketing",
    price: "$29/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/FB6970/ffffff?text=ConvertKit",
    vendor: "ConvertKit",
    rating: 4.5,
    reviewCount: 1450,
    color: "#FB6970"
  },
  {
    id: "active-campaign",
    name: "ActiveCampaign",
    description: "Integrated email marketing, marketing automation, and CRM platform.",
    category: "Marketing",
    price: "$15/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/356AE6/ffffff?text=ActiveCampaign",
    vendor: "ActiveCampaign",
    rating: 4.6,
    reviewCount: 2180,
    color: "#356AE6"
  },
  {
    id: "moz",
    name: "Moz Pro",
    description: "SEO software with keyword research, site audits, and link building tools.",
    category: "Marketing",
    price: "$99/mo",
    discount: "15%",
    image: "https://placehold.co/600x400/3EBBF9/ffffff?text=Moz+Pro",
    vendor: "Moz",
    rating: 4.4,
    reviewCount: 1560,
    color: "#3EBBF9"
  },
  {
    id: "optimizely",
    name: "Optimizely",
    description: "A/B testing and experimentation platform for data-driven marketing.",
    category: "Marketing",
    price: "$50/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/0037FF/ffffff?text=Optimizely",
    vendor: "Optimizely",
    rating: 4.5,
    reviewCount: 1340,
    color: "#0037FF"
  },
  {
    id: "unbounce",
    name: "Unbounce",
    description: "Landing page builder with A/B testing and conversion optimization tools.",
    category: "Marketing",
    price: "$90/mo",
    discount: "12%",
    image: "https://placehold.co/600x400/FF524A/ffffff?text=Unbounce",
    vendor: "Unbounce",
    rating: 4.4,
    reviewCount: 1280,
    color: "#FF524A"
  },
  {
    id: "bitly",
    name: "Bitly",
    description: "Link management platform for branded links, QR Codes, and link analytics.",
    category: "Marketing",
    price: "$29/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/EE6123/ffffff?text=Bitly",
    vendor: "Bitly",
    rating: 4.5,
    reviewCount: 1780,
    color: "#EE6123"
  },
  {
    id: "buzzsumo",
    name: "BuzzSumo",
    description: "Content marketing platform for content research, monitoring, and competitor analysis.",
    category: "Marketing",
    price: "$99/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/D43C1A/ffffff?text=BuzzSumo",
    vendor: "BuzzSumo",
    rating: 4.4,
    reviewCount: 980,
    color: "#D43C1A"
  },
  {
    id: "surveymonkey",
    name: "SurveyMonkey",
    description: "Online survey and questionnaire tool for market research and feedback.",
    category: "Marketing",
    price: "$25/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/00BF6F/ffffff?text=SurveyMonkey",
    vendor: "SurveyMonkey",
    rating: 4.5,
    reviewCount: 2240,
    color: "#00BF6F"
  },
  
  // Finance Category (18 apps)
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Accounting software for managing expenses, invoices, and financial reporting.",
    category: "Finance",
    price: "$25/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/2CA01C/ffffff?text=QuickBooks",
    vendor: "Intuit",
    rating: 4.3,
    reviewCount: 1830,
    color: "#2CA01C"
  },
  {
    id: "tally",
    name: "Tally",
    description: "Business management software for accounting, inventory management, and taxation.",
    category: "Finance",
    price: "$18/mo",
    discount: "4%",
    image: "https://placehold.co/600x400/262F91/ffffff?text=Tally",
    vendor: "Tally Solutions",
    rating: 4.2,
    reviewCount: 1240,
    color: "#262F91"
  },
  {
    id: "xero",
    name: "Xero",
    description: "Cloud-based accounting software for small and medium-sized businesses.",
    category: "Finance",
    price: "$22/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/13B5EA/ffffff?text=Xero",
    vendor: "Xero Limited",
    rating: 4.5,
    reviewCount: 2450,
    color: "#13B5EA"
  },
  {
    id: "freshbooks",
    name: "FreshBooks",
    description: "Cloud accounting software designed for small business owners and freelancers.",
    category: "Finance",
    price: "$15/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/0075DD/ffffff?text=FreshBooks",
    vendor: "FreshBooks",
    rating: 4.6,
    reviewCount: 1980,
    color: "#0075DD"
  },
  {
    id: "wave",
    name: "Wave",
    description: "Free accounting software for small businesses and freelancers with paid add-ons.",
    category: "Finance",
    price: "$0/mo",
    discount: "0%",
    image: "https://placehold.co/600x400/1387FF/ffffff?text=Wave",
    vendor: "Wave Financial",
    rating: 4.3,
    reviewCount: 1670,
    color: "#1387FF"
  },
  {
    id: "zoho-books",
    name: "Zoho Books",
    description: "Online accounting software that manages finances, automates workflows, and helps collaboration.",
    category: "Finance",
    price: "$10/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/E42527/ffffff?text=Zoho+Books",
    vendor: "Zoho Corporation",
    rating: 4.4,
    reviewCount: 1890,
    color: "#E42527"
  },
  {
    id: "sage",
    name: "Sage",
    description: "Business management software for accounting, payroll, payments, and more.",
    category: "Finance",
    price: "$25/mo",
    discount: "6%",
    image: "https://placehold.co/600x400/00D639/ffffff?text=Sage",
    vendor: "Sage Group",
    rating: 4.2,
    reviewCount: 1750,
    color: "#00D639"
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Online payment processing for internet businesses. API-first platform.",
    category: "Finance",
    price: "2.9% + $0.30",
    discount: "5%",
    image: "https://placehold.co/600x400/635BFF/ffffff?text=Stripe",
    vendor: "Stripe, Inc.",
    rating: 4.8,
    reviewCount: 3680,
    color: "#635BFF"
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Online payments system supporting money transfers and online payments.",
    category: "Finance",
    price: "2.9% + $0.30",
    discount: "0%",
    image: "https://placehold.co/600x400/003087/ffffff?text=PayPal",
    vendor: "PayPal Holdings, Inc.",
    rating: 4.5,
    reviewCount: 4750,
    color: "#003087"
  },
  {
    id: "expensify",
    name: "Expensify",
    description: "Expense management that automates receipt scanning, reimbursement, and expense reporting.",
    category: "Finance",
    price: "$4.99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/1A237E/ffffff?text=Expensify",
    vendor: "Expensify, Inc.",
    rating: 4.4,
    reviewCount: 1890,
    color: "#1A237E"
  },
  {
    id: "netsuite",
    name: "NetSuite",
    description: "Cloud-based business management suite offering ERP, accounting, CRM, and more.",
    category: "Finance",
    price: "$999/mo",
    discount: "15%",
    image: "https://placehold.co/600x400/395986/ffffff?text=NetSuite",
    vendor: "Oracle",
    rating: 4.3,
    reviewCount: 1560,
    color: "#395986"
  },
  {
    id: "bill",
    name: "Bill.com",
    description: "Cloud-based software platform that simplifies accounts payable and receivable.",
    category: "Finance",
    price: "$39/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/135CAB/ffffff?text=Bill.com",
    vendor: "Bill.com",
    rating: 4.4,
    reviewCount: 1340,
    color: "#135CAB"
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Payment gateway solution for businesses in India, with subscription management.",
    category: "Finance",
    price: "2.0% + ₹3",
    discount: "10%",
    image: "https://placehold.co/600x400/2D88FF/ffffff?text=Razorpay",
    vendor: "Razorpay",
    rating: 4.7,
    reviewCount: 2160,
    color: "#2D88FF"
  },
  {
    id: "square",
    name: "Square",
    description: "Payment processing and point-of-sale solutions for businesses of all sizes.",
    category: "Finance",
    price: "2.6% + $0.10",
    discount: "5%",
    image: "https://placehold.co/600x400/000000/ffffff?text=Square",
    vendor: "Block, Inc.",
    rating: 4.6,
    reviewCount: 2780,
    color: "#000000"
  },
  {
    id: "tipalti",
    name: "Tipalti",
    description: "Automated accounts payable and mass payment platform for global businesses.",
    category: "Finance",
    price: "$299/mo",
    discount: "12%",
    image: "https://placehold.co/600x400/0075C9/ffffff?text=Tipalti",
    vendor: "Tipalti",
    rating: 4.5,
    reviewCount: 780,
    color: "#0075C9"
  },
  {
    id: "chargebee",
    name: "Chargebee",
    description: "Subscription billing and revenue management platform for growing businesses.",
    category: "Finance",
    price: "$249/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/5C3BFE/ffffff?text=Chargebee",
    vendor: "Chargebee",
    rating: 4.6,
    reviewCount: 890,
    color: "#5C3BFE"
  },
  {
    id: "brex",
    name: "Brex",
    description: "Corporate credit cards and spend management platform for businesses.",
    category: "Finance",
    price: "$0/mo",
    discount: "0%",
    image: "https://placehold.co/600x400/002852/ffffff?text=Brex",
    vendor: "Brex",
    rating: 4.4,
    reviewCount: 720,
    color: "#002852"
  },
  {
    id: "recurly",
    name: "Recurly",
    description: "Subscription management and billing platform for recurring revenue businesses.",
    category: "Finance",
    price: "$199/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/4F46E5/ffffff?text=Recurly",
    vendor: "Recurly, Inc.",
    rating: 4.5,
    reviewCount: 950,
    color: "#4F46E5"
  },
];

// Home page component
const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Imageon Banner Section with Circuit Board Pattern */}
      <div className="relative bg-blue-600 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Circuit Board Pattern Background */}
        <div className="absolute inset-0 opacity-15">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20,0 L20,100 M40,0 L40,100 M60,0 L60,100 M80,0 L80,100 M0,20 L100,20 M0,40 L100,40 M0,60 L100,60 M0,80 L100,80" 
                    stroke="white" strokeWidth="1" fill="none" />
              <circle cx="20" cy="20" r="3" fill="white" />
              <circle cx="60" cy="20" r="3" fill="white" />
              <circle cx="20" cy="60" r="3" fill="white" />
              <circle cx="60" cy="60" r="3" fill="white" />
              <circle cx="40" cy="40" r="3" fill="white" />
              <circle cx="80" cy="40" r="3" fill="white" />
              <circle cx="40" cy="80" r="3" fill="white" />
              <circle cx="80" cy="80" r="3" fill="white" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Find the Perfect Software <br className="hidden sm:block" />
            for Your Business
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
            Browse thousands of business applications across all categories.
            Save time and money with our exclusive subscription deals.
          </p>
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative rounded-full shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                className="form-input block w-full pl-10 py-6 text-lg rounded-full"
                placeholder="Search for software, tools, and applications..."
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Subscription Benefits - Moved to above Categories */}
      <div className="bg-gray-50 py-16 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Save with Software Subscriptions
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Get exclusive deals when subscribing through our platform. 
              Manage all your software subscriptions in one place.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <Percent className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Save up to 20%</h3>
              <p className="mt-2 text-base text-gray-600">
                Get exclusive discounts on software subscriptions not available elsewhere.
              </p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <ListChecks className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Centralized Management</h3>
              <p className="mt-2 text-base text-gray-600">
                Manage all your software subscriptions from a single dashboard.
              </p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <XCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Hassle-free Cancellation</h3>
              <p className="mt-2 text-base text-gray-600">
                Cancel any subscription with one click, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Buttons - Moved after Subscription Benefits */}
      <div className="container mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(CATEGORY_COUNTS).map(([category, count]) => (
            <Link key={category} to={`/category/${category.toLowerCase()}`} className="group">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center text-center">
                <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {count} apps
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Featured Software */}
      <div className="container mx-auto mt-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Software
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURED_SOFTWARE.slice(0, 8).map((software) => (
            <SoftwareCard 
              key={software.id}
              id={software.id}
              name={software.name}
              description={software.description}
              category={software.category}
              price={software.price}
              discount={software.discount}
              image={software.image}
              vendor={software.vendor}
              rating={software.rating}
              reviewCount={software.reviewCount}
              color={software.color}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link 
            to="/category/all" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse All Software
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white mt-16 pt-12 pb-8 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Marketplace</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">About</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-500 text-center">
              &copy; 2023 Software Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
