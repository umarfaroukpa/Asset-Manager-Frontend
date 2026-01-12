import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, QrCode, Bell, Search,  Plus, ChevronRight,  Download, AlertCircle, CheckCircle,  DollarSign, Settings, HelpCircle, LogOut, User, Home} from 'lucide-react';
import { onAuthStateChange } from '../config/firebase.config';
import { getDashboardStats } from '../services/api';
import { AppUser } from '../types/auth.types';

interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  totalValue: number;
  recentActivity?: any[];
  assetsByCategory?: any[];
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      
      if (!user) {
        navigate('/');
        return;
      }
      
      fetchDashboardStats();
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch stats');
      }
      
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      setError(error.message || 'Failed to load dashboard data');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/assets?search=${searchQuery}`);
  };

  const handleLogout = async () => {
    // Implement logout logic
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    { label: 'Add asset', icon: <Plus className="w-4 h-4" />, onClick: () => navigate('/assets/new') },
    { label: 'Assign asset', icon: <Users className="w-4 h-4" />, onClick: () => navigate('/assets/assign') },
    { label: 'Generate report', icon: <Download className="w-4 h-4" />, onClick: () => navigate('/reports') },
    { label: 'Scan QR code', icon: <QrCode className="w-4 h-4" />, onClick: () => navigate('/scan') },
  ];

  const alerts = [
    { type: 'warning', message: '3 assets need maintenance', count: 3 },
    { type: 'info', message: '5 warranties expiring soon', count: 5 },
    { type: 'success', message: '2 new assets added', count: 2 },
  ];

  const recentActivities = [
    { action: 'MacBook Pro assigned', user: 'John Smith', time: '2 hours ago' },
    { action: 'Annual audit completed', user: 'Sarah Chen', time: '1 day ago' },
    { action: 'Projector maintenance scheduled', user: 'Alex Johnson', time: '2 days ago' },
    { action: 'New asset category added', user: 'You', time: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={handleHomeClick}
                className="flex items-center space-x-2 text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>AssetTracker</span>
              </button>
              <div className="hidden md:flex ml-10 space-x-8">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-blue-600 border-b-2 border-blue-600 pb-1"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate('/assets')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Assets
                </button>
                <button 
                  onClick={() => navigate('/reports')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Reports
                </button>
                <button 
                  onClick={() => navigate('/team')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Team
                </button>
                <button 
                  onClick={() => navigate('/settings')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Settings
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="search"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </form>
              
              <button 
                onClick={() => navigate('/notifications')}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium">{user.displayName || user.email?.split('@')[0]}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button 
                      onClick={() => navigate('/profile')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Your profile
                    </button>
                    <button 
                      onClick={() => navigate('/settings')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <button 
                      onClick={() => navigate('/help')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <HelpCircle className="w-4 h-4 mr-3" />
                      Help & support
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.displayName || user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your assets today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick actions</h2>
            <button 
              onClick={() => navigate('/assets')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all assets <ChevronRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                    {action.icon}
                  </div>
                </div>
                <div className="mt-4 text-left">
                  <div className="font-medium text-gray-900">{action.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats?.totalAssets || 0}
                </div>
                <div className="text-sm text-gray-600">Total assets</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mr-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats?.availableAssets || 0}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600 mr-4">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats?.assignedAssets || 0}
                </div>
                <div className="text-sm text-gray-600">Assigned</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mr-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${stats?.totalValue ? stats.totalValue.toLocaleString() : '0'}
                </div>
                <div className="text-sm text-gray-600">Total value</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alerts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Recent alerts</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          alert.type === 'info' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{alert.message}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {alert.count} items
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/alerts')}
                  className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-gray-200 rounded-lg hover:border-blue-300"
                >
                  View all alerts
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Recent activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="font-medium text-gray-900">{activity.action}</div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-gray-600">by {activity.user}</div>
                        <div className="text-sm text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/activity')}
                  className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  View full activity log
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Categories */}
        {stats?.assetsByCategory && stats.assetsByCategory.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Assets by category</h3>
                <button 
                  onClick={() => navigate('/categories')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Manage categories
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.assetsByCategory.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 mr-3">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-gray-600">{category.count} assets</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Need Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <HelpCircle className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Need help?</h3>
              <p className="text-blue-700 mb-4">
                Check out our documentation or contact support if you have any questions.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate('/docs')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View documentation
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Contact support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;