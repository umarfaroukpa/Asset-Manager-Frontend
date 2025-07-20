// components/billing/PricingCalculator.tsx
import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Zap, Check, X } from 'lucide-react';
import Button from '../common/Button';

const PricingCalculator = ({ userType, onSubmit }) => {
  const [assetCount, setAssetCount] = useState(10);
  const [userCount, setUserCount] = useState(1);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [features, setFeatures] = useState([]);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const plans = {
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
    
    // Calculate asset cost
    if (assetCount > 10) {
      price += (assetCount - 10) * plan.pricePerAsset;
    }
    
    // Calculate user cost
    if (plan.maxUsers && userCount > plan.maxUsers) {
      price += (userCount - plan.maxUsers) * plan.pricePerUser;
    } else if (!plan.maxUsers && userCount > 1) {
      price += (userCount - 1) * plan.pricePerUser;
    }
    
    // Apply annual discount
    if (billingCycle === 'annual') {
      price *= 0.8; // 20% discount
    }
    
    setCalculatedPrice(price);
    setFeatures(plan.features);
  };

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    
    // Adjust asset count if exceeds plan limit
    if (plans[plan].maxAssets && assetCount > plans[plan].maxAssets) {
      setAssetCount(plans[plan].maxAssets);
    }
    
    // Adjust user count if exceeds plan limit
    if (plans[plan].maxUsers && userCount > plans[plan].maxUsers) {
      setUserCount(plans[plan].maxUsers);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      plan: selectedPlan,
      assetCount,
      userCount,
      billingCycle,
      price: calculatedPrice
    });
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
            {Object.keys(plans).map(planKey => (
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
                  {plans[planKey].features.slice(0, 3).map((feature, i) => (
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
                  onChange={(e) => setAssetCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-4 w-16 text-center text-gray-700">
                  {assetCount}
                </span>
              </div>
              {plans[selectedPlan].maxAssets && assetCount >= plans[selectedPlan].maxAssets && (
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
                  onChange={(e) => setUserCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-4 w-16 text-center text-gray-700">
                  {userCount}
                </span>
              </div>
              {plans[selectedPlan].maxUsers && userCount >= plans[selectedPlan].maxUsers && (
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
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-900">Estimated Price</h3>
            <p className="text-2xl font-bold text-indigo-600">
              ${calculatedPrice.toFixed(2)}
              <span className="text-sm font-normal text-gray-500">
                /{billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {billingCycle === 'annual' && 'Billed annually at '}
            ${(billingCycle === 'annual' ? calculatedPrice * 12 : calculatedPrice).toFixed(2)} total
          </p>
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
            icon={<CreditCard className="w-5 h-5 mr-2" />}
          >
            Subscribe Now
          </Button>
          <Button
            onClick={() => onSubmit(null)}
            variant="secondary"
            className="flex-1"
            icon={<X className="w-5 h-5 mr-2" />}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;