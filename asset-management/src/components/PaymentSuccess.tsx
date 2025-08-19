import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, ArrowRight, Download, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';
import Confetti from 'react-confetti';

interface PaymentSuccessProps {
  paymentData: {
    amount: number;
    plan: string;
    reference: string;
    email: string;
  };
  onContinue?: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ paymentData, onContinue }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Countdown timer for auto-redirect
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          handleContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(confettiTimer);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      navigate('/dashboard');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
            <div className="relative bg-green-500 rounded-full p-6">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-bounce" />
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to your new <span className="font-semibold capitalize text-indigo-600">{paymentData.plan}</span> plan!
            Your subscription is now active and ready to use.
          </p>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium capitalize">{paymentData.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{formatCurrency(paymentData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reference:</span>
                <span className="font-mono text-xs">{paymentData.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-xs">{paymentData.email}</span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h4 className="font-semibold text-blue-900 mb-3">What happens next?</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                Your account has been upgraded immediately
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                All premium features are now unlocked
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                Confirmation email has been sent to your inbox
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                You can start using advanced features right away
              </li>
            </ul>
          </div>

          {/* Auto Redirect */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Automatically redirecting to dashboard in:
            </p>
            <div className="text-2xl font-bold text-indigo-600 mb-2">
              {countdown}s
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={handleContinue}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full"
              size="lg"
            >
              Go to Dashboard
            </Button>
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => window.open('/subscription', '_blank')}
                className="flex-1"
                size="sm"
              >
                Manage Subscription
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.print()}
                icon={<Download className="w-4 h-4" />}
                className="flex-1"
                size="sm"
              >
                Download Receipt
              </Button>
            </div>
          </div>

          {/* Support Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Questions about your subscription? 
              <a href="mailto:support@assetmanager.com" className="text-indigo-600 hover:text-indigo-700 ml-1">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
