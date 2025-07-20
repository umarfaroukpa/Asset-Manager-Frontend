import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

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
    if (item.