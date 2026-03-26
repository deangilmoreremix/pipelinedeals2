import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { IntelligentAIService } from '../intelligentAIService';
import { useOpenAI } from '../openaiService';
import { useGeminiAI } from '../geminiService';

// Mock the services
vi.mock('../openaiService', () => ({
  useOpenAI: vi.fn(() => ({
    analyzeContact: vi.fn().mockResolvedValue({
      score: 85,
      insights: ['OpenAI insight'],
      recommendations: ['OpenAI recommendation'],
      riskFactors: [],
    }),
    generateEmail: vi.fn().mockResolvedValue('Subject: Test\n\nOpenAI generated email'),
    getInsights: vi.fn().mockResolvedValue(['OpenAI insight 1', 'OpenAI insight 2']),
    generateDealSummary: vi.fn().mockResolvedValue('OpenAI deal summary'),
    suggestNextActions: vi.fn().mockResolvedValue(['OpenAI action 1', 'OpenAI action 2']),
  })),
}));

vi.mock('../geminiService', () => ({
  useGeminiAI: vi.fn(() => ({
    analyzeContact: vi.fn().mockResolvedValue({
      score: 80,
      insights: ['Gemini insight'],
      recommendations: ['Gemini recommendation'],
      riskFactors: [],
    }),
    generateEmail: vi.fn().mockResolvedValue('Subject: Test\n\nGemini generated email'),
    getInsights: vi.fn().mockResolvedValue(['Gemini insight 1', 'Gemini insight 2']),
    generateDealSummary: vi.fn().mockResolvedValue('Gemini deal summary'),
    suggestNextActions: vi.fn().mockResolvedValue(['Gemini action 1', 'Gemini action 2']),
    researchCompany: vi.fn().mockResolvedValue({
      name: 'Test Company',
      industry: 'Technology',
      description: 'Gemini company description',
    }),
    findContactInfo: vi.fn().mockResolvedValue({
      name: 'John Doe',
      title: 'VP Sales',
      contactStrategy: 'Gemini strategy',
    }),
  })),
}));

