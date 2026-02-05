// Navigation data with dropdowns

export const productsMenu = [
  {
    name: 'Free Accessibility Checker',
    description: 'Free WCAG & ADA Compliance Checker',
    href: '/products/checker',
    isNew: true
  },
  {
    name: 'Widget',
    description: 'AI-Enhanced Accessibility for Your Website',
    href: '/products/widget'
  },
  {
    name: 'Audit',
    description: 'Audit for ADA & WCAG accessibility compliance',
    href: '/products/audit'
  },
  {
    name: 'Managed Accessibility',
    description: 'Redefining Accessibility Excellence',
    href: '/products/managed'
  },
  {
    name: 'Accessibility Monitor',
    description: 'Analyze, and Export accessibility issues with AI',
    href: '/products/monitor'
  },
  {
    name: 'Compare',
    description: 'Discover how WebAbility offers a better solution',
    href: '/products/compare'
  }
];

export const industriesMenu = [
  { name: 'Government', description: 'Make government websites accessible to all citizens', href: '/industries/government', icon: 'building' },
  { name: 'Banking', description: 'Ensure financial services are available to everyone', href: '/industries/banking', icon: 'landmark' },
  { name: 'Academic', description: 'Create inclusive educational environments', href: '/industries/academic', icon: 'graduation-cap' },
  { name: 'Retail', description: 'Build accessible shopping experiences', href: '/industries/retail', icon: 'shopping-cart' },
  { name: 'IT', description: 'Implement accessibility across digital platforms', href: '/industries/it', icon: 'code' },
  { name: 'HealthCare', description: 'Improve accessibility in healthcare services', href: '/industries/healthcare', icon: 'heart-pulse' },
  { name: 'Automotive', description: 'Ensure accessibility in automotive technology', href: '/industries/automotive', icon: 'car' },
  { name: 'Real Estate', description: 'Make real estate listings accessible to everyone', href: '/industries/real-estate', icon: 'home' },
  { name: 'NGO/NPO', description: 'Support accessibility for nonprofit organizations', href: '/industries/ngo', icon: 'hand-heart' },
  { name: 'Media & Entertainment', description: 'Provide inclusive media experience', href: '/industries/media', icon: 'tv' },
  { name: 'Law Enforcement', description: 'Ensure accessibility in public safety services', href: '/industries/law-enforcement', icon: 'shield' }
];

export const installationsMenu = [
  { name: 'Embed', description: "Embed WebAbility's code into any site", href: '/installation/embed', logo: 'code' },
  { name: 'WordPress', description: 'Installing WebAbility on WordPress', href: '/installation/wordpress', logo: 'wordpress' },
  { name: 'Custom', description: 'Install WebAbility on custom sites with ease', href: '/installation/custom', logo: 'settings' },
  { name: 'Wix', description: 'Integrate WebAbility on Wix', href: '/installation/wix', logo: 'wix' },
  { name: 'Weebly', description: 'Simple steps to add WebAbility to your Weebly site', href: '/installation/weebly', logo: 'weebly' },
  { name: 'Webflow', description: 'Guide to embedding WebAbility in Webflow', href: '/installation/webflow', logo: 'webflow' },
  { name: 'Volusion', description: 'Install WebAbility on your Volusion store', href: '/installation/volusion', logo: 'store' },
  { name: 'Squarespace', description: 'Integrate WebAbility with Squarespace', href: '/installation/squarespace', logo: 'squarespace' },
  { name: 'Shopify', description: 'Step-by-step instructions for Shopify integration', href: '/installation/shopify', logo: 'shopify' },
  { name: 'HubSpot', description: 'Install WebAbility on your HubSpot website', href: '/installation/hubspot', logo: 'hubspot' },
  { name: 'GTM', description: 'Add WebAbility using Google Tag Manager', href: '/installation/gtm', logo: 'tag' },
  { name: 'Duda', description: 'Embed WebAbility on your Duda site', href: '/installation/duda', logo: 'duda' },
  { name: 'Manage', description: 'Access plugin management settings', href: '/installation/manage', logo: 'settings-2' },
  { name: 'BigCommerce', description: 'Learn to integrate WebAbility on BigCommerce', href: '/installation/bigcommerce', logo: 'shopping-bag' },
  { name: 'Go High Level', description: 'Learn to integrate WebAbility on GoHighLevel', href: '/installation/gohighlevel', logo: 'rocket' },
  { name: 'Brilliant Directories', description: 'Learn to integrate WebAbility on Brilliant Directories', href: '/installation/brilliant', logo: 'folder' }
];

export const pricingPlans = [
  {
    name: 'Basic Protection',
    tier: 'Automated',
    price: '$12',
    period: '/month',
    description: 'Our basic plan for automation-only monitoring, fixes, and online support',
    cta: 'Start Free Trial',
    ctaType: 'primary',
    features: [
      'Automated tools',
      'Developer tools',
      'Continuous monitoring',
      'Accessibility Help Desk',
      'Self-paced, online learning platform'
    ],
    highlighted: false
  },
  {
    name: 'Self-Serviced Protection',
    tier: 'Self-Managed',
    price: 'Custom',
    period: '',
    description: 'Empower your developers to understand and build for accessibility at the source',
    cta: 'Schedule Demo',
    ctaType: 'secondary',
    features: [
      'Developer tools',
      'Certified expert guidance',
      'Custom training',
      'Accessibility scanner',
      'Expert Audit and reporting'
    ],
    highlighted: true
  },
  {
    name: 'Maximum Protection',
    tier: 'Managed',
    price: 'Custom',
    period: '',
    description: 'Let our team of experts get you compliant by handling everything for you',
    cta: 'Schedule Demo',
    ctaType: 'secondary',
    features: [
      'Automated tools',
      'Continuous monitoring',
      'Custom-written fixes for your site',
      'WebAbility Assurance*',
      'Expert Audit and reporting'
    ],
    highlighted: false
  }
];

export const featureComparison = {
  categories: [
    {
      name: 'Platform & Automation',
      features: [
        { name: 'Automated Monitoring', automated: true, selfManaged: true, managed: true },
        { name: 'Automated Fixes', automated: true, selfManaged: true, managed: true },
        { name: 'Accessibility Help Desk', automated: true, selfManaged: true, managed: true },
        { name: 'WebAbility Learning', automated: true, selfManaged: true, managed: true }
      ]
    },
    {
      name: 'Developer Tools',
      features: [
        { name: 'Developer Tools', automated: true, selfManaged: true, managed: true },
        { name: 'Expert Support', automated: false, selfManaged: true, managed: true }
      ]
    },
    {
      name: 'Developer Support & Guidance',
      features: [
        { name: 'Expert Audit & Reporting', automated: false, selfManaged: true, managed: true },
        { name: 'Custom Fixes', automated: false, selfManaged: false, managed: true },
        { name: 'Document Remediation', automated: false, selfManaged: false, managed: true }
      ]
    },
    {
      name: 'Legal Support',
      features: [
        { name: 'Included after purchasing Expert Audits & Custom Fixes', automated: false, selfManaged: false, managed: true }
      ]
    }
  ]
};
