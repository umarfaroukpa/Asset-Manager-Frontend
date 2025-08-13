import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Shield, FileText, Users, Database, Settings, ExternalLink,  Github, Twitter, Linkedin } from "lucide-react";
  
   
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Database className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Asset Manager</h3>
            </div>
            <p className="text-sm text-gray-400">
              Comprehensive asset management solution for individuals, organizations, 
              and enterprises. Track, manage, and optimize your assets with ease.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Live Demo
                </Link>
              </li>
              <li>
                <Link to="/integrations" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                  API Documentation
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Video Tutorials
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Community Forum
                </Link>
              </li>
              <li>
                <a href="mailto:support@assetmanager.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-400">
                <Mail className="w-4 h-4 mr-3" />
                <a href="mailto:hello@assetmanager.com" className="hover:text-white transition-colors">
                  hello@assetmanager.com
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Phone className="w-4 h-4 mr-3" />
                <a href="tel:+1-555-0123" className="hover:text-white transition-colors">
                  +1 (555) 012-3456
                </a>
              </div>
              <div className="flex items-start text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-3 mt-0.5" />
                <span>
                  123 Business Ave<br />
                  Suite 100<br />
                  Tech City, TC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              &copy; {currentYear} Asset Manager. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link to="/security" className="text-sm text-gray-400 hover:text-white transition-colors">
                Security
              </Link>
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">All systems operational</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Built with ❤️ using React, TypeScript, and Tailwind CSS. 
              Designed for scalability and security.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;