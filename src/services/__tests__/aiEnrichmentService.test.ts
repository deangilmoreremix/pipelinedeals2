import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAIEnrichmentService, ContactEnrichmentData, CompanyEnrichmentData } from '../aiEnrichmentService';
import { IntelligentAIService } from '../intelligentAIService';

// Mock dependencies
vi.mock('../intelligentAIService', () => ({
  IntelligentAIService: vi.fn().mockImplementation(() => ({
    researchContact: vi.fn().mockResolvedValue({
      title: 'VP Sales',
      phone: '+1-555-123-4567',
      linkedin: 'https://linkedin.com/in/johnsmith',
      department: 'Sales',
      location: 'San Francisco, CA',
      background: 'Experienced sales leader',
      aiProvider: '⚡ Gemini Flash',
    }),
    researchCompany: vi.fn().mockResolvedValue({
      industry: 'Technology',
      description: 'Leading tech company',
      employeeCount: '500-1000',
      headquarters: 'San Francisco, CA',
      logoUrl: 'https://example.com/logo.png',
      revenue: '$50M-$100M',
      competitors: ['Competitor1', 'Competitor2'],
      technologies: ['React', 'Node.js'],
      aiProvider: '🧠 Gemini Pro',
    }),
    generateDealSummary: vi.fn().mockResolvedValue('Deal summary'),
    suggestNextActions: vi.fn().mockResolvedValue(['Action 1', 'Action 2']),
    getInsights: vi.fn().mockResolvedValue(['Insight 1', 'Insight 2']),
  })),
}));

vi.mock('../openaiService', () => ({
  useOpenAI: vi.fn(() => ({})),
}));

vi.mock('../geminiService', () => ({
  useGeminiAI: vi.fn(() => ({})),
}));