describe('IntelligentAIService', () => {
  let intelligentAI: IntelligentAIService;
  let mockOpenAI: ReturnType<typeof useOpenAI>;
  let mockGemini: ReturnType<typeof useGeminiAI>;

  const mockContact = {
    id: 'contact-1',
    name: 'John Smith',
    email: 'john@example.com',
    company: 'Acme Corp',
    title: 'VP Sales',
    status: 'prospect',
    interestLevel: 'hot',
    sources: ['LinkedIn'],
    customFields: {},
    notes: '',
    aiScore: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDeal = {
    id: 'deal-1',
    title: 'Enterprise License',
    company: 'TechCorp',
    value: 100000,
    stage: 'proposal',
    probability: 75,
    priority: 'high',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockOpenAI = useOpenAI();
    mockGemini = useGeminiAI();
    intelligentAI = new IntelligentAIService(mockOpenAI, mockGemini);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Task Routing', () => {
    it('routes contact-analysis to Gemini by default', async () => {
      const result = await intelligentAI.analyzeContact(mockContact);

      expect(mockGemini.analyzeContact).toHaveBeenCalled();
      expect(mockOpenAI.analyzeContact).not.toHaveBeenCalled();
    });

    it('routes email-generation to OpenAI by default', async () => {
      await intelligentAI.generateEmail(mockContact, 'test context');

      expect(mockOpenAI.generateEmail).toHaveBeenCalled();
      expect(mockGemini.generateEmail).not.toHaveBeenCalled();
    });

    it('routes company-research to Gemini by default', async () => {
      await intelligentAI.researchCompany('Acme Corp', 'acme.com');

      expect(mockGemini.researchCompany).toHaveBeenCalled();
    });

    it('routes contact-research to Gemini by default', async () => {
      await intelligentAI.researchContact('John Smith', 'Acme Corp');

      expect(mockGemini.findContactInfo).toHaveBeenCalled();
    });

    it('adjusts routing based on speed priority', async () => {
      await intelligentAI.analyzeContact(mockContact, 'speed');

      expect(mockGemini.analyzeContact).toHaveBeenCalledWith(
        mockContact,
        'gemini-1.5-flash' // Should use faster model
      );
    });

    it('adjusts routing based on cost priority', async () => {
      await intelligentAI.analyzeContact(mockContact, 'cost');

      expect(mockGemini.analyzeContact).toHaveBeenCalledWith(
        mockContact,
        'gemma-2-2b-it' // Should use cheaper model
      );
    });
  });

  describe('Fallback Mechanism', () => {
    it('falls back to secondary provider when primary fails', async () => {
      // Make Gemini fail
      mockGemini.analyzeContact = vi.fn().mockRejectedValue(new Error('Gemini API error'));

      const result = await intelligentAI.analyzeContact(mockContact);

      expect(mockGemini.analyzeContact).toHaveBeenCalled();
      expect(mockOpenAI.analyzeContact).toHaveBeenCalled();
      expect(result).toHaveProperty('score');
    });

    it('returns fallback response when both providers fail', async () => {
      // Make both fail
      mockGemini.analyzeContact = vi.fn().mockRejectedValue(new Error('Gemini error'));
      mockOpenAI.analyzeContact = vi.fn().mockRejectedValue(new Error('OpenAI error'));

      const result = await intelligentAI.analyzeContact(mockContact);

      expect(result).toHaveProperty('score');
      expect(result.score).toBe(60); // Default fallback score
      expect(result.insights).toContain('Contact data available for analysis');
    });

    it('falls back for email generation', async () => {
      mockOpenAI.generateEmail = vi.fn().mockRejectedValue(new Error('OpenAI error'));

      const result = await intelligentAI.generateEmail(mockContact, 'test');

      expect(mockOpenAI.generateEmail).toHaveBeenCalled();
      expect(mockGemini.generateEmail).toHaveBeenCalled();
      expect(result).toContain('Subject:');
    });

    it('returns basic fallback email when both fail', async () => {
      mockOpenAI.generateEmail = vi.fn().mockRejectedValue(new Error('OpenAI error'));
      mockGemini.generateEmail = vi.fn().mockRejectedValue(new Error('Gemini error'));

      const result = await intelligentAI.generateEmail(mockContact, 'test');

      expect(result).toContain('Subject:');
      expect(result).toContain(mockContact.name);
    });
  });

  describe('Fallback Response Generation', () => {
    it('generates fallback contact analysis', async () => {
      mockGemini.analyzeContact = vi.fn().mockRejectedValue(new Error('Error'));
      mockOpenAI.analyzeContact = vi.fn().mockRejectedValue(new Error('Error'));

      const result = await intelligentAI.analyzeContact(mockContact);

      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('riskFactors');
    });

    it('generates fallback insights', async () => {
      mockGemini.getInsights = vi.fn().mockRejectedValue(new Error('Error'));
      mockOpenAI.getInsights = vi.fn().mockRejectedValue(new Error('Error'));

      const result = await intelligentAI.getInsights(mockContact);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('generates fallback deal summary', async () => {
      mockGemini.generateDealSummary = vi.fn().mockRejectedValue(new Error('Error'));
      mockOpenAI.generateDealSummary = vi.fn().mockRejectedValue(new Error('Error'));

      const result = await intelligentAI.generateDealSummary(mockDeal);

      expect(result).toContain(mockDeal.title);
      expect(result).toContain(mockDeal.company);
    });

    it('generates fallback next actions', async () => {
      mockGemini.suggestNextActions = vi.fn().mockRejectedValue(new Error('Error'));
      mockOpenAI.suggestNextActions = vi.fn().mockRejectedValue(new Error('Error'));

      const result = await intelligentAI.suggestNextActions(mockDeal);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Task Routing Information', () => {
    it('returns task routing information', () => {
      const routing = intelligentAI.getTaskRouting();

      expect(Array.isArray(routing)).toBe(true);
      expect(routing.length).toBeGreaterThan(0);

      const contactAnalysis = routing.find(r => r.task === 'contact-analysis');
      expect(contactAnalysis).toBeDefined();
      expect(contactAnalysis).toHaveProperty('primaryModel');
      expect(contactAnalysis).toHaveProperty('fallbackModel');
      expect(contactAnalysis).toHaveProperty('reason');
    });
  });

  describe('Error Handling', () => {
    it('handles unknown task types gracefully', async () => {
      // @ts-ignore - Testing unknown task
      const result = await intelligentAI.executeTask('unknown-task', {});

      expect(result).toBeDefined();
    });

    it('handles missing contact data', async () => {
      const incompleteContact = { ...mockContact, name: '' };

      const result = await intelligentAI.analyzeContact(incompleteContact);

      expect(result).toHaveProperty('score');
    });
  });

  describe('Performance', () => {
    it('completes tasks within reasonable time', async () => {
      const start = Date.now();
      await intelligentAI.analyzeContact(mockContact);
      const duration = Date.now() - start;

      // Mock is fast, but real API calls should be under 10 seconds
      expect(duration).toBeLessThan(1000);
    });

    it('handles concurrent requests', async () => {
      const promises = [
        intelligentAI.analyzeContact(mockContact),
        intelligentAI.generateEmail(mockContact, 'test'),
        intelligentAI.getInsights(mockContact),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(results[0]).toHaveProperty('score');
      expect(typeof results[1]).toBe('string');
      expect(Array.isArray(results[2])).toBe(true);
    });
  });
});
