import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Zap, Check, X } from 'lucide-react';
import Button from '../common/Button';

interface PricingCalculatorProps {
  userType: string;
  onSubmit: (data: any) => void;
  initialAssetCount?: number;
  initialUserCount?: number;
  initialPlan?: PlanKey;
  showComparison?: boolean;
}

type PlanKey = 'starter' | 'professional' | 'enterprise';

const PricingCalculator = ({ 
  userType, 
  onSubmit,
  initialAssetCount = 10,
  initialUserCount = 1,
  initialPlan = 'starter',
  showComparison = false
}: PricingCalculatorProps) => {
  const [assetCount, setAssetCount] = useState(initialAssetCount);
  const [userCount, setUserCount] = useState(initialUserCount);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>(initialPlan);
  const [features, setFeatures] = useState<string[]>([]);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const plans: Record<PlanKey, {
    name: string;
    basePrice: number;
    pricePerAsset: number;
    pricePerUser: number;
    features: string[];
    maxAssets: number | null;
    maxUsers: number | null;
  }> = {
    starter: {
      name: 'Starter',
      basePrice: 9,
      pricePerAsset: 0.10,
      pricePerUser: 2,
      features: [
        'Basic asset tracking',
        'Up to 3 users',
        'Email support',
        'Mobile app access',
        'Basic reporting'
      ],
      maxAssets: 100,
      maxUsers: 3
    },
    professional: {
      name: 'Professional',
      basePrice: 29,
      pricePerAsset: 0.05,
      pricePerUser: 1.50,
      features: [
        'Advanced asset tracking',
        'Unlimited users',
        'Priority support',
        'QR code scanning',
        'Advanced reporting',
        'API access'
      ],
      maxAssets: 1000,
      maxUsers: null
    },
    enterprise: {
      name: 'Enterprise',
      basePrice: 99,
      pricePerAsset: 0.02,
      pricePerUser: 1,
      features: [
        'All Professional features',
        'Dedicated account manager',
        'Custom integrations',
        'Single sign-on (SSO)',
        'Enhanced security',
        'Custom reporting'
      ],
      maxAssets: null,
      maxUsers: null
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [assetCount, userCount, billingCycle, selectedPlan]);

  const calculatePrice = () => {
    const plan = plans[selectedPlan];
    let price = plan.basePrice;
    
    // Validate inputs
    const validAssetCount = Math.max(1, Math.min(assetCount, plan.maxAssets || 10000));
    const validUserCount = Math.max(1, Math.min(userCount, plan.maxUsers || 1000));
    
    // Calculate asset cost
    if (validAssetCount > 10) {
      price += (validAssetCount - 10) * plan.pricePerAsset;
    }
    
    // Calculate user cost
    if (plan.maxUsers && validUserCount > plan.maxUsers) {
      price += (validUserCount - plan.maxUsers) * plan.pricePerUser;
    } else if (!plan.maxUsers && validUserCount > 1) {
      price += (validUserCount - 1) * plan.pricePerUser;
    }
    
    // Apply annual discount
    if (billingCycle === 'annual') {
      price *= 0.8; // 20% discount
    }
    
    // Ensure price is not negative
    const finalPrice = Math.max(0, price);
    setCalculatedPrice(finalPrice);
    setFeatures(plan.features);
  };

  const handlePlanChange = (plan: PlanKey) => {
    setSelectedPlan(plan);
    
    // Adjust asset count if exceeds plan limit
    if (plans[plan].maxAssets && assetCount > plans[plan].maxAssets!) {
      setAssetCount(plans[plan].maxAssets!);
    }
    
    // Adjust user count if exceeds plan limit
    if (plans[plan].maxUsers && userCount > plans[plan].maxUsers!) {
      setUserCount(plans[plan].maxUsers!);
    }
  };

  const handleSubmit = () => {
    // Validate data before submitting
    if (!selectedPlan || calculatedPrice <= 0) {
      console.error('Invalid pricing data');
      return;
    }

    // Ensure counts are within plan limits
    const plan = plans[selectedPlan];
    const finalAssetCount = plan.maxAssets ? Math.min(assetCount, plan.maxAssets) : assetCount;
    const finalUserCount = plan.maxUsers ? Math.min(userCount, plan.maxUsers) : userCount;

    const pricingData = {
      plan: selectedPlan,
      planName: plan.name,
      assetCount: finalAssetCount,
      userCount: finalUserCount,
      billingCycle,
      price: calculatedPrice,
      annualPrice: billingCycle === 'annual' ? calculatedPrice : calculatedPrice * 12 * 0.8,
      features: plan.features,
      userType,
      timestamp: new Date().toISOString()
    };

    onSubmit(pricingData);
  };

  const handleReset = () => {
    setAssetCount(initialAssetCount);
    setUserCount(initialUserCount);
    setSelectedPlan(initialPlan);
    setBillingCycle('monthly');
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Pricing Calculator</h2>
        <p className="text-sm text-gray-500">Estimate your monthly costs based on your needs</p>
      </div>
      
      <div className="p-6">
        {/* Plan Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Plan</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(plans) as PlanKey[]).map((planKey: PlanKey) => (
              <button
                key={planKey}
                onClick={() => handlePlanChange(planKey)}
                className={`p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                  selectedPlan === planKey ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <h3 className="text-lg font-medium text-gray-900">{plans[planKey].name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  ${plans[planKey].basePrice}/{billingCycle === 'monthly' ? 'month' : 'year'}
                </p>
                <ul className="mt-3 space-y-2">
                  {plans[planKey].features.slice(0, 3).map((feature: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-gray-600">
                      <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {plans[planKey].features.length > 3 && (
                    <li className="text-sm text-indigo-600">
                      + {plans[planKey].features.length - 3} more features
                    </li>
                  )}
                </ul>
              </button>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Assets
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="1"
                  max={plans[selectedPlan].maxAssets || 5000}
                  value={assetCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setAssetCount(Math.max(1, value));
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  min="1"
                  max={plans[selectedPlan].maxAssets || 5000}
                  value={assetCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    const maxAssets = plans[selectedPlan].maxAssets || 5000;
                    setAssetCount(Math.max(1, Math.min(value, maxAssets)));
                  }}
                  className="ml-2 w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                />
              </div>
              {plans[selectedPlan].maxAssets && assetCount >= plans[selectedPlan].maxAssets! && (
                <p className="mt-1 text-xs text-yellow-600">
                  Maximum for {plans[selectedPlan].name} plan is {plans[selectedPlan].maxAssets} assets
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Users
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="1"
                  max={plans[selectedPlan].maxUsers || 50}
                  value={userCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setUserCount(Math.max(1, value));
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  min="1"
                  max={plans[selectedPlan].maxUsers || 50}
                  value={userCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    const maxUsers = plans[selectedPlan].maxUsers || 50;
                    setUserCount(Math.max(1, Math.min(value, maxUsers)));
                  }}
                  className="ml-2 w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                />
              </div>
              {plans[selectedPlan].maxUsers && userCount >= plans[selectedPlan].maxUsers! && (
                <p className="mt-1 text-xs text-yellow-600">
                  Maximum for {plans[selectedPlan].name} plan is {plans[selectedPlan].maxUsers} users
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Billing Cycle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md ${
                billingCycle === 'monthly' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md ${
                billingCycle === 'annual' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annual Billing (20% discount)
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Estimated Price</h3>
            <p className="text-2xl font-bold text-indigo-600">
              ${calculatedPrice.toFixed(2)}
              <span className="text-sm font-normal text-gray-500">
                /{billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            </p>
          </div>
          
          {/* Price Breakdown */}
          <div className="space-y-2 text-sm text-gray-600 border-t pt-3">
            <div className="flex justify-between">
              <span>Base plan ({plans[selectedPlan].name})</span>
              <span>${plans[selectedPlan].basePrice.toFixed(2)}</span>
            </div>
            {assetCount > 10 && (
              <div className="flex justify-between">
                <span>Extra assets ({assetCount - 10} × ${plans[selectedPlan].pricePerAsset})</span>
                <span>${((assetCount - 10) * plans[selectedPlan].pricePerAsset).toFixed(2)}</span>
              </div>
            )}
            {((plans[selectedPlan].maxUsers && userCount > plans[selectedPlan].maxUsers!) || 
              (!plans[selectedPlan].maxUsers && userCount > 1)) && (
              <div className="flex justify-between">
                <span>
                  Extra users ({userCount - (plans[selectedPlan].maxUsers || 1)} × ${plans[selectedPlan].pricePerUser})
                </span>
                <span>
                  ${((userCount - (plans[selectedPlan].maxUsers || 1)) * plans[selectedPlan].pricePerUser).toFixed(2)}
                </span>
              </div>
            )}
            {billingCycle === 'annual' && (
              <div className="flex justify-between text-green-600">
                <span>Annual discount (20% off)</span>
                <span>-${(calculatedPrice * 0.25).toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-3">
            {billingCycle === 'annual' ? (
              <>Total annual cost: ${calculatedPrice.toFixed(2)}</>
            ) : (
              <>Annual cost with monthly billing: ${(calculatedPrice * 12).toFixed(2)}</>
            )}
          </p>
          
          {billingCycle === 'monthly' && (
            <p className="text-sm text-green-600 mt-1">
              Save ${((calculatedPrice * 12) - (calculatedPrice * 12 * 0.8)).toFixed(2)} per year with annual billing
            </p>
          )}
        </div>

        {/* Plan Features */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {plans[selectedPlan].name} Plan Includes:
          </h3>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={handleSubmit}
            variant="primary"
            className="flex-1"
          >
            <CreditCard className="w-5 h-5 mr-2 inline" />
            Subscribe Now
          </Button>
          <Button
            onClick={handleReset}
            variant="secondary"
            className="flex-1"
          >
            <Zap className="w-5 h-5 mr-2 inline" />
            Reset
          </Button>
          <Button
            onClick={() => onSubmit(null)}
            variant="secondary"
            className="flex-1"
          >
            <X className="w-5 h-5 mr-2 inline" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;