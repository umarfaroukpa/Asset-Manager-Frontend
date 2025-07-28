import apiClient from './api';

export interface SubscriptionData {
  plan: 'starter' | 'professional' | 'enterprise';
  assetCount: number;
  userCount: number;
  billingCycle: 'monthly' | 'annual';
}

export interface PaymentData {
  amount: number; // in kobo
  email: string;
  reference: string;
  callback_url: string;
  metadata: {
    plan: string;
    assetCount: number;
    userCount: number;
    billingCycle: string;
  };
}

const PLAN_PRICING = {
  starter: { base: 5000, perAsset: 200, perUser: 1000 },
  professional: { base: 15000, perAsset: 150, perUser: 800 },
  enterprise: { base: 50000, perAsset: 100, perUser: 500 },
};

function calculatePrice(subscription: SubscriptionData): number {
  const plan = PLAN_PRICING[subscription.plan];
  let price = plan.base;
  price += (subscription.assetCount - 1) * plan.perAsset;
  price += (subscription.userCount - 1) * plan.perUser;
  if (subscription.billingCycle === 'annual') {
    price = price * 12 * 0.85; // 15% discount for annual
  }
  return Math.round(price);
}

async function initializePayment(paymentData: PaymentData): Promise<any> {
  // Make a real API call to the backend payment endpoint
  try {
    const response = await apiClient.post('/payments/initialize', paymentData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to initialize payment.');
  }
}

const paymentService = {
  calculatePrice,
  initializePayment,
};

export default paymentService; 