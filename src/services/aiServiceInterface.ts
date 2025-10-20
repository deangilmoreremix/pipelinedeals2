import { Contact } from '../types/contact';
import { Deal } from '../types';

// Base interface for AI analysis results
export interface AIAnalysisResult {
  score: number;
  insights: string[];
  recommendations: string[];
  riskFactors: string[];
  confidence: number;
  aiProvider: string;
  timestamp: Date;
}

// Interface for AI service implementations
export interface AIService {
  // Contact analysis
  analyzeContact(contact: Contact): Promise<AIAnalysisResult>;

  // Email generation
  generateEmail(contact: Contact, context?: string): Promise<string>;

  // Deal analysis
  generateDealSummary(dealData: Deal): Promise<string>;
  suggestNextActions(dealData: Deal): Promise<string[]>;

  // Company research
  researchCompany(companyName: string, domain?: string): Promise<any>;

  // Contact research
  researchContact(personName: string, companyName?: string): Promise<any>;

  // Get insights
  getInsights(data: Contact | Deal): Promise<string[]>;

  // Service metadata
  getProviderName(): string;
  getCapabilities(): string[];
  isAvailable(): boolean;
}

// Factory for creating AI services
export class AIServiceFactory {
  private static services: Map<string, AIService> = new Map();

  static register(provider: string, service: AIService) {
    this.services.set(provider, service);
  }

  static getService(provider: string): AIService | null {
    return this.services.get(provider) || null;
  }

  static getAvailableServices(): string[] {
    return Array.from(this.services.keys()).filter(provider =>
      this.services.get(provider)?.isAvailable()
    );
  }

  static getBestServiceForTask(taskType: string): AIService | null {
    // Simple routing logic - can be enhanced with more sophisticated selection
    const availableServices = this.getAvailableServices();

    if (availableServices.length === 0) return null;

    // For now, prefer Gemini for most tasks, OpenAI for creative tasks
    switch (taskType) {
      case 'email-generation':
      case 'creative-writing':
        return this.services.get('openai') || (availableServices[0] ? this.services.get(availableServices[0]) : null) || null;
      default:
        return this.services.get('gemini') || (availableServices[0] ? this.services.get(availableServices[0]) : null) || null;
    }
  }
}

// Intelligent AI router that selects the best service for each task
export class IntelligentAIRouter {
  private services: Map<string, AIService> = new Map();

  registerService(name: string, service: AIService) {
    this.services.set(name, service);
  }

  async executeTask<T>(
    taskType: string,
    data: any,
    options: { priority?: 'speed' | 'quality' | 'cost' } = {}
  ): Promise<T> {
    const service = this.selectBestService(taskType, options);

    if (!service) {
      throw new Error(`No suitable AI service available for task: ${taskType}`);
    }

    // Route to appropriate method based on task type
    switch (taskType) {
      case 'contact-analysis':
        return service.analyzeContact(data) as Promise<T>;
      case 'email-generation':
        return service.generateEmail(data.contact, data.context) as Promise<T>;
      case 'deal-summary':
        return service.generateDealSummary(data) as Promise<T>;
      case 'next-actions':
        return service.suggestNextActions(data) as Promise<T>;
      case 'company-research':
        return service.researchCompany(data.companyName, data.domain) as Promise<T>;
      case 'contact-research':
        return service.researchContact(data.personName, data.companyName) as Promise<T>;
      case 'insights':
        return service.getInsights(data) as Promise<T>;
      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }
  }

  private selectBestService(
    taskType: string,
    options: { priority?: 'speed' | 'quality' | 'cost' }
  ): AIService | null {
    const availableServices = Array.from(this.services.values()).filter(s => s.isAvailable());

    if (availableServices.length === 0) return null;

    // Task-specific routing logic
    const routingRules: Record<string, string[]> = {
      'contact-analysis': ['gemini', 'openai'],
      'email-generation': ['openai', 'gemini'],
      'company-research': ['gemini', 'openai'],
      'deal-summary': ['gemini', 'openai'],
      'next-actions': ['gemini', 'openai'],
      'contact-research': ['gemini', 'openai'],
      'insights': ['openai', 'gemini']
    };

    const preferredProviders = routingRules[taskType] || ['gemini', 'openai'];

    // Find first available preferred service
    for (const provider of preferredProviders) {
      const service = this.services.get(provider);
      if (service?.isAvailable()) {
        return service;
      }
    }

    // Fallback to any available service
    return availableServices[0] || null;
  }

  getAvailableServices(): string[] {
    return Array.from(this.services.keys()).filter(name =>
      this.services.get(name)?.isAvailable()
    );
  }
}

// Export singleton instance
export const aiRouter = new IntelligentAIRouter();