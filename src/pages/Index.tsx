import React from 'react';
import Navigation from '@/components/Navigation';
import SoftwareCard from '@/components/SoftwareCard';
import { Search } from 'lucide-react';
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
    discount: "8%",
    image: "https://placehold.co/600x400/1EA6E4/ffffff?text=Recurly",
    vendor: "Recurly",
    rating: 4.5,
    reviewCount: 650,
    color: "#1EA6E4"
  },
  
  // Support Category (15 apps)
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Customer service software and support ticket system for better customer relationships.",
    category: "Support",
    price: "$49/mo",
    discount: "4%",
    image: "https://placehold.co/600x400/03363D/ffffff?text=Zendesk",
    vendor: "Zendesk Inc.",
    rating: 4.5,
    reviewCount: 1564,
    color: "#03363D"
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Customer messaging platform for support, engagement, and conversion.",
    category: "Support",
    price: "$39/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/1F8DED/ffffff?text=Intercom",
    vendor: "Intercom Inc.",
    rating: 4.6,
    reviewCount: 2180,
    color: "#1F8DED"
  },
  {
    id: "helpscout",
    name: "Help Scout",
    description: "Customer service software that helps businesses value customer relationships.",
    category: "Support",
    price: "$20/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/1292EE/ffffff?text=Help+Scout",
    vendor: "Help Scout",
    rating: 4.5,
    reviewCount: 1450,
    color: "#1292EE"
  },
  {
    id: "freshdesk",
    name: "Freshdesk",
    description: "Customer support software that helps streamline customer conversations.",
    category: "Support",
    price: "$15/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/A5ACB1/ffffff?text=Freshdesk",
    vendor: "Freshworks",
    rating: 4.4,
    reviewCount: 1980,
    color: "#A5ACB1"
  },
  {
    id: "live-agent",
    name: "Salesforce Service Cloud",
    description: "Customer service software that adapts to your business needs.",
    category: "Support",
    price: "$75/mo",
    discount: "12%",
    image: "https://placehold.co/600x400/00A1E0/ffffff?text=Service+Cloud",
    vendor: "Salesforce",
    rating: 4.5,
    reviewCount: 2350,
    color: "#00A1E0"
  },
  {
    id: "livechat",
    name: "LiveChat",
    description: "Live chat software and help desk software for customer service teams.",
    category: "Support",
    price: "$19/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/FF5100/ffffff?text=LiveChat",
    vendor: "LiveChat, Inc.",
    rating: 4.5,
    reviewCount: 1670,
    color: "#FF5100"
  },
  {
    id: "hubspot-service",
    name: "HubSpot Service Hub",
    description: "Customer service software to help teams deliver connected customer experiences.",
    category: "Support",
    price: "$50/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/FF7A59/ffffff?text=HubSpot+Service",
    vendor: "HubSpot, Inc.",
    rating: 4.4,
    reviewCount: 1890,
    color: "#FF7A59"
  },
  {
    id: "kayako",
    name: "Kayako",
    description: "Customer service software that helps you deliver personalized customer service.",
    category: "Support",
    price: "$30/mo",
    discount: "7%",
    image: "https://placehold.co/600x400/4EBC70/ffffff?text=Kayako",
    vendor: "Kayako",
    rating: 4.1,
    reviewCount: 1250,
    color: "#4EBC70"
  },
  {
    id: "aircall",
    name: "Aircall",
    description: "Cloud-based call center and phone system for support and sales teams.",
    category: "Support",
    price: "$30/mo",
    discount: "6%",
    image: "https://placehold.co/600x400/00B388/ffffff?text=Aircall",
    vendor: "Aircall",
    rating: 4.3,
    reviewCount: 1120,
    color: "#00B388"
  },
  {
    id: "gorgias",
    name: "Gorgias",
    description: "Help desk specifically designed for e-commerce businesses.",
    category: "Support",
    price: "$50/mo",
    discount: "9%",
    image: "https://placehold.co/600x400/7540EE/ffffff?text=Gorgias",
    vendor: "Gorgias",
    rating: 4.5,
    reviewCount: 980,
    color: "#7540EE"
  },
  {
    id: "re-amaze",
    name: "Re:amaze",
    description: "Customer messaging and helpdesk platform for sales, marketing, and support.",
    category: "Support",
    price: "$29/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/3BC77B/ffffff?text=Re:amaze",
    vendor: "Re:amaze",
    rating: 4.2,
    reviewCount: 650,
    color: "#3BC77B"
  },
  {
    id: "kustomer",
    name: "Kustomer",
    description: "CRM platform for customer service teams to deliver personalized experiences.",
    category: "Support",
    price: "$89/mo",
    discount: "15%",
    image: "https://placehold.co/600x400/3530D7/ffffff?text=Kustomer",
    vendor: "Facebook",
    rating: 4.4,
    reviewCount: 780,
    color: "#3530D7"
  },
  {
    id: "front",
    name: "Front",
    description: "Customer communication platform that combines emails, apps, and teammates.",
    category: "Support",
    price: "$19/mo",
    discount: "7%",
    image: "https://placehold.co/600x400/4F384F/ffffff?text=Front",
    vendor: "Front",
    rating: 4.5,
    reviewCount: 890,
    color: "#4F384F"
  },
  {
    id: "gladly",
    name: "Gladly",
    description: "Customer service platform that puts people at the center of every conversation.",
    category: "Support",
    price: "$75/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/FF5C35/ffffff?text=Gladly",
    vendor: "Gladly",
    rating: 4.3,
    reviewCount: 540,
    color: "#FF5C35"
  },
  {
    id: "dixa",
    name: "Dixa",
    description: "Customer friendship platform unifying customer service across channels.",
    category: "Support",
    price: "$59/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/5468FF/ffffff?text=Dixa",
    vendor: "Dixa",
    rating: 4.4,
    color: "#5468FF"
  },
  
  // Communication Category (16 apps)
  {
    id: "zoom",
    name: "Zoom",
    description: "Video conferencing, online meetings, and group messaging in one platform.",
    category: "Communication",
    price: "$14.99/mo",
    discount: "7%",
    image: "https://placehold.co/600x400/2D8CFF/ffffff?text=Zoom",
    vendor: "Zoom Video Communications",
    rating: 4.6,
    reviewCount: 3560,
    color: "#2D8CFF"
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Business communication platform with messaging, meetings, files and apps.",
    category: "Communication",
    price: "$4/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/6264A7/ffffff?text=Microsoft+Teams",
    vendor: "Microsoft",
    rating: 4.5,
    reviewCount: 4250,
    color: "#6264A7"
  },
  {
    id: "google-meet",
    name: "Google Meet",
    description: "Video conferencing solution for businesses, integrated with Google Workspace.",
    category: "Communication",
    price: "$6/mo",
    discount: "3%",
    image: "https://placehold.co/600x400/00897B/ffffff?text=Google+Meet",
    vendor: "Google",
    rating: 4.6,
    reviewCount: 3850,
    color: "#00897B"
  },
  {
    id: "cisco-webex",
    name: "Cisco Webex",
    description: "Video conferencing, online meetings, screen sharing, and webinars.",
    category: "Communication",
    price: "$13.50/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/049FD9/ffffff?text=Cisco+Webex",
    vendor: "Cisco",
    rating: 4.4,
    reviewCount: 2750,
    color: "#049FD9"
  },
  {
    id: "discord",
    name: "Discord",
    description: "Voice, video, and text communication platform for communities and teams.",
    category: "Communication",
    price: "$9.99/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/5865F2/ffffff?text=Discord",
    vendor: "Discord Inc.",
    rating: 4.7,
    reviewCount: 5320,
    color: "#5865F2"
  },
  {
    id: "ringcentral",
    name: "RingCentral",
    description: "Cloud-based phone, message, and video conferencing system for businesses.",
    category: "Communication",
    price: "$19.99/mo",
    discount: "15%",
    image: "https://placehold.co/600x400/F80094/ffffff?text=RingCentral",
    vendor: "RingCentral, Inc.",
    rating: 4.4,
    reviewCount: 1980,
    color: "#F80094"
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "Communication APIs for SMS, voice, video, and authentication.",
    category: "Communication",
    price: "Pay as you go",
    discount: "5%",
    image: "https://placehold.co/600x400/F22F46/ffffff?text=Twilio",
    vendor: "Twilio Inc.",
    rating: 4.6,
    reviewCount: 2340,
    color: "#F22F46"
  },
  {
    id: "mattermost",
    name: "Mattermost",
    description: "Open-source, self-hosted alternative to Slack with enterprise features.",
    category: "Communication",
    price: "$10/mo",
    discount: "7%",
    image: "https://placehold.co/600x400/0072C6/ffffff?text=Mattermost",
    vendor: "Mattermost, Inc.",
    rating: 4.3,
    reviewCount: 1150,
    color: "#0072C6"
  },
  {
    id: "whereby",
    name: "Whereby",
    description: "Video meetings with no downloads or logins for participants.",
    category: "Communication",
    price: "$9.99/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/FF2E63/ffffff?text=Whereby",
    vendor: "Whereby",
    rating: 4.4,
    reviewCount: 875,
    color: "#FF2E63"
  },
  {
    id: "flock",
    name: "Flock",
    description: "Team communication and collaboration platform with messaging, video calls, and more.",
    category: "Communication",
    price: "$4.50/mo",
    discount: "6%",
    image: "https://placehold.co/600x400/00B1EA/ffffff?text=Flock",
    vendor: "Directi",
    rating: 4.2,
    reviewCount: 780,
    color: "#00B1EA"
  },
  {
    id: "3cx",
    name: "3CX",
    description: "Business phone system with video conferencing, messaging, and mobile apps.",
    category: "Communication",
    price: "$16/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/95C11F/ffffff?text=3CX",
    vendor: "3CX",
    rating: 4.3,
    reviewCount: 950,
    color: "#95C11F"
  },
  {
    id: "telegram",
    name: "Telegram Business",
    description: "Cloud-based messaging app with enhanced security and business features.",
    category: "Communication",
    price: "$3.99/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/0088CC/ffffff?text=Telegram",
    vendor: "Telegram FZ-LLC",
    rating: 4.6,
    reviewCount: 2850,
    color: "#0088CC"
  },
  {
    id: "signal",
    name: "Signal for Business",
    description: "Secure, end-to-end encrypted messaging platform for business communication.",
    category: "Communication",
    price: "$4.99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/3A76F0/ffffff?text=Signal",
    vendor: "Signal Foundation",
    rating: 4.7,
    reviewCount: 1750,
    color: "#3A76F0"
  },
  {
    id: "vonage",
    name: "Vonage Business",
    description: "Cloud communications platform for voice, messaging, and video communications.",
    category: "Communication",
    price: "$19.99/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/FF8F1C/ffffff?text=Vonage",
    vendor: "Vonage",
    rating: 4.3,
    reviewCount: 1420,
    color: "#FF8F1C"
  },
  {
    id: "cloudtalk",
    name: "CloudTalk",
    description: "Cloud-based call center software for sales and support teams.",
    category: "Communication",
    price: "$25/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/00A5FF/ffffff?text=CloudTalk",
    vendor: "CloudTalk",
    rating: 4.4,
    reviewCount: 670,
    color: "#00A5FF"
  },
  {
    id: "grasshopper",
    name: "Grasshopper",
    description: "Virtual phone system for entrepreneurs and small businesses.",
    category: "Communication",
    price: "$26/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/659F3D/ffffff?text=Grasshopper",
    vendor: "LogMeIn",
    rating: 4.2,
    reviewCount: 890,
    color: "#659F3D"
  },
  
  // AI & Automation Category (17 apps)
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "AI-powered language model for generating human-like text and conversations.",
    category: "AI & Automation",
    price: "$20/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/10A37F/ffffff?text=ChatGPT",
    vendor: "OpenAI",
    rating: 4.9,
    reviewCount: 5230,
    color: "#10A37F"
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    description: "Answer engine that delivers comprehensive, accurate responses backed by sources.",
    category: "AI & Automation",
    price: "$20/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/5436DA/ffffff?text=Perplexity",
    vendor: "Perplexity Labs",
    rating: 4.7,
    reviewCount: 1840,
    color: "#5436DA"
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automation tool that connects your apps and automates workflows without coding.",
    category: "AI & Automation",
    price: "$19.99/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/FF4A00/ffffff?text=Zapier",
    vendor: "Zapier, Inc.",
    rating: 4.7,
    reviewCount: 2540,
    color: "#FF4A00"
  },
  {
    id: "jasper",
    name: "Jasper",
    description: "AI copywriting assistant for businesses to create content faster.",
    category: "AI & Automation",
    price: "$49/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/FF7A2F/ffffff?text=Jasper",
    vendor: "Jasper",
    rating: 4.6,
    reviewCount: 1980,
    color: "#FF7A2F"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "AI-powered tool that generates images from natural language descriptions.",
    category: "AI & Automation",
    price: "$30/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/000000/ffffff?text=Midjourney",
    vendor: "Midjourney, Inc.",
    rating: 4.8,
    reviewCount: 2450,
    color: "#000000"
  },
  {
    id: "claude",
    name: "Claude",
    description: "AI assistant for text generation, summarization, and content creation.",
    category: "AI & Automation",
    price: "$20/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/8A6DFF/ffffff?text=Claude",
    vendor: "Anthropic",
    rating: 4.7,
    reviewCount: 1560,
    color: "#8A6DFF"
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    description: "AI-powered copywriting tool that generates marketing copy, emails, and more.",
    category: "AI & Automation",
    price: "$36/mo",
    discount: "12%",
    image: "https://placehold.co/600x400/2A2AF5/ffffff?text=Copy.ai",
    vendor: "Copy.ai",
    rating: 4.5,
    reviewCount: 1240,
    color: "#2A2AF5"
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "AI community platform providing tools to build, train and deploy ML models.",
    category: "AI & Automation",
    price: "$20/mo",
    discount: "7%",
    image: "https://placehold.co/600x400/FFD21E/000000?text=Hugging+Face",
    vendor: "Hugging Face",
    rating: 4.6,
    reviewCount: 890,
    color: "#FFD21E"
  },
  {
    id: "n8n",
    name: "n8n",
    description: "Workflow automation tool with fair-code licensing model for connecting apps and APIs.",
    category: "AI & Automation",
    price: "$20/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/FF6D00/ffffff?text=n8n",
    vendor: "n8n.io",
    rating: 4.4,
    reviewCount: 760,
    color: "#FF6D00"
  },
  {
    id: "make",
    name: "Make (Integromat)",
    description: "Visual platform to design, build, and automate workflows between apps and services.",
    category: "AI & Automation",
    price: "$16/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/1F193D/ffffff?text=Make",
    vendor: "Make",
    rating: 4.5,
    reviewCount: 1120,
    color: "#1F193D"
  },
  {
    id: "dalle",
    name: "DALL-E",
    description: "AI system that creates realistic images and art from natural language descriptions.",
    category: "AI & Automation",
    price: "$15/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/10A37F/ffffff?text=DALL-E",
    vendor: "OpenAI",
    rating: 4.8,
    reviewCount: 1850,
    color: "#10A37F"
  },
  {
    id: "otter-ai",
    name: "Otter.ai",
    description: "Speech to text transcription service powered by AI for meetings and conversations.",
    category: "AI & Automation",
    price: "$16.99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/6269F1/ffffff?text=Otter.ai",
    vendor: "Otter.ai",
    rating: 4.5,
    reviewCount: 1340,
    color: "#6269F1"
  },
  {
    id: "synthesia",
    name: "Synthesia",
    description: "AI video generation platform to create professional videos with virtual avatars.",
    category: "AI & Automation",
    price: "$30/mo",
    discount: "8%",
    image: "https://placehold.co/600x400/536DFE/ffffff?text=Synthesia",
    vendor: "Synthesia",
    rating: 4.6,
    reviewCount: 790,
    color: "#536DFE"
  },
  {
    id: "levity",
    name: "Levity",
    description: "AI platform that automates document processing and image classification.",
    category: "AI & Automation",
    price: "$299/mo",
    discount: "15%",
    image: "https://placehold.co/600x400/4A23FF/ffffff?text=Levity",
    vendor: "Levity AI",
    rating: 4.3,
    reviewCount: 480,
    color: "#4A23FF"
  },
  {
    id: "runway",
    name: "Runway",
    description: "Creative toolkit powered by AI for video editing and content creation.",
    category: "AI & Automation",
    price: "$15/mo",
    discount: "5%",
    image: "https://placehold.co/600x400/000000/ffffff?text=Runway",
    vendor: "Runway AI",
    rating: 4.7,
    reviewCount: 560,
    color: "#000000"
  },
  {
    id: "databricks",
    name: "Databricks",
    description: "Unified analytics platform for big data processing and machine learning.",
    category: "AI & Automation",
    price: "$99/mo",
    discount: "10%",
    image: "https://placehold.co/600x400/FF3621/ffffff?text=Databricks",
    vendor: "Databricks",
    rating: 4.5,
    reviewCount: 780,
    color: "#FF3621"
  },
  {
    id: "dataiku",
    name: "Dataiku",
    description: "Enterprise AI and machine learning platform for data science teams.",
    category: "AI & Automation",
    price: "$149/mo",
    discount: "12%",
    image: "https://placehold.co/600x400/2AB1AC/ffffff?text=Dataiku",
    vendor: "Dataiku",
    rating: 4.4,
    reviewCount: 520,
    color: "#2AB1AC"
  },
];

