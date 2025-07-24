import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/authcontext';
import { toast } from 'react-toastify';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, organization, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: '📊',
      permission: null,
    },
    {
      name: 'Assets',
      href: '/assets',
      icon: '📦',
      permission: 'view_assets',
    },
    {
      name: 'Create Asset',
      href: '/assets/create',
      icon: '➕',
      permission: 'create_assets',
    },
    {
      name: 'Staff Management',
      href: '/staff',
      icon: '👥',
      permission: 'manage_staff',
      roles: ['org_admin'],
    },
    {
      name: 'Organization',
      href: '/organization',
      icon: '🏢',
      permission: null,
      roles: ['org_admin'],
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: '👤',
      permission: null,
    },
  ];

  const canAccessItem = (item: any) => {
    // Check role requirements
    if (item.roles && !item.roles.includes(user?.role)) {
      return false;
    }
    
    // Check permission requirements
    if (item.permission && !user?.permissions?.includes(item.permission)) {
      return false;
    }
    
    return true;
  };

  const filteredNavigationItems = navigationItems.filter(canAccessItem);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header - only show if Header component exists */}
        <Header />
        
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b lg:px-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Welcome back, {user?.firstName}!
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;