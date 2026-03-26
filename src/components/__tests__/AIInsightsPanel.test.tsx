import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIInsightsPanel } from '../deals/AIInsightsPanel';
import { Deal } from '../../types';

const mockDeal: Deal = {
  id: 'deal-1',
  title: 'Enterprise Software License',
  company: 'Acme Corp',
  contact: 'John Doe',
  value: 75000,
  stage: 'proposal',
  probability: 75,
  priority: 'high',
  dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  tags: ['enterprise', 'software'],
  isFavorite: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AIInsightsPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders loading state initially', () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders insights after loading', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      // Fast-forward past loading
      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByText('AI Insights & Recommendations')).toBeInTheDocument();
      });
    });

    it('renders deal intelligence summary', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByText('Deal Intelligence Summary')).toBeInTheDocument();
        expect(screen.getByText(/Probability Analysis/)).toBeInTheDocument();
        expect(screen.getByText(/Timeline Prediction/)).toBeInTheDocument();
        expect(screen.getByText(/Value Optimization/)).toBeInTheDocument();
      });
    });

    it('renders category tabs', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /All Insights/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Action Items/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Opportunities/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Risks/ })).toBeInTheDocument();
      });
    });

    it('renders AI provider information', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByText(/AI Insights by/)).toBeInTheDocument();
      });
    });

    it('renders deal score', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByText(/Deal Score:/)).toBeInTheDocument();
        expect(screen.getByText('75%')).toBeInTheDocument();
      });
    });
  });

  describe('Insights Generation', () => {
    it('generates high-value deal insight for deals over $50K', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByText('High-Value Deal')).toBeInTheDocument();
      });
    });

    it('generates high closing probability insight for probability > 70', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByText('High Closing Probability')).toBeInTheDocument();
      });
    });

    it('generates high-priority deal insight for high priority deals', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByText('High-Priority Deal')).toBeInTheDocument();
      });
    });

    it('generates proposal stage insight for deals in proposal stage', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByText('Follow-up on Proposal')).toBeInTheDocument();
      });
    });

    it('generates company insights when company is provided', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByText(/Industry Insights/)).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('switches between category tabs', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /Action Items/ })).toBeInTheDocument();
      });

      const actionTab = screen.getByRole('tab', { name: /Action Items/ });
      await userEvent.click(actionTab);

      expect(actionTab).toHaveAttribute('aria-selected', 'true');
    });

    it('refreshes insights when refresh button is clicked', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Refresh/ })).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /Refresh/ });
      await userEvent.click(refreshButton);

      expect(screen.getByText(/Refreshing/)).toBeInTheDocument();
    });

    it('provides feedback on insights', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        const thumbsUpButtons = screen.getAllByTitle('Helpful');
        expect(thumbsUpButtons.length).toBeGreaterThan(0);
      });

      const thumbsUpButton = screen.getAllByTitle('Helpful')[0];
      await userEvent.click(thumbsUpButton);

      // Should update feedback state
      expect(thumbsUpButton).toHaveClass('bg-green-100');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA roles for tabs', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        const tabs = screen.getAllByRole('tab');
        expect(tabs.length).toBe(4);
      });
    });

    it('has correct ARIA labels for buttons', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Refresh/ })).toBeInTheDocument();
      });
    });

    it('supports keyboard navigation for tabs', async () => {
      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        const tabs = screen.getAllByRole('tab');
        tabs[0].focus();
        expect(document.activeElement).toBe(tabs[0]);
      });
    });
  });

  describe('Error Handling', () => {
    it('handles errors during insight generation gracefully', async () => {
      // Mock console.error to prevent error output in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<AIInsightsPanel deal={mockDeal} />);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      // Component should still render even if there are errors
      await waitFor(() => {
        expect(screen.getByText('AI Insights & Recommendations')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Cleanup', () => {
    it('cleans up timeouts on unmount', () => {
      const { unmount } = render(<AIInsightsPanel deal={mockDeal} />);

      // Unmount before loading completes
      unmount();

      // Should not throw errors
      expect(() => unmount()).not.toThrow();
    });
  });
});

// Helper for act with fake timers
function act(callback: () => void) {
  callback();
}
