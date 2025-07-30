import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Package, Users, BarChart2, QrCode, Shield, Zap, CheckCircle, ArrowRight, 
  Play, X, ChevronLeft, ChevronRight, Eye, User, Settings, TrendingUp, 
  Clock, Award, Star, DollarSign, Building2, Globe, ChevronDown, ChevronUp,
  Check, Plus, Minus
} from 'lucide-react';


interface DemoAccount{
  role: string;
  email: string;
  password: string;
}

interface User {
  // Defining your user properties 
  id: string;
  name: string;
  email: string;
  index: string | number;
  
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [expandedAsset, setExpandedAsset] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            const id = target.id || (target.dataset.animate as string);
            setVisibleCards(prev => ({ ...prev, [id]: true }));
            
            if (id === 'stats-section') {
              setTimeout(() => setStatsAnimated(true), 200);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Sample asset data with more variety and realism
  const sampleAssets = [
    {
      id: 1,
      name: "MacBook Pro M3 Max",
      category: "Laptops",
      status: "In Use",
      assignedTo: "John Smith",
      value: "$3,499",
      location: "Engineering - Floor 2",
      image: "💻",
      condition: "Excellent",
      purchaseDate: "2024-01-15",
      warranty: "3 years (expires 2027-01-14)",
      serialNumber: "C02XL0XXXXX1",
      notes: "Assigned to lead developer. Includes AppleCare+ coverage."
    },
    {
      id: 2,
      name: "4K Conference Room Projector",
      category: "AV Equipment",
      status: "Available",
      assignedTo: "Unassigned",
      value: "$1,299",
      location: "Conference Room A",
      image: "📽️",
      condition: "Good",
      purchaseDate: "2023-08-20",
      warranty: "2 years (expires 2025-08-19)",
      serialNumber: "EPSON12345XYZ",
      notes: "Needs annual bulb replacement. Last serviced 2024-02-15."
    },
    {
      id: 3,
      name: "Herman Miller Aeron Chair",
      category: "Furniture",
      status: "Maintenance",
      assignedTo: "Sarah Johnson",
      value: "$1,195",
      location: "Design Team - Floor 1",
      image: "🪑",
      condition: "Needs Repair",
      purchaseDate: "2022-05-10",
      warranty: "12 years (expires 2034-05-09)",
      serialNumber: "HM-AC-98765",
      notes: "Hydraulic lift not working. Repair scheduled for next week."
    }
  ];

  // Enhanced demo accounts with more detail
  const demoAccounts = [
    {
      role: "Admin",
      email: "admin@demo.com",
      password: "admin123",
      description: "Complete system control with advanced analytics, user management, and enterprise-grade security features",
      permissions: ["Full Asset Management", "User Administration", "Advanced Analytics", "System Configuration", "Audit Logs", "API Access"],
      features: ["Unlimited asset tracking", "Custom workflows", "Advanced reporting", "Integration management"],
      icon: <Settings className="w-5 h-5" />
    },
    {
      role: "Manager",
      email: "manager@demo.com",
      password: "manager123",
      description: "Departmental oversight with team management capabilities and detailed reporting for informed decision-making",
      permissions: ["Team Asset Management", "Department Reporting", "Asset Assignment", "Budget Tracking", "Maintenance Scheduling"],
      features: ["Department dashboard", "Team performance metrics", "Asset lifecycle tracking", "Approval workflows"],
      icon: <Users className="w-5 h-5" />
    },
    {
      role: "Employee",
      email: "employee@demo.com",
      password: "employee123",
      description: "Self-service portal for asset requests, status updates, and personal inventory management",
      permissions: ["View Assigned Assets", "Request New Assets", "Report Issues", "Update Asset Status", "Basic Reporting"],
      features: ["Personal asset dashboard", "Mobile check-in/out", "Maintenance requests", "Usage tracking"],
      icon: <User className="w-5 h-5" />
    }
  ];

  // Statistics data
  const stats = [
    { number: "50K+", label: "Assets Tracked", icon: <Package className="w-6 h-6" /> },
    { number: "2,500+", label: "Companies Trust Us", icon: <Building2 className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime Guarantee", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "24/7", label: "Expert Support", icon: <Clock className="w-6 h-6" /> }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "AssetManager transformed our inventory tracking. We reduced asset loss by 85% and saved $50K in the first year alone.",
      author: "Jennifer Martinez",
      title: "Operations Director",
      company: "TechFlow Industries",
      rating: 5,
      avatar: "JM"
    },
    {
      quote: "The mobile QR scanning feature is a game-changer. Our field teams can now track equipment in real-time effortlessly.",
      author: "David Chen",
      title: "Fleet Manager", 
      company: "Urban Construction",
      rating: 5,
      avatar: "DC"
    },
    {
      quote: "Finally, an asset management solution that doesn't require a PhD to operate. Intuitive, powerful, and cost-effective.",
      author: "Lisa Thompson",
      title: "IT Manager",
      company: "MedCore Solutions",
      rating: 5,
      avatar: "LT"
    }
  ];

  // Enhanced guided tour steps
  const tourSteps = [
    {
      title: "Welcome to the Future of Asset Management! 🚀",
      description: "Join 2,500+ companies who've revolutionized their asset tracking. This tour will show you exactly how to save time, money, and eliminate asset loss forever.",
      highlight: null
    },
    {
      title: "Powerful Features That Drive Results 💪",
      description: "From AI-powered analytics to mobile QR scanning, every feature is designed to maximize efficiency and minimize costs. See how our customers save an average of $47K annually.",
      highlight: "features"
    },
    {
      title: "Real Data, Real Results 📊",
      description: "Don't just imagine the possibilities - see them! Our sample data shows exactly how your assets will look, tracked down to the last detail with full audit trails.",
      highlight: "sample-data"
    },
    {
      title: "Role-Based Access That Works 🔐",
      description: "Every team member gets exactly the right level of access. From C-suite dashboards to employee self-service, security and usability go hand-in-hand.",
      highlight: "demo-accounts"
    },
    {
      title: "Pricing That Scales With You 💰",
      description: "Start small, grow big. Our flexible pricing means you only pay for what you need, when you need it. Most customers see ROI within 3 months.",
      highlight: "pricing"
    },
    {
      title: "Ready to Transform Your Business? ✨",
      description: "Join thousands of successful companies already using AssetManager. Start your free trial today - no credit card required!",
      highlight: "cta"
    }
  ];

  // FAQ Data
  const faqs = [
    {
      question: "How quickly can I get started with AssetManager?",
      answer: "Most customers are up and running in under 15 minutes. Our intuitive setup wizard guides you through the process, and you can import existing asset data via CSV or Excel. For enterprise deployments, our team provides onboarding assistance.",
      icon: <Clock className="w-5 h-5 text-indigo-600" />
    },
    {
      question: "What if I need to cancel my subscription?",
      answer: "You can cancel anytime with no penalties. We'll even help you export all your data in standard formats (CSV, Excel, PDF) so you can take it with you. Our 90-day money-back guarantee means no risk to try us out.",
      icon: <DollarSign className="w-5 h-5 text-indigo-600" />
    },
    {
      question: "How secure is my asset data?",
      answer: "We use enterprise-grade security including AES-256 encryption, SOC 2 compliance, and regular third-party audits. Your data is backed up in multiple geographically distributed locations with 99.999% durability.",
      icon: <Shield className="w-5 h-5 text-indigo-600" />
    },
    {
      question: "Can I try before I buy?",
      answer: "Absolutely! All plans come with a 30-day free trial with full access to all features. No credit card required. You can also request a personalized demo with our product experts.",
      icon: <Star className="w-5 h-5 text-indigo-600" />
    },
    {
      question: "What integrations do you support?",
      answer: "AssetManager integrates with over 50 business tools including QuickBooks, Salesforce, Jira, Slack, and Microsoft Teams. Our open API allows for custom integrations with any system.",
      icon: <Zap className="w-5 h-5 text-indigo-600" />
    },
    {
      question: "Do you offer discounts for non-profits or education?",
      answer: "Yes! We provide special pricing for educational institutions and registered non-profit organizations. Contact our sales team with proof of status to receive up to 40% off our standard pricing.",
      icon: <Award className="w-5 h-5 text-indigo-600" />
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };



  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setShowTour(false);
      setTourStep(0);
    }
  };

