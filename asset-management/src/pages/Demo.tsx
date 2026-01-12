import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Package, Users, BarChart2, QrCode, Shield, Zap, CheckCircle, ArrowRight,
  Play, X, ChevronLeft, ChevronRight, Eye, User, Settings, TrendingUp,
  Clock, Award, Star, DollarSign, Building2, Globe, ChevronDown, ChevronUp,
  Check, Plus, Minus, Menu, Search, Bell, HelpCircle, Download,
  Smartphone, Monitor, Server, Cpu, HardDrive, Printer
} from 'lucide-react';

interface DemoAccount {
  role: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  index: string | number;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const [expandedAsset, setExpandedAsset] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sample asset data
  const sampleAssets = [
    {
      id: 1,
      name: "MacBook Pro M3 Max",
      category: "Laptops",
      status: "In Use",
      assignedTo: "John Smith",
      value: "$3,499",
      location: "Engineering",
      image: "💻",
      condition: "Excellent",
      purchaseDate: "Jan 15, 2024",
      warranty: "3 years",
      serialNumber: "C02XL0XXXXX1",
    },
    {
      id: 2,
      name: "4K Conference Projector",
      category: "AV Equipment",
      status: "Available",
      assignedTo: "Unassigned",
      value: "$1,299",
      location: "Conference Room A",
      image: "📽️",
      condition: "Good",
      purchaseDate: "Aug 20, 2023",
      warranty: "2 years",
      serialNumber: "EPSON12345XYZ",
    },
    {
      id: 3,
      name: "Herman Miller Chair",
      category: "Furniture",
      status: "Maintenance",
      assignedTo: "Sarah Johnson",
      value: "$1,195",
      location: "Design Team",
      image: "🪑",
      condition: "Needs Repair",
      purchaseDate: "May 10, 2022",
      warranty: "12 years",
      serialNumber: "HM-AC-98765",
    }
  ];

  const demoAccounts = [
    {
      role: "Admin",
      email: "admin@demo.com",
      password: "demo123",
      description: "Full system control with advanced analytics",
      icon: <Settings className="w-5 h-5" />
    },
    {
      role: "Manager",
      email: "manager@demo.com",
      password: "demo123",
      description: "Team oversight with reporting capabilities",
      icon: <Users className="w-5 h-5" />
    },
    {
      role: "Employee",
      email: "employee@demo.com",
      password: "demo123",
      description: "Self-service asset management",
      icon: <User className="w-5 h-5" />
    }
  ];

