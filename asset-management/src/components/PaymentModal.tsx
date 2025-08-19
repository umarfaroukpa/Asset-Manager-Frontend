import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader, Info, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import paymentService, { SubscriptionData, PaymentData } from '../services/paymentService';
import Modal from './common/Modal';
import Button from './common/Button';
import { useAuth } from '../hooks/authcontext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionData: SubscriptionData;
  onSuccess?: (paymentData: any) => void;
  onError?: (error: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  subscriptionData,
  onSuccess,
  onError,
  size = 'md'  
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState<string | null>(null);
  const [connectionTest, setConnectionTest] = useState<{ tested: boolean; success: boolean }>({ 
    tested: false, 
    success: false 
  });

  const amount = paymentService.calculatePrice(subscriptionData);
  const planDetails = paymentService.getPlanDetails(subscriptionData.plan);

  useEffect(() => {
    if (isOpen) {
      setPaymentStep('form');
      setError(null);
      setEmail(user?.email || '');
      
      // Test Paystack connection when modal opens
      testPaystackConnection();
    }
  }, [isOpen, user?.email]);

  const testPaystackConnection = async () => {
    try {
      const result = await paymentService.testConnection();
      setConnectionTest({ tested: true, success: result.success });
      
      if (!result.success) {
        console.warn('⚠️ Paystack connection test failed:', result.message);
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
      setConnectionTest({ tested: true, success: false });
    }
  };

  const validateForm = (): string | null => {
    if (!email) {
      return 'Please enter your email address';
    }

    if (!email.includes('@')) {
      return 'Please enter a valid email address';
    }

    if (amount <= 0) {
      return 'Invalid subscription amount';
    }

    return null;
  };

  const handlePayment = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStep('processing');

    try {
      // Create payment data
      const paymentData: PaymentData = paymentService.createPaymentData(
        subscriptionData,
        email,
        user?.id,
        `${window.location.origin}/payment/callback`
      );

      console.log('💳 Initiating payment with data:', {
        amount: paymentData.amount,
        email: paymentData.email,
        plan: subscriptionData.plan,
        reference: paymentData.reference
      });

      // Initialize payment with Paystack
      const response = await paymentService.initializePayment(paymentData);

      if (response.success && response.data?.authorization_url) {
        console.log('🚀 Redirecting to Paystack:', response.data.authorization_url);
        
        // Store payment reference for callback verification
        localStorage.setItem('pendingPaymentReference', response.data.reference);
        localStorage.setItem('pendingPaymentData', JSON.stringify({
          amount: amount,
          plan: subscriptionData.plan,
          email: email
        }));
        
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error(response.message || 'Failed to initialize payment');
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      setPaymentStep('error');
      onError?.(errorMessage);
      toast.error(`Payment failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (paymentData: any) => {
    setPaymentStep('success');
    onSuccess?.(paymentData);
    toast.success('Payment successful! Your subscription is now active.');
    
    // Clear stored payment data
    localStorage.removeItem('pendingPaymentReference');
    localStorage.removeItem('pendingPaymentData');
  };

  const handleRetry = () => {
    setPaymentStep('form');
    setError(null);
  };

  const renderConnectionStatus = () => {
    if (!connectionTest.tested) {
      return (
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          Testing payment connection...
        </div>
      );
    }

    return (
      <div className={`flex items-center text-sm mb-2 ${
        connectionTest.success ? 'text-green-600' : 'text-red-600'
      }`}>
        {connectionTest.success ? (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Payment system ready
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 mr-2" />
            Payment system unavailable
          </>
        )}
      </div>
    );
  };

  const renderPricingBreakdown = () => (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h4 className="font-medium text-gray-900 mb-3">Pricing Breakdown</h4>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Base price ({subscriptionData.plan}):</span>
          <span className="font-medium">₦{(planDetails.basePrice / 100).toLocaleString()}</span>
        </div>
        
        {subscriptionData.assetCount > 1 && (
          <div className="flex justify-between">
            <span className="text-gray-600">
              Additional assets ({subscriptionData.assetCount - 1}):
            </span>
            <span className="font-medium">
              ₦{(((subscriptionData.assetCount - 1) * planDetails.perAssetPrice) / 100).toLocaleString()}
            </span>
          </div>
        )}
        
        {subscriptionData.userCount > 1 && (
          <div className="flex justify-between">
            <span className="text-gray-600">
              Additional users ({subscriptionData.userCount - 1}):
            </span>
            <span className="font-medium">
              ₦{(((subscriptionData.userCount - 1) * planDetails.perUserPrice) / 100).toLocaleString()}
            </span>
          </div>
        )}
        
        {subscriptionData.billingCycle === 'annual' && (
          <div className="flex justify-between text-green-600">
            <span>Annual discount (15%):</span>
            <span className="font-medium">-₦{(((amount / 0.85) - amount) / 100).toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            Total ({subscriptionData.billingCycle}):
          </span>
          <span className="text-lg font-bold text-indigo-600">
            ₦{(amount / 100).toLocaleString()}
          </span>
        </div>
        {subscriptionData.billingCycle === 'monthly' && (
          <p className="text-xs text-gray-500 mt-1">
            Save 15% by choosing annual billing
          </p>
        )}
      </div>
    </div>
  );

  const renderPlanFeatures = () => (
    <div className="bg-blue-50 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 mb-3 flex items-center">
        <Info className="w-4 h-4 mr-2" />
        What's Included
      </h4>
      <ul className="space-y-2 text-sm text-blue-800">
        {planDetails.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900">Complete Your Subscription</h3>
        <p className="text-sm text-gray-500 mt-1">
          Secure payment powered by Paystack
        </p>
      </div>

      {renderConnectionStatus()}

      {renderPricingBreakdown()}
      
      {renderPlanFeatures()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter your email address"
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-center text-xs text-gray-500 mb-2">
          <Lock className="w-4 h-4 mr-1" />
          Your payment information is secure and encrypted
        </div>
        <p className="text-xs text-gray-500 text-center">
          You will be redirected to Paystack's secure payment page to complete your transaction
        </p>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="secondary"
          onClick={onClose}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handlePayment}
          loading={loading}
          disabled={!connectionTest.success || loading}
          className="flex-1"
          icon={<CreditCard className="w-4 h-4" />}
        >
          {loading ? 'Processing...' : `Pay ₦${(amount / 100).toLocaleString()}`}
        </Button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-4">
      <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
      <h3 className="text-lg font-medium text-gray-900">Redirecting to Payment</h3>
      <p className="text-sm text-gray-500">
        Please wait while we redirect you to Paystack's secure payment page...
      </p>
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          If you're not redirected automatically, please check if pop-ups are blocked in your browser.
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h3 className="text-xl font-semibold text-gray-900">Payment Successful!</h3>
      <p className="text-sm text-gray-600">
        Your {subscriptionData.plan} subscription has been activated successfully.
      </p>
      
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-medium text-green-800 mb-2">What happens next?</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Your account has been upgraded immediately</li>
          <li>• You'll receive a confirmation email shortly</li>
          <li>• All premium features are now available</li>
        </ul>
      </div>
      
      <Button
        variant="primary"
        onClick={onClose}
        className="w-full"
        icon={<CheckCircle className="w-4 h-4" />}
      >
        Continue to Dashboard
      </Button>
    </div>
  );

  const renderError = () => (
    <div className="text-center space-y-4">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
      <h3 className="text-xl font-semibold text-gray-900">Payment Failed</h3>
      <p className="text-sm text-gray-600">
        {error || 'We encountered an issue processing your payment.'}
      </p>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <h4 className="text-sm font-medium text-red-800 mb-1">
              Common reasons for payment failure:
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Card has expired or is blocked</li>
              <li>• Network connection issues</li>
              <li>• Payment was canceled</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleRetry}
          className="flex-1"
          icon={<CreditCard className="w-4 h-4" />}
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (paymentStep) {
      case 'processing':
        return renderProcessing();
      case 'success':
        return renderSuccess();
      case 'error':
        return renderError();
      default:
        return renderPaymentForm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size={size}
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {renderContent()}
      </div>
    </Modal>
  );
};

export default PaymentModal;