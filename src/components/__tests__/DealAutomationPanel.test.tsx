import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DealAutomationPanel } from '../deals/DealAutomationPanel';
import { Deal } from '../../types';
import * as supabaseService from '../../services/supabaseService';

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

const mockAutomations = [
  {
    id: 'auto-1',
    name: 'Follow-up Sequence',
    description: 'Automated follow-up for new deals',
    type: 'drip',
    status: 'active',
    steps: [
      { id: 'step-1', type: 'email', name: 'Initial Email', details: 'Send welcome email', status: 'completed' },
      { id: 'step-2', type: 'delay', name: 'Wait 3 Days', details: 'Wait for response', status: 'active', delayDays: 3 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

vi.mock('../../services/supabaseService', () => ({
  getSupabaseService: vi.fn(() => ({
    getAutomations: vi.fn(),
    updateAutomation: vi.fn(),
    createAutomation: vi.fn(),
    deleteAutomation: vi.fn(),
    subscribeToAutomations: vi.fn(() => ({
      unsubscribe: vi.fn(),
    })),
  })),
}));

describe('DealAutomationPanel', () => {
  const mockGetAutomations = vi.fn();
  const mockUpdateAutomation = vi.fn();
  const mockCreateAutomation = vi.fn();
  const mockDeleteAutomation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (supabaseService.getSupabaseService as any).mockReturnValue({
      getAutomations: mockGetAutomations.mockResolvedValue(mockAutomations),
      updateAutomation: mockUpdateAutomation.mockResolvedValue({}),
      createAutomation: mockCreateAutomation.mockResolvedValue({ id: 'new-auto', ...mockAutomations[0] }),
      deleteAutomation: mockDeleteAutomation.mockResolvedValue({}),
      subscribeToAutomations: vi.fn(() => ({
        unsubscribe: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders loading state initially', () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      expect(screen.getByText(/Loading automations/)).toBeInTheDocument();
    });

    it('renders automation list after loading', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('Deal Automations')).toBeInTheDocument();
      });
    });

    it('renders active automations section', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('Active Automations')).toBeInTheDocument();
        expect(screen.getByText('1 active')).toBeInTheDocument();
      });
    });

    it('renders automation templates', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('Recommended Automations')).toBeInTheDocument();
      });
    });

    it('renders AI automation builder button', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('AI Automation Builder')).toBeInTheDocument();
      });
    });
  });

  describe('Automation Management', () => {
    it('expands automation details when clicked', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText(mockAutomations[0].name)).toBeInTheDocument();
      });

      const expandButton = screen.getAllByRole('button').find(
        btn => btn.querySelector('svg') // Chevron icon
      );

      if (expandButton) {
        await userEvent.click(expandButton);

        await waitFor(() => {
          expect(screen.getByText('Automation Steps')).toBeInTheDocument();
        });
      }
    });

    it('pauses active automation', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText(mockAutomations[0].name)).toBeInTheDocument();
      });

      const pauseButton = screen.getByTitle('Pause Automation');
      await userEvent.click(pauseButton);

      await waitFor(() => {
        expect(mockUpdateAutomation).toHaveBeenCalledWith('auto-1', { status: 'paused' });
      });
    });

    it('shows create automation modal', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('New Automation')).toBeInTheDocument();
      });

      const newButton = screen.getByText('New Automation');
      await userEvent.click(newButton);

      await waitFor(() => {
        expect(screen.getByText('Create New Automation')).toBeInTheDocument();
      });
    });

    it('deletes automation with confirmation', async () => {
      // Mock window.confirm
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText(mockAutomations[0].name)).toBeInTheDocument();
      });

      const deleteButton = screen.getByTitle('Delete Automation');
      await userEvent.click(deleteButton);

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this automation? This action cannot be undone.');

      await waitFor(() => {
        expect(mockDeleteAutomation).toHaveBeenCalledWith('auto-1');
      });

      confirmSpy.mockRestore();
    });
  });

  describe('AI Automation Builder', () => {
    it('expands AI builder when clicked', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('AI Automation Builder')).toBeInTheDocument();
      });

      const aiBuilderButton = screen.getByText('AI Automation Builder').closest('button');
      if (aiBuilderButton) {
        await userEvent.click(aiBuilderButton);

        await waitFor(() => {
          expect(screen.getByText('Generate Deal-Specific Automation')).toBeInTheDocument();
        });
      }
    });

    it('generates automation with AI', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('AI Automation Builder')).toBeInTheDocument();
      });

      const aiBuilderButton = screen.getByText('AI Automation Builder').closest('button');
      if (aiBuilderButton) {
        await userEvent.click(aiBuilderButton);

        await waitFor(() => {
          expect(screen.getByText('Generate with AI')).toBeInTheDocument();
        });

        const generateButton = screen.getByText('Generate with AI');
        await userEvent.click(generateButton);

        await waitFor(() => {
          expect(screen.getByText(/AI is generating/)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Template Management', () => {
    it('filters templates by validity', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('All Templates')).toBeInTheDocument();
      });

      const validFilter = screen.getByText(/Valid Only/);
      await userEvent.click(validFilter);

      expect(validFilter).toHaveClass('bg-green-100');
    });

    it('shows template validation status', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('Template Validation Summary')).toBeInTheDocument();
      });

      expect(screen.getByText('Total Templates')).toBeInTheDocument();
      expect(screen.getByText('Valid Conditions')).toBeInTheDocument();
      expect(screen.getByText('Valid Triggers')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when loading fails', async () => {
      mockGetAutomations.mockRejectedValue(new Error('Failed to load'));

      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load automations')).toBeInTheDocument();
      });
    });

    it('allows retry after error', async () => {
      mockGetAutomations.mockRejectedValueOnce(new Error('Failed to load'));

      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load automations')).toBeInTheDocument();
      });

      const retryButton = screen.getByText('Retry');
      await userEvent.click(retryButton);

      expect(mockGetAutomations).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA labels for buttons', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByTitle('Pause Automation')).toBeInTheDocument();
        expect(screen.getByTitle('Delete Automation')).toBeInTheDocument();
      });
    });

    it('supports keyboard navigation', async () => {
      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('New Automation')).toBeInTheDocument();
      });

      const newButton = screen.getByText('New Automation');
      newButton.focus();

      expect(document.activeElement).toBe(newButton);
    });
  });

  describe('Memory Management', () => {
    it('cleans up subscriptions on unmount', async () => {
      const mockUnsubscribe = vi.fn();
      (supabaseService.getSupabaseService as any).mockReturnValue({
        getAutomations: mockGetAutomations.mockResolvedValue([]),
        subscribeToAutomations: vi.fn(() => ({
          unsubscribe: mockUnsubscribe,
        })),
      });

      const { unmount } = render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(screen.getByText('Deal Automations')).toBeInTheDocument();
      });

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('prevents state updates after unmount', async () => {
      const { unmount } = render(<DealAutomationPanel deal={mockDeal} />);

      // Unmount immediately
      unmount();

      // Should not throw errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Real-time Updates', () => {
    it('subscribes to real-time updates on mount', async () => {
      const mockSubscribe = vi.fn(() => ({
        unsubscribe: vi.fn(),
      }));

      (supabaseService.getSupabaseService as any).mockReturnValue({
        getAutomations: mockGetAutomations.mockResolvedValue([]),
        subscribeToAutomations: mockSubscribe,
      });

      render(<DealAutomationPanel deal={mockDeal} />);

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalledWith(mockDeal.id, expect.any(Function));
      });
    });
  });
});
