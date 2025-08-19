import apiClient from './api';

export interface SubscriptionData {
  plan: 'starter' | 'professional' | 'enterprise';
  assetCount: number;
  userCount: number;
  billingCycle: 'monthly' | 'annual';
}

export interface PaymentData {
  amount: number; 
  email: string;
  reference?: string; 
  callback_url?: string; 
  metadata: {
    plan: string;
    assetCount: number;
    userCount: number;
    billingCycle: string;
    userId?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    amount: number;
    currency: string;
    reference: string;
    paid_at: string;
    metadata: any;
    transactionId: string;
  };
}

// Plan pricing configuration
const PLAN_PRICING = {
  starter: { base: 5000, perAsset: 200, perUser: 1000 },
  professional: { base: 15000, perAsset: 150, perUser: 800 },
  enterprise: { base: 50000, perAsset: 100, perUser: 500 },
};

/**
 * Calculate the price for a subscription based on plan, assets, users, and billing cycle
 */
function calculatePrice(subscription: SubscriptionData): number {
  const plan = PLAN_PRICING[subscription.plan];
  
  if (!plan) {
    throw new Error(`Invalid plan: ${subscription.plan}`);
  }
  
  // Base price
  let price = plan.base;
  
  // Add cost for additional assets (first asset is included)
  if (subscription.assetCount > 1) {
    price += (subscription.assetCount - 1) * plan.perAsset;
  }
  
  // Add cost for additional users (first user is included)
  if (subscription.userCount > 1) {
    price += (subscription.userCount - 1) * plan.perUser;
  }
  
  // Apply annual discount (15% off)
  if (subscription.billingCycle === 'annual') {
    price = price * 12 * 0.85; // 15% discount for annual
  }
  
  return Math.round(price);
}

/**
 * Initialize a payment with Paystack
 */
async function initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
  try {
    console.log('💳 Initializing payment with data:', {
      amount: paymentData.amount,
      email: paymentData.email,
      metadata: paymentData.metadata
    });

    // Validate payment data
    if (!paymentData.amount || paymentData.amount < 100) {
      throw new Error('Amount must be at least 100 kobo (1 naira)');
    }

    if (!paymentData.email) {
      throw new Error('Email is required');
    }

    // Ensure amount is an integer
    const processedData = {
      ...paymentData,
      amount: Math.round(paymentData.amount)
    };

    const response = await apiClient.post<PaymentResponse>('/payments/initialize', processedData);
    
    console.log('✅ Payment initialization successful:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('❌ Payment initialization error:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to initialize payment');
    }
  }
}

/**
 * Verify a payment with Paystack
 */
async function verifyPayment(reference: string): Promise<VerificationResponse> {
  try {
    if (!reference) {
      throw new Error('Payment reference is required');
    }

    console.log('🔍 Verifying payment with reference:', reference);

    const response = await apiClient.post<VerificationResponse>('/payments/verify', {
      reference
    });
    
    console.log('✅ Payment verification result:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('❌ Payment verification error:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to verify payment');
    }
  }
}

/**
 * Get payment history for the current user
 */
async function getPaymentHistory(page: number = 1, limit: number = 10) {
  try {
    console.log('📜 Fetching payment history...');

    const response = await apiClient.get('/payments/history', {
      params: { page, limit }
    });
    
    console.log('✅ Payment history retrieved:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('❌ Error fetching payment history:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to fetch payment history');
    }
  }
}

/**
 * Test Paystack connection
 */
async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔗 Testing Paystack connection...');

    const response = await apiClient.get('/payments/test');
    
    console.log('✅ Paystack connection test result:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('❌ Paystack connection test failed:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Connection test failed'
    };
  }
}

/**
 * Generate a unique payment reference
 */
function generateReference(): string {
  return `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format amount from kobo to naira
 */
function formatAmount(amountInKobo: number): string {
  const naira = amountInKobo / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(naira);
}

/**
 * Create payment data from subscription
 */
function createPaymentData(
  subscription: SubscriptionData,
  email: string,
  userId?: string,
  callbackUrl?: string
): PaymentData {
  const amount = calculatePrice(subscription);
  
  return {
    amount: amount * 100, // Convert to kobo
    email,
    reference: generateReference(),
    callback_url: callbackUrl || `${window.location.origin}/payment/callback`,
    metadata: {
      plan: subscription.plan,
      assetCount: subscription.assetCount,
      userCount: subscription.userCount,
      billingCycle: subscription.billingCycle,
      userId
    }
  };
}

/**
 * Get plan details including pricing
 */
function getPlanDetails(plan: string) {
  const planConfig = PLAN_PRICING[plan as keyof typeof PLAN_PRICING];
  
  if (!planConfig) {
    throw new Error(`Invalid plan: ${plan}`);
  }
  
  return {
    name: plan,
    basePrice: planConfig.base,
    perAssetPrice: planConfig.perAsset,
    perUserPrice: planConfig.perUser,
    features: getPlanFeatures(plan as SubscriptionData['plan'])
  };
}

/**
 * Get features for a plan
 */
function getPlanFeatures(plan: SubscriptionData['plan']): string[] {
  const features = {
    starter: [
      'Asset tracking & management',
      'Basic reporting',
      'Email support',
      'Mobile app access'
    ],
    professional: [
      'Everything in Starter',
      'Advanced reporting & analytics',
      'Custom fields & forms',
      'API access',
      'Priority support'
    ],
    enterprise: [
      'Everything in Professional',
      'Advanced integrations',
      'Custom branding',
      'Dedicated account manager',
      'On-premise deployment option'
    ]
  };
  
  return features[plan] || [];
}

// Export all functions and types
const paymentService = {
  calculatePrice,
  initializePayment,
  verifyPayment,
  getPaymentHistory,
  testConnection,
  generateReference,
  formatAmount,
  createPaymentData,
  getPlanDetails,
  getPlanFeatures
};

export default paymentService;