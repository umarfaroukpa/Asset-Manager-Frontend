import React from 'react';
import { Crown, Users, Package, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './common/Button';

interface SubscriptionSummaryProps {
  compact?: boolean;
}

interface PlanDetails {
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: string[];
  assetLimit: number;
  userLimit: number;
  usage: {
    assets: number;
    users: number;
  };
}

const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({ compact = false }) => {
  // This would normally come from a service/API
  const currentPlan: PlanDetails = {
    name: 'Professional',
    price: 29,
    billingCycle: 'monthly',
    features: ['Advanced Analytics', 'Priority Support', 'API Access'],
    assetLimit: 1000,
    userLimit: 10,
    usage: {
      assets: 245,
      users: 4
    }
  };

  const usagePercentage = {
    assets: (currentPlan.usage.assets / currentPlan.assetLimit) * 100,
    users: (currentPlan.usage.users / currentPlan.userLimit) * 100
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 75) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-indigo-600" data-testid="crown-icon" />
            <span className="font-semibold text-gray-900">{currentPlan.name}</span>
          </div>
          <span className="text-sm text-gray-500">
            ${currentPlan.price}/{currentPlan.billingCycle === 'monthly' ? 'mo' : 'yr'}
          </span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Assets:</span>
            <span className="font-medium">
              {currentPlan.usage.assets} / {currentPlan.assetLimit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Users:</span>
            <span className="font-medium">
              {currentPlan.usage.users} / {currentPlan.userLimit}
            </span>
          </div>
        </div>

        <Link to="/subscription">
          <Button variant="secondary" size="sm" className="w-full mt-3">
            Manage Plan
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{currentPlan.name} Plan</h3>
            <p className="text-sm text-gray-500">
              ${currentPlan.price} / {currentPlan.billingCycle}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500">Next billing</div>
          <div className="font-medium text-gray-900">Jan 15, 2025</div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-500" data-testid="package-icon" />
              <span className="text-sm font-medium text-gray-700">Assets</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getUsageColor(usagePercentage.assets)}`}>
              {currentPlan.usage.assets} / {currentPlan.assetLimit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(usagePercentage.assets)}`}
              style={{ width: `${Math.min(100, usagePercentage.assets)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" data-testid="users-icon" />
              <span className="text-sm font-medium text-gray-700">Users</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getUsageColor(usagePercentage.users)}`}>
              {currentPlan.usage.users} / {currentPlan.userLimit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(usagePercentage.users)}`}
              style={{ width: `${Math.min(100, usagePercentage.users)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Plan Features</h4>
        <div className="space-y-2">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Link to="/subscription" className="flex-1">
          <Button variant="secondary" className="w-full" icon={<Calendar className="w-4 h-4" />}>
            Manage Plan
          </Button>
        </Link>
        <Link to="/checkout" className="flex-1">
          <Button variant="primary" className="w-full" icon={<TrendingUp className="w-4 h-4" />}>
            Upgrade
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {Math.round(100 - usagePercentage.assets)}%
            </div>
            <div className="text-xs text-gray-500">Assets Available</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {currentPlan.userLimit - currentPlan.usage.users}
            </div>
            <div className="text-xs text-gray-500">User Slots Left</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">24/7</div>
            <div className="text-xs text-gray-500">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSummary;
