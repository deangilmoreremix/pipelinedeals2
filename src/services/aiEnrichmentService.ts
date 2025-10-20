import { useOpenAI } from './openaiService';
import { useGeminiAI } from './geminiService';
import { IntelligentAIService } from './intelligentAIService';
import { validateAIContactAnalysis, validateAICompanyResearch, sanitizeString } from '../utils/validation';
import { handleZodError, handleAPIError, withRetry, AppError } from '../utils/errorHandling';

export interface ContactEnrichmentData {
  name?: string;
  title?: string;
  company?: string;
  industry?: string;
  phone?: string;
  email?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  website?: string;
  location?: string;
  avatar?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  notes?: string;
  confidence?: number;
  aiProvider?: string;
  extraData?: Record<string, any>;
}

export interface CompanyEnrichmentData {
  name?: string;
  domain?: string;
  industry?: string;
  description?: string;
  size?: string;
  founded?: string;
  headquarters?: string;
  logo?: string;
  revenue?: string;
  keyPeople?: Array<{name: string; title: string}>;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  competitors?: string[];
  technologiesUsed?: string[];
  fundingHistory?: string;
  confidence?: number;
  aiProvider?: string;
  extraData?: Record<string, any>;
}

export interface DealEnrichmentData {
  title?: string;
  company?: string;
  contact?: string;
  value?: number;
  probability?: number;
  insights?: string[];
  risks?: string[];
  recommendations?: string[];
  suggestedNextSteps?: string[];
  similarDeals?: Array<{title: string; outcome: string; value: number}>;
  confidence?: number;
  aiProvider?: string;
  extraData?: Record<string, any>;
}

class AIEnrichmentService {
  private intelligentAI: IntelligentAIService;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_TTL = 3600000; // 1 hour in ms

  constructor() {
    const openaiService = useOpenAI();
    const geminiService = useGeminiAI();
    this.intelligentAI = new IntelligentAIService(openaiService, geminiService);
  }

  private getCacheKey(data: any, type: 'contact' | 'company' | 'deal'): string {
    const keyParts = [];
    if (type === 'contact') {
      keyParts.push(data.email || data.name || '', data.company || '');
    } else if (type === 'company') {
      keyParts.push(data.name || '', data.domain || '');
    } else if (type === 'deal') {
      keyParts.push(data.title || '', data.company || '', data.id || '');
    }
    return `${type}:${keyParts.join('-').toLowerCase().replace(/\s+/g, '')}`;
  }