describe('AIEnrichmentService', () => {
  let enrichmentService: ReturnType<typeof getAIEnrichmentService>;

  beforeEach(() => {
    vi.clearAllMocks();
    enrichmentService = getAIEnrichmentService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Contact Enrichment', () => {
    const mockContactData: Partial<ContactEnrichmentData> = {
      name: 'John Smith',
      email: 'john.smith@acme.com',
      company: 'Acme Corp',
      title: 'Sales Manager',
    };

    it('enriches contact with AI data', async () => {
      const result = await enrichmentService.enrichContact(mockContactData);

      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('linkedinUrl');
      expect(result).toHaveProperty('location');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('aiProvider');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('preserves original contact data', async () => {
      const result = await enrichmentService.enrichContact(mockContactData);

      expect(result.name).toBe(mockContactData.name);
      expect(result.email).toBe(mockContactData.email);
      expect(result.company).toBe(mockContactData.company);
    });

    it('returns fallback data when enrichment fails', async () => {
      // Mock the intelligent AI to fail
      const mockIntelligentAI = vi.mocked(IntelligentAIService).mock.results[0].value;
      mockIntelligentAI.researchContact = vi.fn().mockRejectedValue(new Error('API Error'));

      const result = await enrichmentService.enrichContact(mockContactData);

      expect(result).toHaveProperty('confidence', 0);
      expect(result).toHaveProperty('aiProvider', '❌ Enrichment Failed');
      expect(result.name).toBe(mockContactData.name); // Original data preserved
    });

    it('validates input before enrichment', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        company: '',
      };

      // Should handle gracefully
      const result = await enrichmentService.enrichContact(invalidData);

      expect(result).toBeDefined();
    });

    it('caches enrichment results', async () => {
      const mockIntelligentAI = vi.mocked(IntelligentAIService).mock.results[0].value;

      // First call
      await enrichmentService.enrichContact(mockContactData);
      const firstCallCount = mockIntelligentAI.researchContact.mock.calls.length;

      // Second call with same data should use cache
      await enrichmentService.enrichContact(mockContactData);
      const secondCallCount = mockIntelligentAI.researchContact.mock.calls.length;

      // Should not make additional API call
      expect(secondCallCount).toBe(firstCallCount);
    });

    it('sanitizes input data', async () => {
      const dataWithHtml = {
        name: '<script>alert("xss")</script>John Smith',
        email: 'john@example.com',
        company: 'Acme Corp',
      };

      const result = await enrichmentService.enrichContact(dataWithHtml);

      // Should sanitize the name
      expect(result.name).not.toContain('<script>');
    });
  });

  describe('Company Enrichment', () => {
    const mockCompanyData: Partial<CompanyEnrichmentData> = {
      name: 'Acme Corp',
      domain: 'acme.com',
    };

    it('enriches company with AI data', async () => {
      const result = await enrichmentService.enrichCompany(mockCompanyData);

      expect(result).toHaveProperty('industry');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('headquarters');
      expect(result).toHaveProperty('competitors');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('aiProvider');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('preserves original company data', async () => {
      const result = await enrichmentService.enrichCompany(mockCompanyData);

      expect(result.name).toBe(mockCompanyData.name);
      expect(result.domain).toBe(mockCompanyData.domain);
    });

    it('returns fallback data when enrichment fails', async () => {
      const mockIntelligentAI = vi.mocked(IntelligentAIService).mock.results[0].value;
      mockIntelligentAI.researchCompany = vi.fn().mockRejectedValue(new Error('API Error'));

      const result = await enrichmentService.enrichCompany(mockCompanyData);

      expect(result).toHaveProperty('confidence', 0);
      expect(result).toHaveProperty('aiProvider', '❌ Enrichment Failed');
    });

    it('validates input before enrichment', async () => {
      const invalidData = {
        name: '',
        domain: 'not-a-valid-url',
      };

      // Should handle gracefully
      const result = await enrichmentService.enrichCompany(invalidData);

      expect(result).toBeDefined();
    });

    it('requires company name for enrichment', async () => {
      const dataWithoutName = {
        domain: 'acme.com',
      };

      const result = await enrichmentService.enrichCompany(dataWithoutName);

      expect(result.confidence).toBe(0);
      expect(result.aiProvider).toBe('❌ Enrichment Failed');
    });
  });

  describe('Deal Enrichment', () => {
    const mockDealData = {
      title: 'Enterprise License',
      company: 'TechCorp',
      contact: 'John Doe',
      value: 100000,
      probability: 50,
    };

    it('enriches deal with AI insights', async () => {
      const result = await enrichmentService.enrichDeal(mockDealData);

      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('suggestedNextSteps');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('aiProvider');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('preserves original deal data', async () => {
      const result = await enrichmentService.enrichDeal(mockDealData);

      expect(result.title).toBe(mockDealData.title);
      expect(result.company).toBe(mockDealData.company);
      expect(result.value).toBe(mockDealData.value);
    });

    it('returns fallback data when enrichment fails', async () => {
      const mockIntelligentAI = vi.mocked(IntelligentAIService).mock.results[0].value;
      mockIntelligentAI.generateDealSummary = vi.fn().mockRejectedValue(new Error('API Error'));
      mockIntelligentAI.suggestNextActions = vi.fn().mockRejectedValue(new Error('API Error'));
      mockIntelligentAI.getInsights = vi.fn().mockRejectedValue(new Error('API Error'));

      const result = await enrichmentService.enrichDeal(mockDealData);

      expect(result).toHaveProperty('confidence', 0);
      expect(result).toHaveProperty('aiProvider', '❌ Enrichment Failed');
    });

    it('requires title and company for enrichment', async () => {
      const incompleteData = {
        title: '',
        company: '',
      };

      const result = await enrichmentService.enrichDeal(incompleteData);

      expect(result.confidence).toBe(0);
    });
  });

  describe('Image Finding', () => {
    it('generates contact image URL', async () => {
      const imageUrl = await enrichmentService.findContactImage('John Smith', 'Acme Corp');

      expect(imageUrl).toContain('dicebear.com');
      expect(imageUrl).toContain('john');
    });

    it('generates unique URLs for different names', async () => {
      const url1 = await enrichmentService.findContactImage('John Smith');
      const url2 = await enrichmentService.findContactImage('Jane Doe');

      expect(url1).not.toBe(url2);
    });
  });

  describe('Caching', () => {
    it('caches contact enrichment results', async () => {
      const mockIntelligentAI = vi.mocked(IntelligentAIService).mock.results[0].value;
      const contactData = { name: 'John Smith', email: 'john@example.com', company: 'Acme' };

      await enrichmentService.enrichContact(contactData);
      const callCount1 = mockIntelligentAI.researchContact.mock.calls.length;

      // Same data should use cache
      await enrichmentService.enrichContact(contactData);
      const callCount2 = mockIntelligentAI.researchContact.mock.calls.length;

      expect(callCount1).toBe(callCount2);
    });

    it('caches company enrichment results', async () => {
      const mockIntelligentAI = vi.mocked(IntelligentAIService).mock.results[0].value;
      const companyData = { name: 'Acme Corp', domain: 'acme.com' };

      await enrichmentService.enrichCompany(companyData);
      const callCount1 = mockIntelligentAI.researchCompany.mock.calls.length;

      // Same data should use cache
      await enrichmentService.enrichCompany(companyData);
      const callCount2 = mockIntelligentAI.researchCompany.mock.calls.length;

      expect(callCount1).toBe(callCount2);
    });

    it('does not cache error results', async () => {
      const mockIntelligentAI = vi.mocked(IntelligentAIService).mock.results[0].value;
      mockIntelligentAI.researchContact = vi.fn().mockRejectedValue(new Error('API Error'));

      const contactData = { name: 'Error Test', email: 'error@test.com', company: 'Test' };

      await enrichmentService.enrichContact(contactData);
      const callCount1 = mockIntelligentAI.researchContact.mock.calls.length;

      // Should retry on second call since error wasn't cached
      await enrichmentService.enrichContact(contactData);
      const callCount2 = mockIntelligentAI.researchContact.mock.calls.length;

      expect(callCount2).toBeGreaterThan(callCount1);
    });
  });

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      const mockIntelligentAI = vi.mocked(IntelligentAIService).mock.results[0].value;
      mockIntelligentAI.researchContact = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await enrichmentService.enrichContact({
        name: 'Test',
        email: 'test@example.com',
        company: 'Test Corp',
      });

      expect(result).toBeDefined();
      expect(result.confidence).toBe(0);
    });

    it('handles timeout errors gracefully', async () => {
      const mockIntelligentAI = vi.mocked(IntelligentAIService).mock.results[0].value;
      mockIntelligentAI.researchCompany = vi.fn().mockRejectedValue(new Error('Timeout'));

      const result = await enrichmentService.enrichCompany({
        name: 'Test Corp',
        domain: 'test.com',
      });

      expect(result).toBeDefined();
      expect(result.confidence).toBe(0);
    });
  });

  describe('Singleton Pattern', () => {
    it('returns same instance on multiple calls', () => {
      const instance1 = getAIEnrichmentService();
      const instance2 = getAIEnrichmentService();

      expect(instance1).toBe(instance2);
    });
  });
});
