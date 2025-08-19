import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowUpCircle, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  Check,
  Clock,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CheckoutFlow from '../CheckoutFlow';
import paymentService from '../../services/paymentService';
import { toast } from 'react-toastify';

interface SubscriptionWidgetProps {
  showUpgradePrompt?: boolean;
  compact?: boolean;
}

interface UserSubscription {
  id: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  billingCycle: 'monthly' | 'annual';
  currentPeriodEnd: string;
  assetCount: number;
  userCount: number;
  amount: number;
  daysUntilRenewal: number;
  usageStats: {
    assetsUsed: number;
    usersUsed: number;
    storageUsed: number;
  };
}

const SubscriptionWidget: React.FC<SubscriptionWidgetProps> = ({ 
  showUpgradePrompt = true, 
  compact = false 
}) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockSubscription: UserSubscription = {
        id: 'sub_123',
        plan: 'professional',
        status: 'active',
        billingCycle: 'monthly',
        currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        assetCount: 1000,
        userCount: 20,
        amount: 45000,
        daysUntilRenewal: 15,
        usageStats: {
          assetsUsed: 750,
          usersUsed: 12,
          storageUsed: 2.1
        }
      };
      
      setSubscription(mockSubscription);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount / 100);
  };

  const getUsagePercentage = (used: number, total: number) => {
    return Math.min((used / total) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'professional': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'enterprise': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const shouldShowUpgradePrompt = () => {
    if (!subscription || !showUpgradePrompt) return false;
    
    const assetsUsage = getUsagePercentage(subscription.usageStats.assetsUsed, subscription.assetCount);
    const usersUsage = getUsagePercentage(subscription.usageStats.usersUsed, subscription.userCount);
    
    return assetsUsage >= 80 || usersUsage >= 80;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-4">
            Upgrade to unlock premium features and manage more assets
          </p>
          <Button
            variant="primary"
            onClick={() => setShowUpgradeModal(true)}
            icon={<ArrowUpCircle className="w-4 h-4" />}
          >
            Choose a Plan
          </Button>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPlanBadgeColor(subscription.plan)}`}>
                  {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                </span>
                <span className="text-sm text-gray-600">
                  {formatCurrency(subscription.amount)}/{subscription.billingCycle}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Renews in {subscription.daysUntilRenewal} days
              </p>
            </div>
          </div>
          <Link to="/subscription">
            <Button variant="secondary" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
            <Link to="/subscription">
              <Button variant="secondary" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPlanBadgeColor(subscription.plan)}`}>
                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
              </span>
              {subscription.status === 'active' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="w-3 h-3 mr-1" />
                  Active
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(subscription.amount)}
              </p>
              <p className="text-sm text-gray-500">per {subscription.billingCycle}</p>
            </div>
          </div>

          {/* Renewal Info */}
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              Renews in {subscription.daysUntilRenewal} days 
              ({new Date(subscription.currentPeriodEnd).toLocaleDateString()})
            </span>
          </div>

          {/* Usage Stats */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Usage Overview</h4>
            
            {/* Assets Usage */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Assets</span>
                <span className="font-medium">
                  {subscription.usageStats.assetsUsed.toLocaleString()} / {subscription.assetCount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    getUsageColor(getUsagePercentage(subscription.usageStats.assetsUsed, subscription.assetCount))
                  }`}
                  style={{ 
                    width: `${getUsagePercentage(subscription.usageStats.assetsUsed, subscription.assetCount)}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Users Usage */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Users</span>
                <span className="font-medium">
                  {subscription.usageStats.usersUsed} / {subscription.userCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    getUsageColor(getUsagePercentage(subscription.usageStats.usersUsed, subscription.userCount))
                  }`}
                  style={{ 
                    width: `${getUsagePercentage(subscription.usageStats.usersUsed, subscription.userCount)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Upgrade Prompt */}
          {shouldShowUpgradePrompt() && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-medium text-amber-900">Approaching Plan Limits</h5>
                  <p className="text-amber-800 text-sm mt-1">
                    You're using {Math.max(
                      getUsagePercentage(subscription.usageStats.assetsUsed, subscription.assetCount),
                      getUsagePercentage(subscription.usageStats.usersUsed, subscription.userCount)
                    ).toFixed(0)}% of your plan capacity. Consider upgrading for unlimited access.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3 bg-amber-100 hover:bg-amber-200 text-amber-800"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={() => setShowUpgradeModal(true)}
              icon={<ArrowUpCircle className="w-4 h-4" />}
              className="flex-1"
            >
              Upgrade Plan
            </Button>
            <Link to="/subscription" className="flex-1">
              <Button variant="secondary" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title=""
        size="xl"
      >
        <CheckoutFlow />
      </Modal>
    </>
  );
};

export default SubscriptionWidget;
