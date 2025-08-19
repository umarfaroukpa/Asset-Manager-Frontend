import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Settings, 
  Download, 
  ArrowUpCircle,
  ArrowDownCircle,
  History,
  AlertCircle,
  Check,
  Clock,
  Users,
  Building
} from 'lucide-react';
import { useAuth } from '../hooks/authcontext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import PaymentModal from '../components/PaymentModal';
import PricingCalculator from '../components/billing/PricingCalculator';
import { toast } from 'react-toastify';
import paymentService, { SubscriptionData } from '../services/paymentService';

interface UserSubscription {
  id: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  billingCycle: 'monthly' | 'annual';
  currentPeriodEnd: string;
  currentPeriodStart: string;
  assetCount: number;
  userCount: number;
  amount: number;
  nextBillingDate: string;
  cancelAtPeriodEnd: boolean;
}

interface PaymentHistory {
  id: string;
  amount: number;
  status: 'successful' | 'failed' | 'pending';
  date: string;
  reference: string;
  plan: string;
  billingCycle: string;
  invoiceUrl?: string;
}

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [newSubscriptionData, setNewSubscriptionData] = useState<SubscriptionData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'history'>('overview');

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      await loadCurrentSubscription();
      await loadPaymentHistory();
    } catch (error) {
      console.error('Error loading subscription data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubscription = async () => {
    // Mock data - replace with actual API call
    const mockSubscription: UserSubscription = {
      id: 'sub_123',
      plan: 'professional',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: '2024-01-01',
      currentPeriodEnd: '2024-02-01',
      assetCount: 250,
      userCount: 5,
      amount: 45000, // in kobo
      nextBillingDate: '2024-02-01',
      cancelAtPeriodEnd: false
    };
    setSubscription(mockSubscription);
  };

  const loadPaymentHistory = async () => {
    // Mock data - replace with actual API call
    const mockHistory: PaymentHistory[] = [
      {
        id: 'pay_001',
        amount: 45000,
        status: 'successful',
        date: '2024-01-01',
        reference: 'PAY_12345',
        plan: 'professional',
        billingCycle: 'monthly',
        invoiceUrl: '#'
      },
      {
        id: 'pay_002',
        amount: 45000,
        status: 'successful',
        date: '2023-12-01',
        reference: 'PAY_12344',
        plan: 'professional',
        billingCycle: 'monthly',
        invoiceUrl: '#'
      }
    ];
    setPaymentHistory(mockHistory);
  };

  const handlePlanUpgrade = (pricingData: any) => {
    if (!pricingData) return;
    
    const subscriptionData: SubscriptionData = {
      plan: pricingData.plan,
      assetCount: pricingData.assetCount,
      userCount: pricingData.userCount,
      billingCycle: pricingData.billingCycle
    };

    setNewSubscriptionData(subscriptionData);
    setShowUpgradeModal(false);
    setShowPaymentModal(true);
  };

  const handleCancelSubscription = async () => {
    try {
      // TODO: Implement cancellation API call
      toast.success('Subscription will be canceled at the end of the current billing period');
      setShowCancelModal(false);
      await loadCurrentSubscription();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'past_due': return 'bg-red-100 text-red-800';
      case 'canceled': return 'bg-gray-100 text-gray-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'professional': return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'enterprise': return 'bg-orange-50 border-orange-200 text-orange-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-2">Manage your plan, billing, and payment history</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: Settings },
              { id: 'billing', name: 'Billing', icon: CreditCard },
              { id: 'history', name: 'Payment History', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && subscription && (
          <div className="space-y-8">
            {/* Current Plan Card */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPlanColor(subscription.plan)}`}>
                        {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {subscription.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-semibold">{formatCurrency(subscription.amount)}/{subscription.billingCycle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Assets</p>
                          <p className="font-semibold">{subscription.assetCount} assets</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Users</p>
                          <p className="font-semibold">{subscription.userCount} users</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="primary"
                      onClick={() => setShowUpgradeModal(true)}
                      icon={<ArrowUpCircle className="w-4 h-4" />}
                    >
                      Upgrade Plan
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel Plan
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Asset Usage</h3>
                  <Building className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Current Assets</span>
                    <span className="font-medium">{subscription.assetCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((subscription.assetCount / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Using {subscription.assetCount} of plan limit
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Usage</h3>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Active Users</span>
                    <span className="font-medium">{subscription.userCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min((subscription.userCount / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Using {subscription.userCount} of plan limit
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && subscription && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Current Billing Cycle</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Period Start:</span>
                      <span>{new Date(subscription.currentPeriodStart).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Period End:</span>
                      <span>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Billing:</span>
                      <span>{new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900">Amount:</span>
                      <span>{formatCurrency(subscription.amount)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Payment Method</h3>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="mt-3" size="sm">
                    Update Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="capitalize">{payment.plan}</span>
                        <span className="text-gray-500 ml-1">({payment.billingCycle})</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'successful' ? 'bg-green-100 text-green-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {payment.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.invoiceUrl && (
                          <button className="text-indigo-600 hover:text-indigo-700 flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        <Modal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          title="Upgrade Your Plan"
          size="lg"
        >
          <PricingCalculator
            userType="business"
            onSubmit={handlePlanUpgrade}
            initialAssetCount={subscription?.assetCount}
            initialUserCount={subscription?.userCount}
            showComparison={true}
          />
        </Modal>

        {newSubscriptionData && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            subscriptionData={newSubscriptionData}
            onSuccess={() => {
              setShowPaymentModal(false);
              toast.success('Plan upgraded successfully!');
              loadSubscriptionData();
            }}
            onError={(error) => {
              toast.error(`Upgrade failed: ${error}`);
            }}
          />
        )}

        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Subscription"
        >
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
              <div>
                <p className="text-gray-900 font-medium">Are you sure you want to cancel?</p>
                <p className="text-gray-600 text-sm mt-1">
                  Your subscription will remain active until {subscription?.nextBillingDate && new Date(subscription.nextBillingDate).toLocaleDateString()}.
                  You'll lose access to premium features after this date.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowCancelModal(false)}
                className="flex-1"
              >
                Keep Subscription
              </Button>
              <Button
                variant="primary"
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SubscriptionPage;
