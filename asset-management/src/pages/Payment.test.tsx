import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaymentCaalback from '../pages/PaymentCallback';
import PaymentCallback from '../pages/PaymentCallback';

// Mock Stripe
const mockStripe = {
  confirmCardPayment: vi.fn(),
  elements: vi.fn(),
};

const mockElements = {
  create: vi.fn().mockReturnValue({
    mount: vi.fn(),
    unmount: vi.fn(),
    on: vi.fn(),
    focus: vi.fn(),
  }),
};

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue(mockStripe),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: any) => children,
  useStripe: () => mockStripe,
  useElements: () => mockElements,
  CardElement: () => <div data-testid="card-element">Card Element</div>,
}));

// Mock payment service
const mockPaymentService = {
  createPaymentIntent: vi.fn(),
  processPayment: vi.fn(),
};

vi.mock('../services/payment', () => ({
  paymentService: mockPaymentService,
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Payment Component', () => {
  const mockOrder = {
    id: '123',
    amount: 99.99,
    currency: 'usd',
    items: [
      { id: '1', name: 'Product 1', price: 49.99, quantity: 1 },
      { id: '2', name: 'Product 2', price: 49.99, quantity: 1 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders payment form with order summary', () => {
    render(<PaymentCaalback order={mockOrder} />);

    expect(screen.getByText(/payment details/i)).toBeInTheDocument();
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByTestId('card-element')).toBeInTheDocument();
  });

  it('displays billing form fields', () => {
    render(<PaymentCaalback order={mockOrder} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('validates required billing fields', async () => {
    const user = userEvent.setup();
    
    render(<PaymentCallback order={mockOrder} />);

    const payButton = screen.getByRole('button', { name: /pay now/i });
    await user.click(payButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    
    render(<PaymentCallback order={mockOrder} />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const payButton = screen.getByRole('button', { name: /pay now/i });
    await user.click(payButton);

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('processes successful payment', async () => {
    const user = userEvent.setup();
    
    mockPaymentService.createPaymentIntent.mockResolvedValue({
      client_secret: 'pi_test_client_secret',
    });

    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: {
        status: 'succeeded',
        id: 'pi_123',
      },
    });

    render(<PaymentCallback order={mockOrder} />);

    // Fill in billing details
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/address/i), '123 Main St');
    await user.type(screen.getByLabelText(/city/i), 'New York');
    await user.type(screen.getByLabelText(/postal code/i), '10001');

    const payButton = screen.getByRole('button', { name: /pay now/i });
    await user.click(payButton);

    await waitFor(() => {
      expect(mockPaymentService.createPaymentIntent).toHaveBeenCalledWith({
        amount: mockOrder.amount,
        currency: mockOrder.currency,
        orderId: mockOrder.id,
      });
    });

    await waitFor(() => {
      expect(mockStripe.confirmCardPayment).toHaveBeenCalled();
    });
  });

  it('handles payment failure', async () => {
    const user = userEvent.setup();
    
    mockPaymentService.createPaymentIntent.mockResolvedValue({
      client_secret: 'pi_test_client_secret',
    });

    mockStripe.confirmCardPayment.mockResolvedValue({
      error: {
        message: 'Your card was declined.',
        type: 'card_error',
      },
    });

    render(<PaymentCallback order={mockOrder} />);

    // Fill in billing details
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/address/i), '123 Main St');

    const payButton = screen.getByRole('button', { name: /pay now/i });
    await user.click(payButton);

    await waitFor(() => {
      expect(screen.getByText(/your card was declined/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during payment processing', async () => {
    const user = userEvent.setup();
    
    mockPaymentService.createPaymentIntent.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<PaymentCallback order={mockOrder} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/address/i), '123 Main St');

    const payButton = screen.getByRole('button', { name: /pay now/i });
    await user.click(payButton);

    expect(screen.getByText(/processing payment/i)).toBeInTheDocument();
    expect(payButton).toBeDisabled();
  });

  it('calculates total correctly with tax', () => {
    const orderWithTax = {
      ...mockOrder,
      tax: 8.99,
      shipping: 5.00,
    };

    render(<PaymentCallback order={orderWithTax} />);

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Tax')).toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('$113.98')).toBeInTheDocument(); // 99.99 + 8.99 + 5.00
  });

  it('handles payment intent creation failure', async () => {
    const user = userEvent.setup();
    
    mockPaymentService.createPaymentIntent.mockRejectedValue(
      new Error('Failed to create payment intent')
    );

    render(<PaymentCallback order={mockOrder} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/address/i), '123 Main St');

    const payButton = screen.getByRole('button', { name: /pay now/i });
    await user.click(payButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to create payment intent/i)).toBeInTheDocument();
    });
  });
});