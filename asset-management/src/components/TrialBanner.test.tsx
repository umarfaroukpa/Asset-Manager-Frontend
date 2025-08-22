import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import TrialBanner from './TrialBanner';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Wrapper component for Router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('TrialBanner Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders trial banner with default props', () => {
    render(
      <RouterWrapper>
        <TrialBanner />
      </RouterWrapper>
    );

    expect(screen.getByText('✨ You\'re on a Free Trial')).toBeInTheDocument();
    expect(screen.getByText('7 days remaining to explore all premium features.')).toBeInTheDocument();
    expect(screen.getByText('Upgrade Now')).toBeInTheDocument();
    expect(screen.getByText('View Trial Details')).toBeInTheDocument();
  });

  it('shows urgent message when trial expires soon', () => {
    render(
      <RouterWrapper>
        <TrialBanner daysLeft={2} />
      </RouterWrapper>
    );

    expect(screen.getByText('⏰ Trial Expires Soon!')).toBeInTheDocument();
    expect(screen.getByText('Only 2 days left in your free trial. Don\'t lose access to your assets!')).toBeInTheDocument();
  });

  it('shows critical message when trial expires today', () => {
    render(
      <RouterWrapper>
        <TrialBanner daysLeft={1} />
      </RouterWrapper>
    );

    expect(screen.getByText('🚨 Trial Expires Today!')).toBeInTheDocument();
    expect(screen.getByText('Your free trial ends today. Upgrade now to keep all your data and features.')).toBeInTheDocument();
  });

  it('applies correct styling based on days left', () => {
    const { rerender } = render(
      <RouterWrapper>
        <TrialBanner daysLeft={7} />
      </RouterWrapper>
    );

    // Should have blue gradient for normal trial
    expect(screen.getByText('✨ You\'re on a Free Trial').closest('div')).toHaveClass('from-blue-500');

    rerender(
      <RouterWrapper>
        <TrialBanner daysLeft={3} />
      </RouterWrapper>
    );

    // Should have orange gradient for warning
    expect(screen.getByText('⏰ Trial Expires Soon!').closest('div')).toHaveClass('from-orange-500');

    rerender(
      <RouterWrapper>
        <TrialBanner daysLeft={1} />
      </RouterWrapper>
    );

    // Should have red gradient for critical
    expect(screen.getByText('🚨 Trial Expires Today!').closest('div')).toHaveClass('from-red-500');
  });

  it('shows correct progress bar based on days left', () => {
    render(
      <RouterWrapper>
        <TrialBanner daysLeft={7} />
      </RouterWrapper>
    );

    expect(screen.getByText('7 of 14 days used')).toBeInTheDocument();
    
    // Check progress bar width (50% for 7 days used)
    const progressBar = screen.getByText('7 of 14 days used').parentElement?.querySelector('div[style*="width"]');
    expect(progressBar).toHaveStyle('width: 50%');
  });

  it('dismisses banner when dismiss button is clicked', async () => {
    const onDismiss = vi.fn();
    
    render(
      <RouterWrapper>
        <TrialBanner onDismiss={onDismiss} />
      </RouterWrapper>
    );

    const dismissButton = screen.getByLabelText('Dismiss banner');
    await user.click(dismissButton);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('trial-banner-dismissed', 'true');
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render when previously dismissed', () => {
    mockLocalStorage.getItem.mockReturnValue('true');

    render(
      <RouterWrapper>
        <TrialBanner />
      </RouterWrapper>
    );

    expect(screen.queryByText('✨ You\'re on a Free Trial')).not.toBeInTheDocument();
  });

  it('does not render when trial has ended', () => {
    render(
      <RouterWrapper>
        <TrialBanner daysLeft={0} />
      </RouterWrapper>
    );

    expect(screen.queryByText('✨ You\'re on a Free Trial')).not.toBeInTheDocument();
  });

  it('hides dismiss button when showDismiss is false', () => {
    render(
      <RouterWrapper>
        <TrialBanner showDismiss={false} />
      </RouterWrapper>
    );

    expect(screen.queryByLabelText('Dismiss banner')).not.toBeInTheDocument();
  });

  it('displays trial benefits section', () => {
    render(
      <RouterWrapper>
        <TrialBanner />
      </RouterWrapper>
    );

    expect(screen.getByText('What you\'ll get with a paid plan:')).toBeInTheDocument();
    expect(screen.getByText('Unlimited assets & users')).toBeInTheDocument();
    expect(screen.getByText('Advanced reporting & analytics')).toBeInTheDocument();
    expect(screen.getByText('Priority customer support')).toBeInTheDocument();
  });

  it('renders correct navigation links', () => {
    render(
      <RouterWrapper>
        <TrialBanner />
      </RouterWrapper>
    );

    const upgradeLink = screen.getByText('Upgrade Now').closest('a');
    const detailsLink = screen.getByText('View Trial Details').closest('a');

    expect(upgradeLink).toHaveAttribute('href', '/checkout');
    expect(detailsLink).toHaveAttribute('href', '/subscription');
  });

  it('shows correct icon based on urgency', () => {
    const { rerender } = render(
      <RouterWrapper>
        <TrialBanner daysLeft={7} />
      </RouterWrapper>
    );

    // Should show Crown icon for normal trial
    expect(screen.getByTestId('crown-icon')).toBeInTheDocument();

    rerender(
      <RouterWrapper>
        <TrialBanner daysLeft={1} />
      </RouterWrapper>
    );

    // Should show Clock icon for urgent trial
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('handles edge cases for progress calculation', () => {
    render(
      <RouterWrapper>
        <TrialBanner daysLeft={20} />
      </RouterWrapper>
    );

    // Should not show negative progress
    expect(screen.getByText('0 of 14 days used')).toBeInTheDocument();
    
    const progressBar = screen.getByText('0 of 14 days used').parentElement?.querySelector('div[style*="width"]');
    expect(progressBar).toHaveStyle('width: 0%');
  });
});
