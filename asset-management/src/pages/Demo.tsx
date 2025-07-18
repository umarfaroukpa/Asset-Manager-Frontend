import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Users,  BarChart2,  QrCode, Shield, Zap, CheckCircle, ArrowRight } from 'lucide-react';
 
  
  
  const LandingPage = () => {
  const features = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Asset Tracking",
      description: "Track all your physical and digital assets in one place"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Management",
      description: "Assign assets to team members with full accountability"
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Reporting",
      description: "Generate detailed reports for better decision making"
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "QR Code Scanning",
      description: "Quickly identify assets with our mobile scanning feature"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security",
      description: "Enterprise-grade security for your asset data"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Automation",
      description: "Set up alerts and reminders for maintenance and renewals"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals and small teams",
      features: [
        "Up to 50 assets",
        "Basic tracking",
        "Email support",
        "Mobile app access"
      ],
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Up to 500 assets",
        "Advanced reporting",
        "Priority support",
        "Team management"
      ],
      cta: "Start Free Trial",
      featured: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited assets",
        "Dedicated account manager",
        "API access",
        "Custom integrations"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Simple Asset Management for Everyone
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Track, manage, and optimize your assets with our intuitive platform. 
              Perfect for individuals, teams, and large organizations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started - Free Trial
              </Link>
              <Link
                to="/demo"
                className="px-8 py-3 border border-indigo-600 text-indigo-600 text-lg rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Live Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Assets
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to track and manage assets effectively
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Watch our quick demo to see how easy asset management can be
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="aspect-w-16 aspect-h-9">
              {/* Replace with your actual demo video */}
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Demo video coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. No hidden fees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl shadow-md overflow-hidden ${plan.featured ? 'ring-2 ring-indigo-500' : 'border border-gray-200'}`}
              >
                <div className={`p-6 ${plan.featured ? 'bg-indigo-600' : 'bg-white'}`}>
                  <h3 className={`text-lg font-medium ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`ml-1 text-lg font-medium ${plan.featured ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-2 ${plan.featured ? 'text-indigo-100' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>
                </div>
                <div className="bg-gray-50 px-6 py-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      to={plan.name === "Enterprise" ? "/contact" : "/register"}
                      className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium ${
                        plan.featured 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                          : 'bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      {plan.cta}
                      {!plan.featured && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join thousands of individuals and organizations managing their assets with our platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-indigo-600 text-lg rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started for Free
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border border-white text-white text-lg rounded-lg hover:bg-indigo-800 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;