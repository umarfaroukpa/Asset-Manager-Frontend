import React, { useState, useEffect } from 'react';
import { Clock, Crown, CreditCard, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './common/Button';

interface TrialBannerProps {
  daysLeft?: number;
  onDismiss?: () => void;
  showDismiss?: boolean;
}

const TrialBanner: React.FC<TrialBannerProps> = ({ 
  daysLeft = 7,
  onDismiss,
  showDismiss = true 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide after dismissal or if trial ended
  useEffect(() => {
    const dismissedKey = 'trial-banner-dismissed';
    const isDismissed = localStorage.getItem(dismissedKey) === 'true';
    
    if (isDismissed || daysLeft <= 0) {
      setIsVisible(false);
    }
  }, [daysLeft]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('trial-banner-dismissed', 'true');
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getBannerStyle = () => {
    if (daysLeft <= 2) {
      return 'bg-gradient-to-r from-red-500 to-red-600 border-red-700';
    } else if (daysLeft <= 5) {
      return 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-700';
    } else {
      return 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-700';
    }
  };

  const getUrgencyMessage = () => {
    if (daysLeft <= 1) {
      return {
        title: '🚨 Trial Expires Today!',
        message: 'Your free trial ends today. Upgrade now to keep all your data and features.'
      };
    } else if (daysLeft <= 2) {
      return {
        title: '⏰ Trial Expires Soon!',
        message: `Only ${daysLeft} days left in your free trial. Don't lose access to your assets!`
      };
    } else {
      return {
        title: '✨ You\'re on a Free Trial',
        message: `${daysLeft} days remaining to explore all premium features.`
      };
    }
  };

  const urgency = getUrgencyMessage();

  return (
    <div className={`relative rounded-lg border-2 p-6 mb-6 text-white ${getBannerStyle()}`}>
      {/* Dismiss Button */}
      {showDismiss && (
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            {daysLeft <= 2 ? (
              <Clock className="w-6 h-6 text-white" />
            ) : (
              <Crown className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-2">{urgency.title}</h3>
          <p className="text-white/90 mb-4">{urgency.message}</p>

          {/* Trial Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>Trial Progress</span>
              <span>{Math.max(0, 14 - daysLeft)} of 14 days used</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, (14 - daysLeft) / 14 * 100))}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/checkout">
              <Button
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100 border-0"
                icon={<CreditCard className="w-4 h-4" />}
              >
                Upgrade Now
              </Button>
            </Link>
            
            <Link to="/subscription">
              <Button
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/20 border border-white/30"
              >
                View Trial Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits List */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h4 className="text-sm font-semibold text-white/90 mb-3">What you'll get with a paid plan:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-white/80">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span>Unlimited assets & users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span>Advanced reporting & analytics</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span>Priority customer support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;