export const CATEGORIES = [
  { name: "Productivity", count: CATEGORY_COUNTS.Productivity },
  { name: "Marketing", count: CATEGORY_COUNTS.Marketing },
  { name: "Finance", count: CATEGORY_COUNTS.Finance },
  { name: "Support", count: CATEGORY_COUNTS.Support },
  { name: "Communication", count: CATEGORY_COUNTS.Communication },
  { name: "AI & Automation", count: CATEGORY_COUNTS["AI & Automation"] },
  { name: "Automation", count: CATEGORY_COUNTS.Automation },
  { name: "HR", count: CATEGORY_COUNTS.HR },
  { name: "Sales", count: CATEGORY_COUNTS.Sales },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-razorpay-lightgray">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section - Change background color to #2950DA */}
        <section className="bg-[#2950DA] border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 text-left text-white animate-fade-up mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Essential Business Software at Exclusive Prices
                </h1>
                <p className="text-white/90 text-lg mb-8">
                  Find, manage, and optimize all your business software in one place.
                </p>
                <div className="relative max-w-xl">
                  <Input 
                    type="search" 
                    placeholder="Search for software (e.g., 'CRM', 'Accounting', 'Email')" 
                    className="pl-12 pr-4 h-12 text-lg rounded-md border-white border-2 bg-white/10 backdrop-blur-sm focus-visible:ring-white text-white placeholder:text-white/70"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                </div>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <img 
                  src="/lovable-uploads/97ab01bd-fcd1-4430-a732-eb75dcf82497.png" 
                  alt="Connected Business Ecosystem" 
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-razorpay-lightblue p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-razorpay-navy">Simplify your business toolkit</h3>
                <p className="text-razorpay-gray">
                  Discover, purchase, and manage essential business software at exclusive discounts—all in one place.
                </p>
              </div>
              <div className="bg-razorpay-lightblue p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-razorpay-navy">Save valuable time</h3>
                <p className="text-razorpay-gray">
                  Access all your business tools through a single dashboard—no more juggling multiple accounts and renewal dates.
                </p>
              </div>
              <div className="bg-razorpay-lightblue p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-razorpay-navy">Scale confidently</h3>
                <p className="text-razorpay-gray">
                  Leverage our collective purchasing power to access premium software that grows with your business needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 text-razorpay-navy">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center animate-fade-up transform transition-transform hover:-translate-y-1 border-l-4 border-razorpay-blue"
              >
                <h3 className="font-medium mb-1 text-razorpay-navy">{category.name}</h3>
                <span className="text-sm text-razorpay-gray">{category.count} apps</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Software */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-razorpay-navy">Featured Software</h2>
            <Link to="/category/all" className="text-razorpay-blue hover:underline">
              View all
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_SOFTWARE.slice(0, 6).map((software) => (
              <SoftwareCard key={software.id} {...software} />
            ))}
          </div>
          
          {/* Recently Added Software */}
          <div className="flex items-center justify-between mb-8 mt-16">
            <h2 className="text-2xl font-semibold text-razorpay-navy">Recently Added</h2>
            <Link to="/category/all" className="text-razorpay-blue hover:underline">
              View all
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_SOFTWARE.slice(6, 12).map((software) => (
              <SoftwareCard key={software.id} {...software} />
            ))}
          </div>
        </section>

        {/* Razorpay Branding Footer */}
        <footer className="bg-razorpay-navy py-12 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold">Razorpay Nexus</h3>
                </div>
                <p className="mt-2 text-white/70 max-w-md">
                  Simplifying software discovery and management for businesses of all sizes.
                </p>
              </div>
              <div className="text-white/70 text-sm">
                <p>© 2023 Razorpay. All rights reserved.</p>
                <p>A Razorpay initiative for businesses.</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
