import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, CreditCard, Users, Building, Crown, Gift, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/authcontext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import CheckoutFlow from '../components/CheckoutFlow';
import { toast } from 'react-toastify';

interface WelcomeOnboardingProps {
  user?: any;
  registrationData?: {
    userType: string;
    assetCount: string;
    companySize?: string;
    plan?: string;
  };
}

const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({ user, registrationData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState<'trial' | 'subscribe' | 'free' | null>(null);

  // Get registration data from URL state or props
  const userData = registrationData || location.state?.registrationData || {
    userType: 'individual',
    assetCount: '1-10',
    plan: 'starter'
  };

  const currentUser = user || authUser;

  useEffect(() => {
    // Auto-progress through steps if coming from registration
    if (location.state?.fromRegistration) {
      // Show welcome for 2 seconds, then move to subscription options
      setTimeout(() => setCurrentStep(2), 2000);
    }
  }, [location]);

  const handleStartTrial = () => {
    setSelectedPath('trial');
    // TODO: Start 14-day trial
    toast.success('🎉 Your 14-day free trial has started!');
    navigate('/dashboard', { 
      state: { 
        showTrialBanner: true,
        trialDaysRemaining: 14 
      }
    });
  };

  const handleSubscribeNow = () => {
    setSelectedPath('subscribe');
    setShowSubscriptionModal(true);
  };

  const handleContinueFree = () => {
    setSelectedPath('free');
    navigate('/dashboard', { 
      state: { 
        showUpgradePrompts: true 
      }
    });
  };

  const getRecommendedPlan = () => {
    if (userData.userType === 'individual') return 'starter';
    
    const assetNum = parseInt(userData.assetCount.split('-')[0]);
    if (assetNum <= 50) return 'starter';
    if (assetNum <= 500) return 'professional';
    return 'enterprise';
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8">
      {/* Animated Welcome */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-ping opacity-25"></div>
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-8 inline-block">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Welcome to Asset Manager!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your account has been created successfully. 
          {currentUser?.displayName && ` Welcome aboard, ${currentUser.displayName}!`}
        </p>
      </div>

      {/* Account Summary */}
      <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-blue-900 mb-3">Account Setup Complete</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex justify-between">
            <span>Account Type:</span>
            <span className="font-medium capitalize">{userData.userType}</span>
          </div>
          <div className="flex justify-between">
            <span>Expected Assets:</span>
            <span className="font-medium">{userData.assetCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Recommended Plan:</span>
            <span className="font-medium capitalize">{getRecommendedPlan()}</span>
          </div>
        </div>
      </div>

      <div className="text-gray-500 text-sm">
        Setting up your personalized experience...
      </div>
    </div>
  );

  const renderSubscriptionOptions = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Journey
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the best way to get started with Asset Manager. 
          You can always change your plan later.
        </p>
      </div>

      {/* Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Free Trial Option */}
        <div className="relative bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
          <div className="absolute top-4 right-4">
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Recommended
            </span>
          </div>
          
          <div className="text-center mb-6">
            <Gift className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">14-Day Free Trial</h3>
            <p className="text-gray-600 text-sm">
              Full access to all premium features
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Unlimited assets & users
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Advanced reporting & analytics
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              QR scanning & mobile app
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Priority support
            </li>
          </ul>

          <Button
            variant="primary"
            onClick={handleStartTrial}
            className="w-full mb-3"
            icon={<Clock className="w-4 h-4" />}
          >
            Start Free Trial
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            No credit card required • Cancel anytime
          </p>
        </div>

        {/* Subscribe Now Option */}
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
          <div className="text-center mb-6">
            <Crown className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Subscribe Now</h3>
            <p className="text-gray-600 text-sm">
              Get started immediately with a paid plan
            </p>
          </div>

          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-indigo-600">
              From $9/month
            </div>
            <p className="text-sm text-gray-500">
              Recommended: {getRecommendedPlan()} plan
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-indigo-500 mr-2" />
              Immediate access to all features
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-indigo-500 mr-2" />
              Plan-specific limits & features
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-indigo-500 mr-2" />
              30-day money-back guarantee
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-indigo-500 mr-2" />
              Annual billing discounts available
            </li>
          </ul>

          <Button
            variant="primary"
            onClick={handleSubscribeNow}
            className="w-full mb-3"
            icon={<CreditCard className="w-4 h-4" />}
          >
            Choose Plan
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Secure payment • Upgrade anytime
          </p>
        </div>

        {/* Free Option */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
          <div className="text-center mb-6">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Free</h3>
            <p className="text-gray-600 text-sm">
              Basic features to get you started
            </p>
          </div>

          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-gray-600">
              $0/month
            </div>
            <p className="text-sm text-gray-500">
              Limited features
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
              Up to 10 assets
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
              1 user account
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
              Basic reporting
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
              Email support
            </li>
          </ul>

          <Button
            variant="secondary"
            onClick={handleContinueFree}
            className="w-full mb-3"
          >
            Continue Free
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Upgrade anytime as you grow
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="text-center pt-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">30-day money back</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Secure payments</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {currentStep === 1 && renderWelcomeStep()}
          {currentStep === 2 && renderSubscriptionOptions()}
        </div>

        {/* Skip Option */}
        {currentStep === 2 && (
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Skip for now, take me to the dashboard
            </button>
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      <Modal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        title=""
        size="xl"
      >
        <CheckoutFlow />
      </Modal>
    </div>
  );
};

export default WelcomeOnboarding;
