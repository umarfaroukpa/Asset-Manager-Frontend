import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, CreditCard, AlertTriangle, ArrowLeft, Home, Receipt } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  amount?: number;
  currency?: string;
  planName?: string;
  subscriptionId?: string;
  error?: string;
  timestamp?: string;
}

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    verifyPayment();
  }, []);

  useEffect(() => {
    if (paymentResult?.success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (paymentResult?.success && countdown === 0) {
      navigate('/dashboard');
    }
  }, [paymentResult, countdown, navigate]);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      
      // Get payment parameters from URL
      const sessionId = searchParams.get('session_id');
      const paymentIntent = searchParams.get('payment_intent');
      const status = searchParams.get('status');
      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');

      // Handle different payment provider callbacks
      if (canceled === 'true' || status === 'canceled') {
        setPaymentResult({
          success: false,
          error: 'Payment was canceled by user'
        });
        setLoading(false);
        return;
      }

      // Verify payment with backend
      const verificationData = {
        sessionId,
        paymentIntent,
        status,
        success,
        // Include any other relevant parameters
        ...Object.fromEntries(searchParams.entries())
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(verificationData)
      });

      if (!response.ok) {
        throw new Error(`Payment verification failed: ${response.status}`);
      }

      const result = await response.json();
      setPaymentResult({
        success: result.success,
        transactionId: result.transactionId,
        amount: result.amount,
        currency: result.currency || 'USD',
        planName: result.planName,
        subscriptionId: result.subscriptionId,
        error: result.error,
        timestamp: result.timestamp || new Date().toISOString()
      });

    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify payment'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    navigate('/pricing');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100); // Assuming amount is in cents
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <LoadingSpinner />
          <h2 className="text-xl font-semibold text-gray-900 mt-4">
            Verifying Payment...
          </h2>
          <p className="text-gray-600 mt-2">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {paymentResult?.success ? (
          <>
            {/* Success State */}
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Thank you for your subscription. Your payment has been processed successfully.
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Receipt className="w-4 h-4 mr-2" />
                Payment Details
              </h3>
              <div className="space-y-2 text-sm">
                {paymentResult.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-gray-900">
                      {paymentResult.transactionId.slice(0, 16)}...
                    </span>
                  </div>
                )}
                {paymentResult.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">
                      {formatAmount(paymentResult.amount, paymentResult.currency)}
                    </span>
                  </div>
                )}
                {paymentResult.planName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold text-gray-900">
                      {paymentResult.planName}
                    </span>
                  </div>
                )}
                {paymentResult.timestamp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">
                      {new Date(paymentResult.timestamp).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Auto-redirect countdown */}
            <div className="mb-6">
              <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                <Clock className="w-4 h-4 mr-2" />
                Redirecting to dashboard in {countdown} seconds...
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoToDashboard}
                variant="primary"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Error State */}
            <div className="mb-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-600">
                {paymentResult?.error || 'We encountered an issue processing your payment.'}
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-red-800 mb-1">
                    What happened?
                  </h3>
                  <p className="text-sm text-red-700">
                    {paymentResult?.error === 'Payment was canceled by user' 
                      ? 'You canceled the payment process.'
                      : 'The payment could not be processed. This might be due to insufficient funds, an expired card, or a network issue.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                variant="primary"
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={handleGoHome}
                variant="secondary"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </>
        )}

        {/* Support Link */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? {' '}
            <a 
              href="mailto:support@example.com" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
