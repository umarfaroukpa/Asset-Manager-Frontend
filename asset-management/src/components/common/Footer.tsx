import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Shield, FileText, Users, Database, Settings, ExternalLink, Github, Twitter, Linkedin, MessageCircle } from "lucide-react";
  
   
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Database className="w-7 h-7 text-indigo-400" />
              <h3 className="text-xl font-semibold text-white">AssetTracker Pro</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Since 2019, we've helped over 15,000 companies streamline their asset management. 
              From startups to Fortune 500s, our platform scales with your business needs.
            </p>
            <div className="flex space-x-3">
              <a href="https://github.com/assettracker" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/assettrackerpro" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/assettracker" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-white">Solutions</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/enterprise" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Enterprise Suite
                </Link>
              </li>
              <li>
                <Link to="/small-business" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Small Business
                </Link>
              </li>
              <li>
                <Link to="/nonprofit" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Non-Profit Organizations
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Educational Institutions
                </Link>
              </li>
              <li>
                <Link to="/government" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Government & Public Sector
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  Developer API
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-white">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/knowledge-base" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/webinars" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Live Webinars
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Customer Stories
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Industry Blog
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  User Community
                </Link>
              </li>
              <li>
                <Link to="/status" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-white">Get Help</h4>
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                <strong className="text-white">Sales:</strong><br />
                <a href="tel:+1-415-555-0198" className="hover:text-white transition-colors duration-200">
                  (415) 555-0198
                </a>
              </div>
              <div className="text-sm text-gray-400">
                <strong className="text-white">Support:</strong><br />
                <a href="mailto:help@assettracker.io" className="hover:text-white transition-colors duration-200">
                  help@assettracker.io
                </a>
              </div>
              <div className="text-sm text-gray-400">
                <Link to="/support/chat" className="flex items-center hover:text-white transition-colors duration-200">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat Support
                </Link>
                <span className="text-xs text-gray-500">Mon-Fri, 6AM-6PM PST</span>
              </div>
              <div className="text-sm text-gray-400">
                <MapPin className="w-4 h-4 inline mr-2" />
                San Francisco, CA
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            
            {/* Left side - Copyright and certifications */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="text-sm text-gray-500">
                © {currentYear} AssetTracker Technologies, Inc.
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  SOC 2 Certified
                </span>
                <span>GDPR Compliant</span>
                <span>ISO 27001</span>
              </div>
            </div>

            {/* Right side - Legal links and status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                  Privacy
                </Link>
                <Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                  Terms
                </Link>
                <Link to="/cookie-policy" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                  Cookies
                </Link>
                <Link to="/accessibility" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                  Accessibility
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-xs text-gray-500">99.9% uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final bottom note */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="text-center">
            <p className="text-xs text-gray-600">
              Trusted by companies in 47 countries. Processing over 2.3M assets daily.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;