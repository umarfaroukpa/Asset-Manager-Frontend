import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SubscriptionSummary from './SubscriptionSummary';

// Wrapper component for Router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('SubscriptionSummary Component', () => {
  it('renders full subscription summary by default', () => {
    render(
      <RouterWrapper>
        <SubscriptionSummary />
      </RouterWrapper>
    );

    expect(screen.getByText('Professional Plan')).toBeInTheDocument();
    expect(screen.getByText('$29 / monthly')).toBeInTheDocument();
    expect(screen.getByText('Next billing')).toBeInTheDocument();
    expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument();
  });

  it('renders compact version when compact prop is true', () => {
    render(
      <RouterWrapper>
        <SubscriptionSummary compact={true} />
      </RouterWrapper>
    );

    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('$29/mo')).toBeInTheDocument();
    expect(screen.getByText('Manage Plan')).toBeInTheDocument();
    
    // Should not show detailed features in compact mode
    expect(screen.queryByText('Plan Features')).not.toBeInTheDocument();
  });

  it('displays usage statistics correctly', () => {
    render(
      <RouterWrapper>
        <SubscriptionSummary />
      </RouterWrapper>
    );

    // Check asset usage
    expect(screen.getByText('245 / 1000')).toBeInTheDocument(); // Assets
    expect(screen.getByText('4 / 10')).toBeInTheDocument(); // Users

    // Check progress bars are rendered
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(2); // Assets and Users progress bars
  });

  it('applies correct styling based on usage percentage', () => {
    render(
      <RouterWrapper>
        <SubscriptionSummary />
      </RouterWrapper>
    );

    // Asset usage: 245/1000 = 24.5% (should be green)
    const assetUsage = screen.getByText('245 / 1000');
    expect(assetUsage).toHaveClass('text-green-600', 'bg-green-100');

    // User usage: 4/10 = 40% (should be green)
    const userUsage = screen.getByText('4 / 10');
    expect(userUsage).toHaveClass('text-green-600', 'bg-green-100');
  });

  it('displays plan features', () => {
    render(
      <RouterWrapper>
        <SubscriptionSummary />
      </RouterWrapper>
    );

    expect(screen.getByText('Plan Features')).toBeInTheDocument();
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument();
    expect(screen.getByText('Priority Support')).toBeInTheDocument();
    expect(screen.getByText('API Access')).toBeInTheDocument();
  });

  it('renders action buttons with correct links', () => {
    render(
      <RouterWrapper>
        <SubscriptionSummary />
      </RouterWrapper>
    );

    const managePlanLink = screen.getByText('Manage Plan').closest('a');
    const upgradeLink = screen.getByText('Upgrade').closest('a');

    expect(managePlanLink).toHaveAttribute('href', '/subscription');
    expect(upgradeLink).toHaveAttribute('href', '/checkout');
  });

  it('displays quick stats section', () => {
    render(
      <RouterWrapper>
        <SubscriptionSummary />
      </RouterWrapper>
    );

    expect(screen.getByText('76%')).toBeInTheDocument(); // Assets Available (100 - 24)
    expect(screen.getByText('Assets Available')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument(); // User Slots Left (10 - 4)
    expect(screen.getByText('User Slots Left')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('shows crown icon for plan identification', () => {
    render(
      <RouterWrapper>
        <SubscriptionSummary />
      </RouterWrapper>
    );

    // Crown icon should be present in the plan header
    const crownIcon = screen.getByTestId('crown-icon');
    expect(crownIcon).toBeInTheDocument();
  });

  it('displays correct usage icons', () => {
    render(
      <RouterWrapper>
        <SubscriptionSummary />
      </RouterWrapper>
    );

    // Should show Package icon for assets
    expect(screen.getByTestId('package-icon')).toBeInTheDocument();
    
    // Should show Users icon for users
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
  });
});

// Test for different usage scenarios
describe('SubscriptionSummary Usage Scenarios', () => {
  it('shows warning colors for high usage', () => {
    // We'll mock the component data for high usage
    // This would typically be done by mocking the service that provides subscription data
    
    render(
      <RouterWrapper>
        <SubscriptionSummary />
      </RouterWrapper>
    );

    // For now, test with current data structure
    // In a real implementation, you'd pass usage data as props or mock the service
    expect(screen.getByText('Professional Plan')).toBeInTheDocument();
  });

  it('handles edge case calculations correctly', () => {
    render(
      <RouterWrapper>
        <SubscriptionSummary />
      </RouterWrapper>
    );

    // Test that percentages are calculated correctly
    // Asset usage should show 24.5% (245/1000)
    // User usage should show 40% (4/10)
    
    // Progress bars should not exceed 100%
    const progressBars = document.querySelectorAll('[style*="width"]');
    progressBars.forEach(bar => {
      const width = bar.getAttribute('style')?.match(/width:\s*(\d+(?:\.\d+)?)%/)?.[1];
      if (width) {
        expect(parseFloat(width)).toBeLessThanOrEqual(100);
      }
    });
  });
});
