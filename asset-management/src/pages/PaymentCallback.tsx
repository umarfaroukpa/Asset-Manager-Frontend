import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, CreditCard, AlertTriangle, ArrowLeft, Home, Receipt, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import paymentService from '../services/paymentService';
import { toast } from 'react-toastify';

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  amount?: number;
  currency?: string;
  planName?: string;
  subscriptionId?: string;
  error?: string;
  timestamp?: string;
  reference?: string;
  status?: string;
}

interface PaymentCallbackProps {
  order?: {
    id: string;
    amount: number;
    currency: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    tax?: number;
    shipping?: number;
  };
}

const PaymentCallback: React.FC<PaymentCallbackProps> = ({ order }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [retryCount, setRetryCount] = useState(0);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

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

  const getPaymentReference = (): string | null => {
    // Try to get reference from URL params first
    let reference = searchParams.get('reference');
    
    if (!reference) {
      // Try alternative parameter names
      reference = searchParams.get('trxref') || searchParams.get('tx_ref');
    }
    
    if (!reference) {
      // Try to get from localStorage as fallback
      reference = localStorage.getItem('pendingPaymentReference');
    }
    
    return reference;
  };

  const verifyPayment = async () => {
    try {
      setLoading(true);
      setVerificationAttempts(prev => prev + 1);
      
      const reference = getPaymentReference();
      
      if (!reference) {
        throw new Error('No payment reference found. Please check your payment status manually.');
      }

      console.log('🔍 Verifying payment with reference:', reference);

      // Use the paymentService to verify payment
      const response = await paymentService.verifyPayment(reference);

      if (response.success) {
        setPaymentResult({
          success: true,
          transactionId: response.data.reference,
          amount: response.data.amount,
          currency: response.data.currency || 'NGN',
          planName: response.data.metadata?.plan,
          subscriptionId: response.data.transactionId,
          timestamp: response.data.paid_at,
          reference: response.data.reference,
          status: response.data.status
        });

        // Clear stored payment data on success
        localStorage.removeItem('pendingPaymentReference');
        localStorage.removeItem('pendingPaymentData');
        
        // Show success toast
        toast.success('Payment verified successfully!');
        
      } else {
        throw new Error(response.message || 'Payment verification failed');
      }

    } catch (error) {
      console.error('❌ Payment verification error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment';
      
      // If it's a network error and we haven't tried too many times, offer retry
      if (verificationAttempts < 3 && (
        errorMessage.includes('network') || 
        errorMessage.includes('timeout') ||
        errorMessage.includes('fetch')
      )) {
        setPaymentResult({
          success: false,
          error: `Verification attempt ${verificationAttempts} failed. Please try again.`
        });
      } else {
        setPaymentResult({
          success: false,
          error: errorMessage
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    navigate('/pricing');
  };

  const handleRetryVerification = () => {
    if (verificationAttempts < 5) {
      verifyPayment();
    } else {
      toast.error('Maximum verification attempts reached. Please contact support.');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const formatAmount = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
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
            Please wait while we confirm your payment with Paystack
          </p>
          {verificationAttempts > 1 && (
            <p className="text-sm text-blue-600 mt-2">
              Verification attempt {verificationAttempts} of 5
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        {paymentResult?.success ? (
          <div className="text-center">
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
                {paymentResult.reference && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-mono text-gray-900 text-xs">
                      {paymentResult.reference}
                    </span>
                  </div>
                )}
                {paymentResult.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-gray-900 text-xs">
                      {paymentResult.transactionId.slice(0, 20)}...
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
                    <span className="font-semibold text-gray-900 capitalize">
                      {paymentResult.planName}
                    </span>
                  </div>
                )}
                {paymentResult.status && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-green-600 capitalize">
                      {paymentResult.status}
                    </span>
                  </div>
                )}
                {paymentResult.timestamp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900 text-xs">
                      {formatDate(paymentResult.timestamp)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Success Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-green-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>• Your subscription is now active</li>
                <li>• All premium features are unlocked</li>
                <li>• Confirmation email has been sent</li>
                <li>• You can access your dashboard immediately</li>
              </ul>
            </div>

            {/* Auto-redirect countdown */}
            <div className="mb-6">
              <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                <Clock className="w-4 h-4 mr-2" />
                Redirecting to dashboard in {countdown} seconds...
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleGoToDashboard}
              variant="primary"
              className="w-full"
              icon={<Home className="w-4 h-4" />}
            >
              Go to Dashboard Now
            </Button>
          </div>
        ) : (
          <div className="text-center">
            {/* Error State */}
            <div className="mb-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Verification Failed
              </h2>
              <p className="text-gray-600">
                {paymentResult?.error || 'We encountered an issue verifying your payment.'}
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-red-800 mb-1">
                    What you can do:
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Check your email for payment confirmation</li>
                    <li>• Verify if the amount was deducted from your account</li>
                    <li>• Try verifying the payment again</li>
                    <li>• Contact support if the issue persists</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Reference Info */}
            {getPaymentReference() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Payment Reference for Support:
                </h4>
                <code className="text-xs text-blue-900 bg-blue-100 px-2 py-1 rounded">
                  {getPaymentReference()}
                </code>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {verificationAttempts < 5 && (
                <Button
                  onClick={handleRetryVerification}
                  variant="primary"
                  className="w-full"
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Try Verification Again ({5 - verificationAttempts} attempts left)
                </Button>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleRetry}
                  variant="secondary"
                  icon={<CreditCard className="w-4 h-4" />}
                >
                  New Payment
                </Button>
                <Button
                  onClick={handleGoHome}
                  variant="secondary"
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Support Link */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Need help? {' '}
            <a 
              href="mailto:support@yourapp.com" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Contact Support
            </a>
            {getPaymentReference() && (
              <span className="block mt-1">
                Reference: {getPaymentReference()?.slice(0, 16)}...
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;