import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Shield, 
  Info,
  Star,
  Users,
  Building,
  Clock,
  Zap
} from 'lucide-react';
import { useAuth } from '../hooks/authcontext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import PricingCalculator from '../components/billing/PricingCalculator';
import PaymentModal from '../components/PaymentModal';
import { toast } from 'react-toastify';
import paymentService, { SubscriptionData } from '../services/paymentService';

interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface PlanFeature {
  name: string;
  included: boolean;
  popular?: boolean;
}

const CheckoutFlow: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const steps: CheckoutStep[] = [
    {
      id: 'plan',
      title: 'Choose Your Plan',
      description: 'Select the perfect plan for your needs',
      completed: currentStep > 1
    },
    {
      id: 'customize',
      title: 'Customize & Review',
      description: 'Adjust your plan details and review pricing',
      completed: currentStep > 2
    },
    {
      id: 'payment',
      title: 'Secure Payment',
      description: 'Complete your subscription with secure payment',
      completed: currentStep > 3
    }
  ];

  const planFeatures = {
    starter: [
      { name: 'Up to 100 assets', included: true, popular: false },
      { name: 'Up to 3 users', included: true, popular: false },
      { name: 'Basic reporting', included: true, popular: false },
      { name: 'Email support', included: true, popular: false },
      { name: 'Mobile app access', included: true, popular: false },
      { name: 'Advanced analytics', included: false, popular: false },
      { name: 'API access', included: false, popular: false },
      { name: 'Priority support', included: false, popular: false }
    ],
    professional: [
      { name: 'Up to 1,000 assets', included: true, popular: false },
      { name: 'Unlimited users', included: true, popular: false },
      { name: 'Advanced reporting', included: true, popular: true },
      { name: 'Priority support', included: true, popular: false },
      { name: 'QR code scanning', included: true, popular: false },
      { name: 'API access', included: true, popular: false },
      { name: 'Custom integrations', included: false, popular: false },
      { name: 'Dedicated manager', included: false, popular: false }
    ],
    enterprise: [
      { name: 'Unlimited assets', included: true, popular: false },
      { name: 'Unlimited users', included: true, popular: false },
      { name: 'All features included', included: true, popular: false },
      { name: 'Dedicated manager', included: true, popular: true },
      { name: 'Custom integrations', included: true, popular: false },
      { name: 'On-premise option', included: true, popular: false },
      { name: 'SLA guarantee', included: true, popular: false },
      { name: 'Custom training', included: true, popular: false }
    ]
  };

  const handlePlanSelection = (plan: 'starter' | 'professional' | 'enterprise') => {
    const planData: SubscriptionData = {
      plan,
      assetCount: plan === 'starter' ? 10 : plan === 'professional' ? 100 : 500,
      userCount: plan === 'starter' ? 1 : plan === 'professional' ? 5 : 10,
      billingCycle: 'monthly'
    };
    setSelectedPlan(planData);
    setCurrentStep(2);
  };

  const handleCustomization = (pricingData: any) => {
    if (!pricingData) return;
    
    const updatedPlan: SubscriptionData = {
      plan: pricingData.plan,
      assetCount: pricingData.assetCount,
      userCount: pricingData.userCount,
      billingCycle: pricingData.billingCycle
    };
    
    setSelectedPlan(updatedPlan);
    setCurrentStep(3);
  };

  const handlePaymentStart = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    toast.success('🎉 Welcome to your new plan! Your subscription is now active.');
    // Redirect to dashboard or subscription page
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  const getPlanPrice = (plan: string) => {
    const prices = {
      starter: { monthly: 9, annual: 87 },
      professional: { monthly: 29, annual: 278 },
      enterprise: { monthly: 99, annual: 950 }
    };
    return prices[plan as keyof typeof prices] || { monthly: 0, annual: 0 };
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.completed ? 'bg-green-500 border-green-500 text-white' :
                currentStep === index + 1 ? 'border-indigo-500 text-indigo-500' :
                'border-gray-300 text-gray-300'
              }`}>
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  step.completed || currentStep === index + 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-5 h-5 text-gray-300 mx-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlanSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Perfect Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Start with any plan and upgrade anytime. All plans include our core asset management features
          with different limits and advanced capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {(['starter', 'professional', 'enterprise'] as const).map((plan) => {
          const prices = getPlanPrice(plan);
          const features = planFeatures[plan];
          const isPopular = plan === 'professional';
          
          return (
            <div
              key={plan}
              className={`relative rounded-lg border-2 p-6 ${
                isPopular 
                  ? 'border-indigo-500 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all duration-200`}
            >
              {isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 capitalize">{plan}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${prices.monthly}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  ${prices.annual}/year (save 20%)
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full mr-3 mt-0.5 ${
                      feature.included ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {feature.included ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-sm ${
                      feature.included ? 'text-gray-900' : 'text-gray-500'
                    } ${feature.popular ? 'font-medium' : ''}`}>
                      {feature.name}
                      {feature.popular && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={isPopular ? 'primary' : 'secondary'}
                onClick={() => handlePlanSelection(plan)}
                className="w-full"
                size="lg"
              >
                Choose {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 rounded-lg p-6 max-w-4xl mx-auto">
        <div className="flex items-start">
          <Info className="w-6 h-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Need help choosing?</h4>
            <p className="text-blue-800 text-sm mb-3">
              Not sure which plan is right for you? Here's a quick guide:
            </p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• <strong>Starter:</strong> Perfect for small teams or individuals managing basic assets</li>
              <li>• <strong>Professional:</strong> Ideal for growing businesses with advanced reporting needs</li>
              <li>• <strong>Enterprise:</strong> Best for large organizations requiring custom solutions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomization = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customize Your Plan</h2>
        <p className="text-gray-600">
          Fine-tune your subscription to match your exact needs
        </p>
      </div>

      {selectedPlan && (
        <div className="max-w-4xl mx-auto">
          <PricingCalculator
            userType="business"
            onSubmit={handleCustomization}
            initialAssetCount={selectedPlan.assetCount}
            initialUserCount={selectedPlan.userCount}
            initialPlan={selectedPlan.plan as any}
            showComparison={false}
          />
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep(1)}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Plans
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Subscription</h2>
        <p className="text-gray-600">
          Review your plan details and complete secure payment
        </p>
      </div>

      {selectedPlan && (
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium capitalize">{selectedPlan.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assets:</span>
                <span className="font-medium">{selectedPlan.assetCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Users:</span>
                <span className="font-medium">{selectedPlan.userCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing:</span>
                <span className="font-medium capitalize">{selectedPlan.billingCycle}</span>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-indigo-600">
                  ₦{(paymentService.calculatePrice(selectedPlan) / 100).toLocaleString()}
                  <span className="text-sm text-gray-500">/{selectedPlan.billingCycle}</span>
                </span>
              </div>
              {selectedPlan.billingCycle === 'monthly' && (
                <p className="text-xs text-gray-500 mt-1">
                  Save 15% with annual billing
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Button
              variant="primary"
              onClick={handlePaymentStart}
              loading={isLoading}
              icon={<CreditCard className="w-4 h-4" />}
              className="w-full"
              size="lg"
            >
              Continue to Payment
            </Button>
            
            <div className="text-center">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-2" />
                Secured by 256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep(2)}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Customize
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Get Started with Asset Manager</h1>
          <p className="text-gray-600 text-center mt-2">Choose your plan and start managing your assets today</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white rounded-lg shadow-sm border p-8">
          {currentStep === 1 && renderPlanSelection()}
          {currentStep === 2 && renderCustomization()}
          {currentStep === 3 && renderPaymentStep()}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-sm text-gray-600">SSL Secured</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="text-sm text-gray-600">30-day money back</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <span className="text-sm text-gray-600">Instant activation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          subscriptionData={selectedPlan}
          onSuccess={handlePaymentSuccess}
          onError={(error) => {
            toast.error(`Payment failed: ${error}`);
          }}
        />
      )}
    </div>
  );
};

export default CheckoutFlow;