  const stats = [
    { number: "50K+", label: "Assets Tracked" },
    { number: "2,500+", label: "Companies" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  const testimonials = [
    {
      quote: "Reduced asset loss by 85% and saved $50K in the first year.",
      author: "Jennifer Martinez",
      title: "Operations Director",
      company: "TechFlow Industries",
      avatar: "JM"
    },
    {
      quote: "Our field teams can now track equipment in real-time effortlessly.",
      author: "David Chen",
      title: "Fleet Manager",
      company: "Urban Construction",
      avatar: "DC"
    },
    {
      quote: "Intuitive, powerful, and cost-effective. Exactly what we needed.",
      author: "Lisa Thompson",
      title: "IT Manager",
      company: "MedCore Solutions",
      avatar: "LT"
    }
  ];

  const features = [
    {
      icon: <Package className="w-5 h-5" />,
      title: "Asset Tracking",
      description: "Track and manage all your assets in one place with real-time updates",
    },
    {
      icon: <QrCode className="w-5 h-5" />,
      title: "QR Scanning",
      description: "Quick check-in/out with mobile scanning and offline capability",
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      title: "Analytics",
      description: "Understand usage patterns and optimize asset allocation",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Team Management",
      description: "Assign assets and manage permissions across your organization",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for small teams",
      features: [
        "Up to 50 assets",
        "Basic reporting",
        "Mobile scanning",
        "Email support"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Up to 500 assets",
        "Advanced analytics",
        "Custom workflows",
        "Priority support"
      ],
      cta: "Start Free Trial",
      featured: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Unlimited scale",
      features: [
        "Unlimited assets",
        "Dedicated support",
        "Custom integrations",
        "Advanced security"
      ],
      cta: "Contact Sales"
    }
  ];

  const faqs = [
    {
      question: "How quickly can we get started?",
      answer: "Most teams are set up in under 15 minutes. Import existing data via CSV or Excel, or start fresh with our simple setup wizard."
    },
    {
      question: "Can we cancel anytime?",
      answer: "Yes, cancel anytime with no penalties. We'll help export your data in standard formats if you decide to leave."
    },
    {
      question: "How secure is our data?",
      answer: "We use enterprise-grade security including encryption, regular backups, and compliance with industry standards."
    },
    {
      question: "Do you offer a free trial?",
      answer: "All plans include a 30-day free trial with full access to features. No credit card required to start."
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleDemoLogin = (account: DemoAccount) => {
    alert(`Logging in as ${account.role}\nEmail: ${account.email}\nPassword: ${account.password}`);
  };

  const toggleAssetExpand = (id: number) => {
    setExpandedAsset(expandedAsset === id ? null : id);
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div 
                className="text-xl font-semibold text-gray-900 cursor-pointer"
                onClick={() => navigate('/')}
              >
                AssetTracker
              </div>
              <div className="hidden md:flex ml-10 space-x-8">
                <button 
                  onClick={() => navigate('/features')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Features
                </button>
                <button 
                  onClick={() => navigate('/pricing')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => navigate('/customers')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Customers
                </button>
                <button 
                  onClick={() => navigate('/docs')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Docs
                </button>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-gray-900"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get started free
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/features')}
                  className="block w-full text-left text-gray-700 hover:text-gray-900 py-2"
                >
                  Features
                </button>
                <button 
                  onClick={() => navigate('/pricing')}
                  className="block w-full text-left text-gray-700 hover:text-gray-900 py-2"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => navigate('/customers')}
                  className="block w-full text-left text-gray-700 hover:text-gray-900 py-2"
                >
                  Customers
                </button>
                <button 
                  onClick={() => navigate('/docs')}
                  className="block w-full text-left text-gray-700 hover:text-gray-900 py-2"
                >
                  Documentation
                </button>
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="block w-full text-left text-gray-700 hover:text-gray-900 py-2"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get started free
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Keep track of what matters
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AssetTracker helps teams manage equipment, reduce loss, and save time.
            Simple enough for small teams, powerful enough for large organizations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start free trial
            </button>
            <button
              onClick={() => setShowDemoAccounts(true)}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              View live demo
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-sm text-gray-500">AssetTracker Dashboard</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleAssets.map(asset => (
                  <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">{asset.image}</div>
                      <div>
                        <div className="font-medium text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.category}</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className="font-medium">{asset.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Value</span>
                        <span className="font-medium">{asset.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location</span>
                        <span className="font-medium">{asset.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built for teams that need to track equipment, manage inventory, and maintain compliance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What our customers say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-medium text-gray-700 mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.title} • {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-600">
              Start free, upgrade when you need to.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg border ${plan.featured ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}
              >
                {plan.featured && (
                  <div className="bg-blue-500 text-white text-sm font-medium py-2 text-center rounded-t-lg">
                    Most popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleNavigation(plan.name === "Enterprise" ? '/contact' : '/register')}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      plan.featured 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  {faqOpen[index] ? (
                    <Minus className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {faqOpen[index] && (
                  <div className="p-4 pt-0">
                    <div className="text-gray-600 border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who use AssetTracker to manage their equipment and assets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Start free trial
            </button>
            <button
              onClick={() => setShowDemoAccounts(true)}
              className="px-8 py-3 border border-white text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Schedule a demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/features')} className="hover:text-white">Features</button></li>
                <li><button onClick={() => navigate('/pricing')} className="hover:text-white">Pricing</button></li>
                <li><button onClick={() => navigate('/demo')} className="hover:text-white">Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/docs')} className="hover:text-white">Documentation</button></li>
                <li><button onClick={() => navigate('/guides')} className="hover:text-white">Guides</button></li>
                <li><button onClick={() => navigate('/api')} className="hover:text-white">API</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/about')} className="hover:text-white">About</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white">Blog</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button></li>
                <li><button onClick={() => navigate('/security')} className="hover:text-white">Security</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-sm">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                © {new Date().getFullYear()} AssetTracker. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <button className="hover:text-white">Twitter</button>
                <button className="hover:text-white">LinkedIn</button>
                <button className="hover:text-white">GitHub</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Accounts Modal */}
      {showDemoAccounts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Try demo accounts</h3>
                <button 
                  onClick={() => setShowDemoAccounts(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {demoAccounts.map((account, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => handleDemoLogin(account)}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 mr-3">
                        {account.icon}
                      </div>
                      <h4 className="font-medium text-gray-900">{account.role}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{account.description}</p>
                    <div className="text-sm">
                      <div className="text-gray-500">Email: {account.email}</div>
                      <div className="text-gray-500">Password: {account.password}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;