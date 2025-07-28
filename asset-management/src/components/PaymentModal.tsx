import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import paymentService, { SubscriptionData, PaymentData } from '../services/paymentService';
import Modal from './common/Modal';
import Button from './common/Button';

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
  size = 'md'  // Add default value and destructure the prop
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const amount = paymentService.calculatePrice(subscriptionData);

  useEffect(() => {
    if (isOpen) {
      setPaymentStep('form');
      setError(null);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate unique reference
      const reference = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const paymentData: PaymentData = {
        amount: amount * 100, // Convert to kobo (Paystack expects amount in kobo)
        email,
        reference,
        callback_url: `${window.location.origin}/payment/callback`,
        metadata: {
          plan: subscriptionData.plan,
          assetCount: subscriptionData.assetCount,
          userCount: subscriptionData.userCount,
          billingCycle: subscriptionData.billingCycle
        }
      };

      setPaymentStep('processing');

      // Initialize payment
      const response = await paymentService.initializePayment(paymentData);

      if (response.status && response.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
      setPaymentStep('error');
      onError?.(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (paymentData: any) => {
    setPaymentStep('success');
    onSuccess?.(paymentData);
    toast.success('Payment successful! Your subscription is now active.');
  };

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Complete Your Subscription</h3>
        <p className="text-sm text-gray-500 mt-1">
          You'll be redirected to our secure payment processor
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Plan:</span>
          <span className="font-medium">{subscriptionData.plan.charAt(0).toUpperCase() + subscriptionData.plan.slice(1)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Assets:</span>
          <span className="font-medium">{subscriptionData.assetCount}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Users:</span>
          <span className="font-medium">{subscriptionData.userCount}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Billing:</span>
          <span className="font-medium capitalize">{subscriptionData.billingCycle}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-semibold text-indigo-600">₦{amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

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
        />
      </div>

      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      <div className="flex items-center justify-center text-xs text-gray-500">
        <Lock className="w-4 h-4 mr-1" />
        Your payment information is secure and encrypted
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
          className="flex-1"
          icon={<CreditCard className="w-4 h-4" />}
        >
          Pay ₦{amount.toLocaleString()}
        </Button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-4">
      <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
      <h3 className="text-lg font-medium text-gray-900">Processing Payment</h3>
      <p className="text-sm text-gray-500">
        Please wait while we redirect you to our secure payment processor...
      </p>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
      <h3 className="text-lg font-medium text-gray-900">Payment Successful!</h3>
      <p className="text-sm text-gray-500">
        Your subscription has been activated. You can now access all features.
      </p>
      <Button
        variant="primary"
        onClick={onClose}
        className="w-full"
      >
        Continue to Dashboard
      </Button>
    </div>
  );

  const renderError = () => (
    <div className="text-center space-y-4">
      <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
      <h3 className="text-lg font-medium text-gray-900">Payment Failed</h3>
      <p className="text-sm text-gray-500">
        {error || 'Something went wrong with your payment. Please try again.'}
      </p>
      <div className="flex space-x-3">
        <Button
          variant="secondary"
          onClick={() => setPaymentStep('form')}
          className="flex-1"
        >
          Try Again
        </Button>
        <Button
          variant="primary"
          onClick={onClose}
          className="flex-1"
        >
          Close
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
      // Remove size prop since Modal doesn't accept it
      // If you need to control Modal size, you'll need to update the Modal component
    >
      {renderContent()}
    </Modal>
  );
};

export default PaymentModal;