  private getFromCache(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setToCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async enrichContact(contactData: Partial<ContactEnrichmentData>): Promise<ContactEnrichmentData> {
    // Validate and sanitize input
    const validation = validateAIContactAnalysis(contactData);
    if (!validation.success) {
      throw handleZodError(validation.error);
    }

    const sanitizedData = {
      ...contactData,
      name: contactData.name ? sanitizeString(contactData.name) : undefined,
      email: contactData.email ? sanitizeString(contactData.email) : undefined,
      company: contactData.company ? sanitizeString(contactData.company) : undefined,
      title: contactData.title ? sanitizeString(contactData.title) : undefined,
    };

    const key = this.getCacheKey(sanitizedData, 'contact');
    const cached = this.getFromCache(key);
    if (cached) {
      console.log('📦 Cache hit for contact enrichment');
      return cached;
    }

    console.log(' Enriching contact data...');
    try {
      if (!sanitizedData.email && !sanitizedData.name) {
        throw new Error('Insufficient contact data for enrichment');
      }

      // Use intelligent AI to research contact
      let result: ContactEnrichmentData = {};
      
      if (sanitizedData.name && sanitizedData.company) {
        // If we have name and company, we can do deeper research
        const personName = sanitizedData.name;
        const companyName = sanitizedData.company;
        
        // Use the intelligent routing for contact research
        const contactInfo = await withRetry(
          () => this.intelligentAI.researchContact(
            personName,
            companyName,
            'speed' // Prioritize speed for contact enrichment
          ),
          2 // Retry up to 2 times for contact research
        );
        
        result = {
          title: contactInfo.title || sanitizedData.title,
          phone: contactInfo.phone || sanitizedData.phone,
          linkedinUrl: contactInfo.linkedin || sanitizedData.linkedinUrl,
          industry: contactInfo.department || sanitizedData.industry,
          location: contactInfo.location || sanitizedData.location,
          notes: contactInfo.background || '',
          socialProfiles: {
            linkedin: contactInfo.linkedin || sanitizedData.socialProfiles?.linkedin,
          },
          confidence: 70,
          aiProvider: contactInfo.aiProvider || '⚡ Gemini Flash'
        };
      } else {
        // Basic enrichment with available data
        result = {
          confidence: 40,
          aiProvider: '💡 Basic Enrichment',
          notes: 'Limited data available for enrichment. Consider adding more contact details.'
        };
      }

      const enriched = {
        ...sanitizedData,
        ...result
      };
      this.setToCache(key, enriched);
      return enriched;
    } catch (error) {
      console.error('❌ Contact enrichment failed:', error);

      // Log structured error for monitoring
      if (error instanceof AppError) {
        console.error(`AppError [${error.code}]: ${error.message}`, error.details);
      }

      const fallback = {
        ...sanitizedData,
        confidence: 0,
        aiProvider: '❌ Enrichment Failed',
        notes: 'Failed to enrich contact data. Please try again later.'
      };
      // Don't cache errors
      return fallback;
    }
  }

  async enrichCompany(companyData: Partial<CompanyEnrichmentData>): Promise<CompanyEnrichmentData> {
    // Validate input
    const validation = validateAICompanyResearch({
      companyName: companyData.name || '',
      domain: companyData.domain
    });
    if (!validation.success) {
      throw handleZodError(validation.error);
    }

    const sanitizedData = {
      ...companyData,
      name: companyData.name ? sanitizeString(companyData.name) : undefined,
      domain: companyData.domain ? sanitizeString(companyData.domain) : undefined,
    };

    const key = this.getCacheKey(sanitizedData, 'company');
    const cached = this.getFromCache(key);
    if (cached) {
      console.log('📦 Cache hit for company enrichment');
      return cached;
    }

    console.log('� Enriching company data...');
    try {
      if (!sanitizedData.name) {
        throw new Error('Company name is required for enrichment');
      }
      
      // Use the intelligent AI for company research
      const companyInfo = await withRetry(
        () => this.intelligentAI.researchCompany(
          sanitizedData.name!,
          sanitizedData.domain,
          'quality' // Prioritize quality for company research
        ),
        2 // Retry up to 2 times for company research
      );
      
      const result: CompanyEnrichmentData = {
        industry: companyInfo.industry || sanitizedData.industry,
        description: companyInfo.description || sanitizedData.description,
        size: companyInfo.employeeCount || sanitizedData.size,
        headquarters: companyInfo.headquarters || sanitizedData.headquarters,
        logo: companyInfo.logoUrl || sanitizedData.logo,
        revenue: companyInfo.revenue || sanitizedData.revenue,
        competitors: companyInfo.competitors || sanitizedData.competitors,
        technologiesUsed: companyInfo.technologies || sanitizedData.technologiesUsed,
        confidence: 80,
        aiProvider: companyInfo.aiProvider || '🧠 Gemini Pro'
      };
      
      const enriched = {
        ...sanitizedData,
        ...result
      };
      this.setToCache(key, enriched);
      return enriched;
    } catch (error) {
      console.error('❌ Company enrichment failed:', error);

      // Log structured error for monitoring
      if (error instanceof AppError) {
        console.error(`AppError [${error.code}]: ${error.message}`, error.details);
      }

      const fallback = {
        ...sanitizedData,
        confidence: 0,
        aiProvider: '❌ Enrichment Failed',
        notes: 'Failed to enrich company data. Please try again later.'
      };
      // Don't cache errors
      return fallback;
    }
  }

  async enrichDeal(dealData: Partial<DealEnrichmentData>): Promise<DealEnrichmentData> {
    const key = this.getCacheKey(dealData, 'deal');
    const cached = this.getFromCache(key);
    if (cached) {
      console.log('📦 Cache hit for deal enrichment');
      return cached;
    }

    console.log('� Enriching deal data...');
    try {
      if (!dealData.title || !dealData.company) {
        throw new Error('Deal title and company are required for enrichment');
      }
      
      // Use AI to analyze the deal
      const dealSummary = await this.intelligentAI.generateDealSummary(dealData, 'quality');
      const nextActions = await this.intelligentAI.suggestNextActions(dealData, 'quality');
      const insights = await this.intelligentAI.getInsights(dealData, 'quality');
      
      const result: DealEnrichmentData = {
        insights: insights,
        recommendations: [
          'Focus on value proposition alignment with specific needs',
          'Engage decision makers with tailored materials',
          'Address competitive differentiation proactively'
        ],
        suggestedNextSteps: nextActions,
        probability: Math.max(dealData.probability || 0, 65), // Suggest increased probability
        confidence: 85,
        aiProvider: '🤖 GPT-4o / Gemini Hybrid'
      };
      
      const enriched = {
        ...dealData,
        ...result
      };
      this.setToCache(key, enriched);
      return enriched;
    } catch (error) {
      console.error('❌ Deal enrichment failed:', error);
      const fallback = {
        ...dealData,
        confidence: 0,
        aiProvider: '❌ Enrichment Failed',
        notes: 'Failed to enrich deal data. Please try again later.'
      };
      // Don't cache errors
      return fallback;
    }
  }

  async findContactImage(name: string, company?: string): Promise<string> {
    // For demonstration, generate an avatar URL
    // In a real implementation, this could use profile photo search APIs
    const seed = name.toLowerCase().replace(/\s+/g, '');
    const style = Math.random() > 0.5 ? 'avataaars' : 'micah';
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}${company ? '-' + company : ''}&backgroundColor=3b82f6,8b5cf6,f59e0b,10b981,ef4444`;
  }
}

// Singleton instance
let aiEnrichmentServiceInstance: AIEnrichmentService | null = null;

export const getAIEnrichmentService = (): AIEnrichmentService => {
  if (!aiEnrichmentServiceInstance) {
    aiEnrichmentServiceInstance = new AIEnrichmentService();
  }
  return aiEnrichmentServiceInstance;
};

// For direct importing
export const aiEnrichmentService = getAIEnrichmentService();