  const prevTourStep = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const startTour = () => {
    setShowTour(true);
    setTourStep(0);
  };

  const handleDemoLogin = (account: DemoAccount) => {
    alert(`🎉 Logging in as ${account.role}...\n\n📧 Email: ${account.email}\n🔑 Password: ${account.password}\n\nThis demo would redirect you to a fully functional ${account.role} dashboard with all the features you just saw!`);
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

  const features = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Smart Asset Tracking",
      description: "AI-powered categorization and real-time location tracking with predictive maintenance alerts",
      benefit: "Reduce asset loss by 85%"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Role-based permissions with seamless assignment workflows and accountability tracking",
      benefit: "Boost team productivity 40%"
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Executive dashboards with ROI tracking, utilization metrics, and cost optimization insights",
      benefit: "Save $47K annually on average"
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "Mobile QR Scanning",
      description: "Lightning-fast asset identification with offline capability and bulk check-in/out",
      benefit: "60% faster asset audits"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "SOC 2 compliant with encryption at rest and in transit, plus complete audit trails",
      benefit: "100% compliance ready"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Workflow Automation",
      description: "Smart alerts for maintenance, renewals, and compliance with customizable approval chains",
      benefit: "Reduce manual work by 70%"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for small teams getting started",
      savings: "Save $2,000 annually vs. spreadsheets",
      features: [
        "Up to 50 assets tracked",
        "Mobile QR code scanning",
        "Basic reporting dashboard",
        "Email support",
        "Asset assignment workflows"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For growing businesses serious about asset management",
      savings: "Average customer saves $47K annually",
      features: [
        "Up to 500 assets tracked",
        "Advanced analytics & ROI tracking",
        "Custom workflows & approvals",
        "Priority support + training",
        "Integration with 50+ tools"
      ],
      cta: "Start Free Trial",
      featured: true,
      badge: "Most Popular"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Unlimited scale with dedicated success management",
      savings: "Fortune 500 companies save $500K+ annually",
      features: [
        "Unlimited assets & users",
        "Dedicated customer success manager",
        "Custom integrations & API",
        "Advanced security & compliance",
        "White-label options available"
      ],
      cta: "Schedule Demo"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation with enhanced styling */}
      <nav className="flex justify-between items-center mb-8 px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer transform hover:scale-105 transition-transform duration-200">
          Asset Manager 
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={startTour}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 font-medium"
          >
            <Play className="w-4 h-4" />
            <span>Take the Tour</span>
          </button>
          <button
            onClick={() => handleNavigation('/login')}
            className="px-6 py-2 text-indigo-700 hover:text-indigo-900 transition-colors duration-200 font-medium cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => handleNavigation('/register')}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
          >
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-indigo-800 font-semibold text-sm mb-6 animate-bounce">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Trusted by 2,500+ companies worldwide
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in">
              Stop Losing Assets.<br />
              <span className="text-indigo-600">Start Saving Money.</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4 animate-fade-in-up">
              The #1 asset management platform that helps companies <strong>save $47K annually</strong> while reducing asset loss by 85%. 
              Join industry leaders who've transformed their operations.
            </p>
            
            <p className="text-lg text-indigo-600 font-semibold mb-8 animate-fade-in-up delay-200">
              🚀 Start free trial • 💳 No credit card needed • ✅ Setup in 5 minutes
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-fade-in-up delay-300">
              <button
                onClick={() => handleNavigation('/register')}
                className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-bold"
              >
                Start Free Trial →
              </button>
              <button
                onClick={() => setShowDemoAccounts(true)}
                className="px-10 py-4 border-2 border-indigo-600 text-indigo-600 text-xl rounded-full hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 font-bold"
              >
                Watch Live Demo
              </button>
            </div>
            
            {/* Demo Features */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12 animate-fade-in-up delay-400">
              <button
                id="sample-data"
                onClick={() => setShowSampleData(true)}
                className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-3 font-semibold ${
                  showTour && tourSteps[tourStep]?.highlight === 'sample-data' ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <Eye className="w-5 h-5" />
                <span>🎯 Explore Sample Data</span>
              </button>
              <button
                id="demo-accounts"
                onClick={() => setShowDemoAccounts(true)}
                className={`px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-3 font-semibold ${
                  showTour && tourSteps[tourStep]?.highlight === 'demo-accounts' ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <User className="w-5 h-5" />
                <span>👥 Try Demo Accounts</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats-section" 
        data-animate
        className="py-16 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 delay-${index * 100} ${
                  visibleCards['stats-section'] 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl mb-4 text-indigo-600">
                  {stat.icon}
                </div>
                <div className={`text-4xl font-bold text-gray-900 mb-2 ${
                  statsAnimated ? 'animate-pulse' : ''
                }`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section 
        id="features"
        data-animate
        className={`py-20 bg-gradient-to-br from-gray-50 to-indigo-50 ${showTour && tourSteps[tourStep]?.highlight === 'features' ? 'ring-4 ring-yellow-400 ring-inset' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Why Companies Choose AssetManager
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Every feature is designed with one goal: <strong>maximize your ROI</strong>. 
              See how our customers achieve an average 312% return on investment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group ${
                  visibleCards['features'] 
                    ? `animate-fade-in-up delay-${index * 100}` 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-800 font-semibold text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        data-animate
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See why 2,500+ companies trust AssetManager with their most valuable assets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100 transform transition-all duration-700 hover:scale-105 ${
                  visibleCards['testimonials'] 
                    ? `animate-fade-in-up delay-${index * 200}` 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-600 text-sm">{testimonial.title}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Data Modal */}
      {showSampleData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Sample Asset Data</h3>
                <button 
                  onClick={() => setShowSampleData(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {sampleAssets.map(asset => (
                  <div key={asset.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleAssetExpand(asset.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{asset.image}</div>
                        <div>
                          <h4 className="font-bold text-gray-900">{asset.name}</h4>
                          <div className="text-sm text-gray-500">
                            {asset.category} • {asset.status} • {asset.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{asset.value}</div>
                          <div className="text-xs text-gray-500">Value</div>
                        </div>
                        {expandedAsset === asset.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    {expandedAsset === asset.id && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 font-medium">Assigned To</div>
                            <div>{asset.assignedTo}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-medium">Condition</div>
                            <div className="capitalize">{asset.condition}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-medium">Purchase Date</div>
                            <div>{asset.purchaseDate}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-medium">Warranty</div>
                            <div>{asset.warranty}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-medium">Serial Number</div>
                            <div>{asset.serialNumber}</div>
                          </div>
                        </div>
                        {asset.notes && (
                          <div className="mt-4">
                            <div className="text-gray-500 font-medium">Notes</div>
                            <div className="italic">{asset.notes}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                <h4 className="font-bold text-indigo-800 mb-3">This is just a sample!</h4>
                <p className="text-gray-700 mb-4">
                  Your real dashboard would show all your assets with complete details, 
                  maintenance history, and powerful management tools.
                </p>
                <button
                  onClick={() => {
                    setShowSampleData(false);
                    setShowDemoAccounts(true);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Try Demo Accounts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Accounts Modal */}
      {showDemoAccounts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Try Demo Accounts</h3>
                <button 
                  onClick={() => setShowDemoAccounts(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {demoAccounts.map((account, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                      account.role === 'Admin' ? 'border-indigo-300 bg-indigo-50' :
                      account.role === 'Manager' ? 'border-purple-300 bg-purple-50' :
                      'border-pink-300 bg-pink-50'
                    }`}
                    onClick={() => handleDemoLogin(account)}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        account.role === 'Admin' ? 'bg-indigo-100 text-indigo-600' :
                        account.role === 'Manager' ? 'bg-purple-100 text-purple-600' :
                        'bg-pink-100 text-pink-600'
                      }`}>
                        {account.icon}
                      </div>
                      <h4 className="font-bold text-gray-900 capitalize">{account.role}</h4>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">{account.description}</p>
                    
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 font-medium mb-1">PERMISSIONS</div>
                      <div className="space-y-2">
                        {account.permissions.slice(0, 3).map((perm, i) => (
                          <div key={i} className="flex items-center">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm">{perm}</span>
                          </div>
                        ))}
                        {account.permissions.length > 3 && (
                          <div className="text-xs text-gray-500">
                            + {account.permissions.length - 3} more permissions
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center mt-6">
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          account.role === 'Admin' ? 'bg-indigo-600 text-white hover:bg-indigo-700' :
                          account.role === 'Manager' ? 'bg-purple-600 text-white hover:bg-purple-700' :
                          'bg-pink-600 text-white hover:bg-pink-700'
                        }`}
                      >
                        Login as {account.role}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-3">What to expect in the demo:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Pre-loaded with realistic sample assets across multiple categories</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Full functionality based on your selected role</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Interactive dashboard with real data visualizations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Try all features with no restrictions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Pricing Section */}
      <section 
        id="pricing"
        data-animate
        className={`py-20 bg-gradient-to-br from-gray-50 to-indigo-50 ${showTour && tourSteps[tourStep]?.highlight === 'pricing' ? 'ring-4 ring-yellow-400 ring-inset' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Choose Your Success Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Every plan includes our 90-day money-back guarantee. Most customers see ROI within 3 months.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-800 font-bold">
              <Award className="w-5 h-5 mr-2" />
              30-day free trial • No setup fees • Cancel anytime
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 ${
                  plan.featured 
                    ? 'ring-4 ring-indigo-500 bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative' 
                    : 'border-2 border-gray-200 bg-white'
                } ${
                  visibleCards['pricing'] 
                    ? `animate-fade-in-up delay-${index * 200}` 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold">
                      {plan.badge}
                    </div>
                  </div>
                )}
                
                <div className={`p-8 ${plan.featured ? '' : 'bg-white'}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-4 flex items-baseline">
                    <span className={`text-5xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`ml-2 text-xl font-medium ${plan.featured ? 'text-indigo-100' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mb-4 ${plan.featured ? 'text-indigo-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-6 ${
                    plan.featured 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                  }`}>
                    <DollarSign className="w-4 h-4 mr-1" />
                    {plan.savings}
                  </div>
                </div>
                
                <div className={`px-8 pb-8 ${plan.featured ? '' : 'bg-gray-50'}`}>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className={`flex-shrink-0 h-6 w-6 ${
                          plan.featured ? 'text-white' : 'text-green-500'
                        } mt-0.5 mr-3`} />
                        <span className={`${plan.featured ? 'text-indigo-100' : 'text-gray-700'} leading-relaxed`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleNavigation(plan.name === "Enterprise" ? '/contact' : '/register')}
                    className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      plan.featured 
                        ? 'bg-white text-indigo-600 hover:bg-gray-100 hover:shadow-lg' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
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

      {/* FAQ Section */}
      <section 
        data-animate
        className="py-20 bg-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about AssetManager
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${
                  faqOpen[index] ? 'bg-gray-50' : ''
                }`}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      {faq.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  {faqOpen[index] ? (
                    <Minus className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-indigo-600" />
                  )}
                </button>
                
                {faqOpen[index] && (
                  <div className="px-6 pb-6 ml-14">
                    <div className="text-gray-600">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        id="cta"
        data-animate
        className={`py-20 bg-gradient-to-br from-indigo-700 to-purple-700 ${showTour && tourSteps[tourStep]?.highlight === 'cta' ? 'ring-4 ring-yellow-400 ring-inset' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Asset Management?
          </h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Join thousands of companies who've reduced asset loss by 85% and saved an average of $47K annually.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={() => handleNavigation('/register')}
              className="px-10 py-4 bg-white text-indigo-600 text-xl rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-bold"
            >
              Start Free Trial →
            </button>
            <button
              onClick={() => setShowDemoAccounts(true)}
              className="px-10 py-4 border-2 border-white text-white text-xl rounded-full hover:bg-indigo-800 transition-all duration-300 transform hover:scale-105 font-bold"
            >
              Try Interactive Demo
            </button>
          </div>
          
          <div className="text-indigo-200 text-sm">
            <p className="mb-2">No credit card required • 30-day free trial • Cancel anytime</p>
            <p>Need help deciding? <button className="underline hover:text-white">Contact our sales team</button></p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-3">
                <li><button className="hover:text-white">Features</button></li>
                <li><button className="hover:text-white">Pricing</button></li>
                <li><button className="hover:text-white">Demo</button></li>
                <li><button className="hover:text-white">Roadmap</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><button className="hover:text-white">Documentation</button></li>
                <li><button className="hover:text-white">API Reference</button></li>
                <li><button className="hover:text-white">Community</button></li>
                <li><button className="hover:text-white">Status</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-3">
                <li><button className="hover:text-white">About</button></li>
                <li><button className="hover:text-white">Careers</button></li>
                <li><button className="hover:text-white">Blog</button></li>
                <li><button className="hover:text-white">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Connect</h4>
              <div className="flex space-x-4 mb-4">
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-sm">
                © {new Date().getFullYear()} AssetManager Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Guided Tour Overlay */}
      {showTour && (
        <div className="fixed inset-0 z-50">
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
          
          {/* Tour content */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-medium text-indigo-600">
                    Step {tourStep + 1} of {tourSteps.length}
                  </div>
                  <button 
                    onClick={() => setShowTour(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {tourSteps[tourStep].title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {tourSteps[tourStep].description}
                </p>
                
                <div className="flex justify-between">
                  <button
                    onClick={prevTourStep}
                    disabled={tourStep === 0}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      tourStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back
                  </button>
                  
                  <button
                    onClick={nextTourStep}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center"
                  >
                    {tourStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="h-1 bg-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${(tourStep + 1) / tourSteps.length * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;