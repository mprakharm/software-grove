
interface ProductContent {
  overview: string;
  features: {
    name: string;
    description: string;
  }[];
}

type ProductsContentMap = {
  [productId: string]: ProductContent;
};

export const PRODUCT_CONTENT: ProductsContentMap = {
  "google-workspace": {
    overview: "A suite of cloud computing, productivity and collaboration tools for businesses of all sizes, including Gmail, Docs, Drive, Calendar, Meet, and more.",
    features: [
      {
        name: "Gmail for Business",
        description: "Professional email with your domain name and advanced security"
      },
      {
        name: "Google Drive",
        description: "Cloud storage with file sharing and real-time collaboration"
      },
      {
        name: "Google Docs",
        description: "Create and edit documents with real-time collaboration"
      },
      {
        name: "Google Meet",
        description: "Secure video meetings with screen sharing and recording capabilities"
      }
    ]
  },
  "linkedin-premium": {
    overview: "Premium subscription service by LinkedIn that offers advanced networking, job search, and professional development features.",
    features: [
      {
        name: "InMail Messages",
        description: "Send direct messages to anyone on LinkedIn, even if you're not connected"
      },
      {
        name: "Who's Viewed Your Profile",
        description: "See detailed insights about who's viewed your profile"
      },
      {
        name: "Applicant Insights",
        description: "Compare your skills and experience with other job applicants"
      },
      {
        name: "LinkedIn Learning",
        description: "Access to thousands of expert-led courses to develop your skills"
      }
    ]
  },
  "notion": {
    overview: "All-in-one workspace that combines notes, documents, wikis, and project management in a highly customizable platform.",
    features: [
      {
        name: "Databases",
        description: "Create custom databases to organize any type of information"
      },
      {
        name: "Pages & Wikis",
        description: "Build a knowledge base with nested pages and rich formatting"
      },
      {
        name: "Task Management",
        description: "Track projects with kanban boards, calendars, and lists"
      },
      {
        name: "Templates",
        description: "Start quickly with hundreds of pre-built templates for any use case"
      }
    ]
  },
  "asana": {
    overview: "Work management platform designed to help teams organize, track, and manage their work across projects.",
    features: [
      {
        name: "Project Management",
        description: "Create projects with lists, boards, timelines, and calendars"
      },
      {
        name: "Task Assignment",
        description: "Assign tasks, set due dates, and track progress"
      },
      {
        name: "Workflow Automation",
        description: "Automate routine processes with custom rules"
      },
      {
        name: "Reporting",
        description: "Get insights into team workload and project progress"
      }
    ]
  },
  "jira": {
    overview: "Issue and project tracking software designed primarily for software development teams to plan, track, and manage agile projects.",
    features: [
      {
        name: "Agile Boards",
        description: "Visualize work with customizable Scrum and Kanban boards"
      },
      {
        name: "Roadmaps",
        description: "Plan and track progress with visual project roadmaps"
      },
      {
        name: "Issue Tracking",
        description: "Create, assign, and track issues through the development lifecycle"
      },
      {
        name: "Reporting",
        description: "Generate detailed reports on team velocity and project status"
      }
    ]
  },
  "o365": {
    overview: "Subscription service that includes Office applications, cloud storage, and premium security features for businesses.",
    features: [
      {
        name: "Office Apps",
        description: "Access to Word, Excel, PowerPoint, and other Office applications"
      },
      {
        name: "OneDrive",
        description: "Cloud storage with file sharing and collaboration features"
      },
      {
        name: "Teams",
        description: "Communication platform with chat, video meetings, and file sharing"
      },
      {
        name: "Exchange",
        description: "Business email with calendar, contacts, and task management"
      }
    ]
  },
  "slack": {
    overview: "Channel-based messaging platform that connects teams with the people, information, and tools they need to get work done.",
    features: [
      {
        name: "Channels",
        description: "Organize conversations by topic, project, or team"
      },
      {
        name: "Integrations",
        description: "Connect with 2,000+ apps like Google Drive, Asana, and Zoom"
      },
      {
        name: "Huddles",
        description: "Quick audio conversations without formal meeting setups"
      },
      {
        name: "Search",
        description: "Find messages, files, and people across your workspace"
      }
    ]
  },
  "figma": {
    overview: "Collaborative interface design tool that enables teams to create, test, and ship better designs from start to finish.",
    features: [
      {
        name: "Design",
        description: "Create UI designs with powerful vector editing tools"
      },
      {
        name: "Prototyping",
        description: "Build interactive prototypes to simulate user flows"
      },
      {
        name: "Collaboration",
        description: "Edit designs simultaneously with real-time collaboration"
      },
      {
        name: "Design Systems",
        description: "Create and maintain consistent design libraries"
      }
    ]
  },
  "dropbox": {
    overview: "Cloud storage service that lets you store, share, and access files across devices and collaborate with teams.",
    features: [
      {
        name: "File Storage",
        description: "Securely store files in the cloud with automatic backup"
      },
      {
        name: "Sharing",
        description: "Share files and folders with custom permission settings"
      },
      {
        name: "Paper",
        description: "Collaborative document workspace for teams"
      },
      {
        name: "Dropbox Transfer",
        description: "Send large files securely to anyone"
      }
    ]
  },
  "hubspot": {
    overview: "All-in-one inbound marketing, sales, and service platform that helps businesses attract visitors, convert leads, and close customers.",
    features: [
      {
        name: "CRM",
        description: "Manage customer relationships with a free, powerful CRM system"
      },
      {
        name: "Marketing Hub",
        description: "Create, manage, and track marketing campaigns"
      },
      {
        name: "Sales Hub",
        description: "Close more deals with sales automation and pipeline management"
      },
      {
        name: "Service Hub",
        description: "Connect with customers and exceed expectations with help desk tools"
      }
    ]
  },
  "mailchimp": {
    overview: "Marketing automation platform and email marketing service for managing mailing lists and creating marketing campaigns.",
    features: [
      {
        name: "Email Campaigns",
        description: "Create and send professional marketing emails"
      },
      {
        name: "Audience Management",
        description: "Organize contacts and track engagement"
      },
      {
        name: "Marketing Automation",
        description: "Set up automated email sequences based on user behavior"
      },
      {
        name: "Analytics",
        description: "Track campaign performance with detailed reporting"
      }
    ]
  },
  "semrush": {
    overview: "Comprehensive SEO tool suite for digital marketers focused on keyword research, competitor analysis, and site audits.",
    features: [
      {
        name: "Keyword Research",
        description: "Find valuable keywords with search volume and difficulty metrics"
      },
      {
        name: "Site Audit",
        description: "Identify and fix technical SEO issues on your website"
      },
      {
        name: "Competitor Analysis",
        description: "Track competitors' strategies and performance"
      },
      {
        name: "Position Tracking",
        description: "Monitor your rankings for target keywords"
      }
    ]
  },
  "ahrefs": {
    overview: "SEO toolset focused on backlink analysis, keyword research, competitor analysis, and rank tracking.",
    features: [
      {
        name: "Site Explorer",
        description: "Analyze backlink profiles of any website"
      },
      {
        name: "Keywords Explorer",
        description: "Find keyword ideas with metrics like search volume and difficulty"
      },
      {
        name: "Content Explorer",
        description: "Discover top-performing content in your niche"
      },
      {
        name: "Rank Tracker",
        description: "Monitor your rankings across different search engines"
      }
    ]
  },
  "hootsuite": {
    overview: "Social media management platform that helps businesses manage multiple social networks and profiles.",
    features: [
      {
        name: "Content Scheduling",
        description: "Plan and schedule social media posts across platforms"
      },
      {
        name: "Social Inbox",
        description: "Manage all social messages in one unified inbox"
      },
      {
        name: "Analytics",
        description: "Track performance with customizable social media reports"
      },
      {
        name: "Team Management",
        description: "Collaborate with team members with role-based permissions"
      }
    ]
  },
  "canva": {
    overview: "Online graphic design platform that allows users to create social media graphics, presentations, posters, and other visual content.",
    features: [
      {
        name: "Templates",
        description: "Access thousands of professional templates for any design need"
      },
      {
        name: "Brand Kit",
        description: "Store brand colors, logos, and fonts for consistent designs"
      },
      {
        name: "Content Planner",
        description: "Schedule and publish designs directly to social media"
      },
      {
        name: "Canva Pro",
        description: "Access premium features like background remover and resize tools"
      }
    ]
  },
  "google-analytics": {
    overview: "Web analytics service that tracks and reports website traffic, user behavior, and conversion metrics.",
    features: [
      {
        name: "Audience Reports",
        description: "Understand who your visitors are and how they behave"
      },
      {
        name: "Acquisition Reports",
        description: "See where your traffic comes from"
      },
      {
        name: "Behavior Reports",
        description: "Analyze how users interact with your website"
      },
      {
        name: "Conversion Reports",
        description: "Track goals and ecommerce transactions"
      }
    ]
  },
  "convertkit": {
    overview: "Email marketing platform designed specifically for creators and online businesses.",
    features: [
      {
        name: "Visual Automation Builder",
        description: "Create complex email sequences with a visual editor"
      },
      {
        name: "Landing Pages",
        description: "Build custom opt-in pages to grow your email list"
      },
      {
        name: "Subscriber Tagging",
        description: "Organize subscribers with tags for targeted messaging"
      },
      {
        name: "Commerce",
        description: "Sell digital products and subscriptions directly to your audience"
      }
    ]
  },
  "quickbooks": {
    overview: "Accounting software package developed and marketed by Intuit, designed for small to medium-sized businesses.",
    features: [
      {
        name: "Invoicing",
        description: "Create and send professional invoices and track payments"
      },
      {
        name: "Expense Tracking",
        description: "Capture and categorize expenses automatically"
      },
      {
        name: "Tax Management",
        description: "Calculate and file taxes with built-in tax tools"
      },
      {
        name: "Financial Reporting",
        description: "Generate profit and loss statements, balance sheets, and more"
      }
    ]
  },
  "xero": {
    overview: "Cloud-based accounting software for small and medium-sized businesses that handles core accounting functions.",
    features: [
      {
        name: "Bank Reconciliation",
        description: "Connect bank accounts for automatic transaction imports"
      },
      {
        name: "Invoicing",
        description: "Create and send customizable invoices with online payment options"
      },
      {
        name: "Projects",
        description: "Track time, costs, and profitability on projects"
      },
      {
        name: "Multi-Currency",
        description: "Manage finances in multiple currencies"
      }
    ]
  },
  "freshbooks": {
    overview: "Cloud-based accounting software designed specifically for small business owners and freelancers.",
    features: [
      {
        name: "Time Tracking",
        description: "Track billable hours and add them to invoices"
      },
      {
        name: "Project Management",
        description: "Set budgets, track time, and communicate with clients"
      },
      {
        name: "Financial Reporting",
        description: "Generate professional reports for business insights"
      },
      {
        name: "Client Portal",
        description: "Provide clients with a secure portal to view and pay invoices"
      }
    ]
  },
  "stripe": {
    overview: "Online payment processing platform for internet businesses, handling billions of dollars every year for businesses of all sizes.",
    features: [
      {
        name: "Payment Processing",
        description: "Accept credit cards, digital wallets, and local payment methods"
      },
      {
        name: "Subscription Management",
        description: "Bill customers on a recurring basis"
      },
      {
        name: "Fraud Prevention",
        description: "Protect your business with advanced fraud detection tools"
      },
      {
        name: "Global Payments",
        description: "Accept payments in 135+ currencies"
      }
    ]
  },
  "paypal": {
    overview: "Online payment system that supports online money transfers and serves as an electronic alternative to traditional paper methods.",
    features: [
      {
        name: "Payment Acceptance",
        description: "Accept PayPal, credit cards, and local payment methods"
      },
      {
        name: "PayPal Checkout",
        description: "Streamlined checkout experience with higher conversion rates"
      },
      {
        name: "Invoicing",
        description: "Send professional invoices with integrated payment options"
      },
      {
        name: "Seller Protection",
        description: "Get protection against fraudulent transactions"
      }
    ]
  },
  "razorpay": {
    overview: "Payment gateway solution allowing Indian businesses to collect payments via credit card, debit card, net banking, UPI and popular mobile wallets.",
    features: [
      {
        name: "Payment Links",
        description: "Create and share payment links instantly"
      },
      {
        name: "Payment Pages",
        description: "Build branded payment pages without coding"
      },
      {
        name: "Subscriptions",
        description: "Set up and manage recurring billing"
      },
      {
        name: "Route",
        description: "Split payments automatically between multiple accounts"
      }
    ]
  }
};

// The remaining products can be added as needed based on the IDs used in your system
