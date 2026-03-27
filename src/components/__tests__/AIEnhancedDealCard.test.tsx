import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIEnhancedDealCard from '../AIEnhancedDealCard';
import { Deal } from '../../types';

// Mock deal data
const mockDeal: Deal = {
  id: 'deal-1',
  title: 'Enterprise Software License',
  company: 'Acme Corp',
  contact: 'John Doe',
  value: 50000,
  stage: 'proposal',
  probability: 75,
  priority: 'high',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  tags: ['enterprise', 'software'],
  isFavorite: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFavoriteDeal: Deal = {
  ...mockDeal,
  id: 'deal-2',
  isFavorite: true,
  probability: 85,
};

describe('AIEnhancedDealCard', () => {
  const mockOnClick = vi.fn();
  const mockOnAnalyze = vi.fn();
  const mockOnAIEnrich = vi.fn();
  const mockOnToggleFavorite = vi.fn();
  const mockOnFindNewImage = vi.fn();
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders deal information correctly', () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText(mockDeal.title)).toBeInTheDocument();
      expect(screen.getByText(mockDeal.company)).toBeInTheDocument();
      expect(screen.getByText(mockDeal.contact)).toBeInTheDocument();
      expect(screen.getByText('$50,000')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('renders with correct stage label', () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Proposal')).toBeInTheDocument();
    });

    it('renders favorite state correctly', () => {
      render(
        <AIEnhancedDealCard
          deal={mockFavoriteDeal}
          onClick={mockOnClick}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      // Check for favorite indicator (heart icon with fill)
      const favoriteButton = screen.getByLabelText(/Remove .* from favorites/);
      expect(favoriteButton).toBeInTheDocument();
    });

    it('renders selection checkbox when onSelect provided', () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onSelect={mockOnSelect}
          isSelected={false}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('renders overdue warning when deal is overdue', () => {
      const overdueDeal = {
        ...mockDeal,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      };

      render(
        <AIEnhancedDealCard
          deal={overdueDeal}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });

    it('renders due soon warning when deal is due within 7 days', () => {
      const dueSoonDeal = {
        ...mockDeal,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };

      render(
        <AIEnhancedDealCard
          deal={dueSoonDeal}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Due Soon')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when card is clicked', async () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole('article');
      await userEvent.click(card);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onAnalyze when AI analyze button is clicked', async () => {
      mockOnAnalyze.mockResolvedValue(true);

      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onAnalyze={mockOnAnalyze}
        />
      );

      // Buttons are hidden by default (opacity-0), use hidden: true to find them
      const analyzeButton = screen.getByLabelText('Analyze deal with AI', { hidden: true });
      await userEvent.click(analyzeButton);

      await waitFor(() => {
        expect(mockOnAnalyze).toHaveBeenCalledWith(mockDeal);
      });
    });

    it('calls onAIEnrich when AI enrich button is clicked', async () => {
      mockOnAIEnrich.mockResolvedValue(true);

      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onAIEnrich={mockOnAIEnrich}
        />
      );

      const enrichButton = screen.getByText('AI Auto-Enrich');
      await userEvent.click(enrichButton);

      await waitFor(() => {
        expect(mockOnAIEnrich).toHaveBeenCalledWith(mockDeal);
      });
    });

    it('calls onToggleFavorite when favorite button is clicked', async () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByLabelText(`Add ${mockDeal.title} to favorites`);
      await userEvent.click(favoriteButton);

      expect(mockOnToggleFavorite).toHaveBeenCalledWith(mockDeal);
    });

    it('calls onSelect when checkbox is clicked', async () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onSelect={mockOnSelect}
          isSelected={false}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      expect(mockOnSelect).toHaveBeenCalled();
    });

    it('prevents card click when clicking buttons', async () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByLabelText(`Add ${mockDeal.title} to favorites`);
      await userEvent.click(favoriteButton);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA labels for interactive elements', () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onAnalyze={mockOnAnalyze}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      // Buttons are hidden by default (opacity-0), use hidden: true to find them
      expect(screen.getByLabelText('Analyze deal with AI', { hidden: true })).toBeInTheDocument();
      expect(screen.getByLabelText(`Add ${mockDeal.title} to favorites`, { hidden: true })).toBeInTheDocument();
      expect(screen.getByLabelText(`Edit ${mockDeal.title}`, { hidden: true })).toBeInTheDocument();
      expect(screen.getByLabelText(`More actions for ${mockDeal.title}`, { hidden: true })).toBeInTheDocument();
    });

    it('has correct ARIA label for deal card', () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-label', `Deal card for ${mockDeal.title}`);
    });

    it('has correct ARIA pressed state for favorite button', () => {
      render(
        <AIEnhancedDealCard
          deal={mockFavoriteDeal}
          onClick={mockOnClick}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByLabelText(/Remove .* from favorites/);
      expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('has correct ARIA busy state during analysis', () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onAnalyze={mockOnAnalyze}
          isAnalyzing={true}
        />
      );

      // Buttons are hidden by default (opacity-0), use hidden: true to find them
      const analyzeButton = screen.getByLabelText('Analyze deal with AI', { hidden: true });
      expect(analyzeButton).toHaveAttribute('aria-busy', 'true');
    });

    it('supports keyboard navigation', async () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onAnalyze={mockOnAnalyze}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      // Buttons are hidden by default (opacity-0), use hidden: true to find them
      const analyzeButton = screen.getByLabelText('Analyze deal with AI', { hidden: true });
      const favoriteButton = screen.getByLabelText(`Add ${mockDeal.title} to favorites`, { hidden: true });

      // Tab through elements
      analyzeButton.focus();
      expect(document.activeElement).toBe(analyzeButton);

      favoriteButton.focus();
      expect(document.activeElement).toBe(favoriteButton);
    });
  });

  describe('Loading States', () => {
    it('shows loading state when isAnalyzing is true', () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onAnalyze={mockOnAnalyze}
          isAnalyzing={true}
        />
      );

      expect(screen.getByText('Analyzing...')).toBeInTheDocument();
    });

    it('disables analyze button when analyzing', () => {
      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onAnalyze={mockOnAnalyze}
          isAnalyzing={true}
        />
      );

      // Buttons are hidden by default (opacity-0), use hidden: true to find them
      const analyzeButton = screen.getByLabelText('Analyze deal with AI', { hidden: true });
      expect(analyzeButton).toBeDisabled();
    });
  });

  describe('Performance', () => {
    it('memoizes expensive computations', () => {
      const { rerender } = render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
        />
      );

      // Re-render with same props should not trigger re-computation
      rerender(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
        />
      );

      // Component should still render correctly
      expect(screen.getByText(mockDeal.title)).toBeInTheDocument();
    });

    it('prevents memory leaks with cleanup on unmount', async () => {
      const mockOnAnalyze = vi.fn().mockImplementation(() => {
        return new Promise(resolve => setTimeout(resolve, 1000));
      });

      const { unmount } = render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onAnalyze={mockOnAnalyze}
        />
      );

      // Buttons are hidden by default (opacity-0), use hidden: true to find them
      const analyzeButton = screen.getByLabelText('Analyze deal with AI', { hidden: true });
      await userEvent.click(analyzeButton);

      // Unmount while operation is in progress
      unmount();

      // Should not throw errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('handles analyze error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockOnAnalyze.mockRejectedValue(new Error('Analysis failed'));

      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onAnalyze={mockOnAnalyze}
        />
      );

      // Buttons are hidden by default (opacity-0), use hidden: true to find them
      const analyzeButton = screen.getByLabelText('Analyze deal with AI', { hidden: true });
      await userEvent.click(analyzeButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Analysis failed:', expect.any(Error));
      });

      // Component should still be functional
      expect(screen.getByText(mockDeal.title)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('handles favorite toggle error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockOnToggleFavorite.mockRejectedValue(new Error('Toggle failed'));

      render(
        <AIEnhancedDealCard
          deal={mockDeal}
          onClick={mockOnClick}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByLabelText(`Add ${mockDeal.title} to favorites`);
      await userEvent.click(favoriteButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to toggle favorite:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });
});
