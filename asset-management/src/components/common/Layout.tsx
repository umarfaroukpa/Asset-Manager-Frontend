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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <h1 className="text-xl font-bold text-white">
            {organization?.name || 'Asset Manager'}
          </h1>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {filteredNavigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b lg:px-6">
          <button
            className="text-gray-500 hover:text-gray-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Welcome back, {user?.firstName}!
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>

  );
};

export default Layout;