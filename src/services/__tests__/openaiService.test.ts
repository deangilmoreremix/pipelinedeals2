import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useOpenAI } from '../openaiService';
import { Contact } from '../../types/contact';

// Mock the API config
vi.mock('../../config/apiConfig', () => ({
  shouldUseRealAPIs: vi.fn(() => false),
}));

// Mock the real OpenAI service
vi.mock('../realOpenAIService', () => ({
  useRealOpenAI: vi.fn(() => {
    throw new Error('Real OpenAI not available in test');
  }),
}));

describe('OpenAI Service - Mock Mode', () => {
  let openaiService: ReturnType<typeof useOpenAI>;

  const mockContact: Contact = {
    id: 'contact-1',
    name: 'John Smith',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@acme.com',
    phone: '+1-555-123-4567',
    title: 'VP of Sales',
    company: 'Acme Corp',
    industry: 'Technology',
    status: 'prospect',
    interestLevel: 'hot',
    sources: ['LinkedIn', 'Referral'],
    customFields: {
      'Annual Revenue': '$10M',
      'Employee Count': '500',
    },
    notes: 'Met at tech conference, very interested',
    aiScore: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    openaiService = useOpenAI();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Contact Analysis', () => {
    it('analyzes contact and returns score', async () => {
      const result = await openaiService.analyzeContact(mockContact);

      expect(result).toHaveProperty('score');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('riskFactors');
      expect(Array.isArray(result.insights)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(Array.isArray(result.riskFactors)).toBe(true);
    });

    it('calculates higher score for hot leads', async () => {
      const hotContact = { ...mockContact, interestLevel: 'hot' as const };
      const result = await openaiService.analyzeContact(hotContact);

      expect(result.score).toBeGreaterThan(50);
    });

    it('calculates higher score for existing customers', async () => {
      const customerContact = { ...mockContact, status: 'customer' as const };
      const result = await openaiService.analyzeContact(customerContact);

      expect(result.score).toBeGreaterThan(50);
    });

    it('generates insights based on contact data', async () => {
      const result = await openaiService.analyzeContact(mockContact);

      expect(result.insights.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('identifies risk factors', async () => {
      const contactNoPhone = { ...mockContact, phone: '' };
      const result = await openaiService.analyzeContact(contactNoPhone);

      const hasPhoneRisk = result.riskFactors.some(risk => 
        risk.toLowerCase().includes('phone')
      );
      expect(hasPhoneRisk).toBe(true);
    });

    it('identifies churned customer risk', async () => {
      const churnedContact = { ...mockContact, status: 'churned' as const };
      const result = await openaiService.analyzeContact(churnedContact);

      const hasChurnRisk = result.riskFactors.some(risk => 
        risk.toLowerCase().includes('churn')
      );
      expect(hasChurnRisk).toBe(true);
    });

    it('completes within reasonable time', async () => {
      const start = Date.now();
      await openaiService.analyzeContact(mockContact);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('Email Generation', () => {
    it('generates email with subject line', async () => {
      const email = await openaiService.generateEmail(mockContact);

      expect(email).toContain('Subject:');
      expect(email).toContain(mockContact.firstName);
      expect(email).toContain(mockContact.company);
    });

    it('includes context when provided', async () => {
      const context = 'product demo follow-up';
      const email = await openaiService.generateEmail(mockContact, context);

      expect(email.toLowerCase()).toContain('follow');
    });

    it('generates professional email structure', async () => {
      const email = await openaiService.generateEmail(mockContact);

      expect(email).toContain('Hi');
      expect(email).toContain('Best regards');
      expect(email.length).toBeGreaterThan(200);
    });

    it('references contact title', async () => {
      const email = await openaiService.generateEmail(mockContact);

      expect(email).toContain(mockContact.title);
    });
  });

  describe('Insights Generation', () => {
    it('returns array of insights', async () => {
      const insights = await openaiService.getInsights(mockContact);

      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);
    });

    it('generates insights based on interest level', async () => {
      const hotContact = { ...mockContact, interestLevel: 'hot' as const };
      const insights = await openaiService.getInsights(hotContact);

      const hasHotInsight = insights.some(i => 
        i.toLowerCase().includes('hot') || i.toLowerCase().includes('priority')
      );
      expect(hasHotInsight).toBe(true);
    });

    it('generates insights based on referral source', async () => {
      const insights = await openaiService.getInsights(mockContact);

      const hasReferralInsight = insights.some(i => 
        i.toLowerCase().includes('referral')
      );
      expect(hasReferralInsight).toBe(true);
    });

    it('generates insights for existing customers', async () => {
      const customerContact = { ...mockContact, status: 'customer' as const };
      const insights = await openaiService.getInsights(customerContact);

      const hasCustomerInsight = insights.some(i => 
        i.toLowerCase().includes('customer') || i.toLowerCase().includes('expansion')
      );
      expect(hasCustomerInsight).toBe(true);
    });
  });

  describe('Deal Summary Generation', () => {
    const mockDeal = {
      id: 'deal-1',
      title: 'Enterprise License',
      company: 'TechCorp',
      contact: 'Jane Doe',
      value: 100000,
      stage: 'proposal',
      probability: 75,
      priority: 'high',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: 'Strong interest from CTO',
    };

    it('generates deal summary with key information', async () => {
      const summary = await openaiService.generateDealSummary(mockDeal);

      expect(summary).toContain(mockDeal.title);
      expect(summary).toContain(mockDeal.company);
      expect(summary).toContain('75%');
    });

    it('includes deal value in summary', async () => {
      const summary = await openaiService.generateDealSummary(mockDeal);

      expect(summary).toContain('$100,000');
    });

    it('includes stage-specific recommendations', async () => {
      const summary = await openaiService.generateDealSummary(mockDeal);

      expect(summary.length).toBeGreaterThan(100);
    });
  });

  describe('Next Actions Suggestion', () => {
    const mockDeal = {
      id: 'deal-1',
      title: 'Enterprise License',
      company: 'TechCorp',
      value: 100000,
      stage: 'qualification',
      probability: 40,
      priority: 'high',
    };

    it('suggests actions based on deal stage', async () => {
      const actions = await openaiService.suggestNextActions(mockDeal);

      expect(Array.isArray(actions)).toBe(true);
      expect(actions.length).toBeGreaterThan(0);
    });

    it('suggests different actions for different stages', async () => {
      const qualificationActions = await openaiService.suggestNextActions({
        ...mockDeal,
        stage: 'qualification',
      });

      const proposalActions = await openaiService.suggestNextActions({
        ...mockDeal,
        stage: 'proposal',
      });

      expect(qualificationActions).not.toEqual(proposalActions);
    });

    it('prioritizes high-priority deals', async () => {
      const highPriorityActions = await openaiService.suggestNextActions({
        ...mockDeal,
        priority: 'high',
      });

      const hasUrgentAction = highPriorityActions.some(action =>
        action.toLowerCase().includes('urgent') || action.toLowerCase().includes('escalate')
      );
      expect(hasUrgentAction).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('handles missing contact data gracefully', async () => {
      const incompleteContact = {
        ...mockContact,
        name: '',
        email: '',
      };

      const result = await openaiService.analyzeContact(incompleteContact);

      expect(result).toHaveProperty('score');
      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    it('handles empty notes', async () => {
      const contactNoNotes = { ...mockContact, notes: '' };
      
      const result = await openaiService.analyzeContact(contactNoNotes);

      expect(result).toHaveProperty('insights');
    });
  });

  describe('Performance', () => {
    it('handles multiple concurrent requests', async () => {
      const promises = Array.from({ length: 5 }, () =>
        openaiService.analyzeContact(mockContact)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toHaveProperty('score');
        expect(result.score).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
