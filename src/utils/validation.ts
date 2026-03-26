import { z } from 'zod';

// Contact validation schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  firstName: z.string().max(50, 'First name too long').optional(),
  lastName: z.string().max(50, 'Last name too long').optional(),
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone format').optional().or(z.literal('')),
  title: z.string().max(100, 'Title too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  industry: z.string().max(50, 'Industry too long').optional(),
  status: z.enum(['lead', 'prospect', 'customer', 'churned']).optional(),
  interestLevel: z.enum(['hot', 'medium', 'low', 'cold']).optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

// Deal validation schema
export const dealSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  company: z.string().min(1, 'Company is required').max(100, 'Company name too long'),
  contact: z.string().min(1, 'Contact is required').max(100, 'Contact name too long'),
  value: z.number().min(0, 'Value must be positive').max(100000000, 'Value too high'),
  stage: z.enum(['qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost']),
  probability: z.number().min(0, 'Probability must be between 0-100').max(100, 'Probability must be between 0-100'),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
});

// AI service input validation
export const aiContactAnalysisSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  industry: z.string().max(50).optional(),
  status: z.enum(['lead', 'prospect', 'customer', 'churned']).optional(),
  interestLevel: z.enum(['hot', 'medium', 'low', 'cold']).optional(),
  sources: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  notes: z.string().max(1000).optional(),
});

export const aiEmailGenerationSchema = z.object({
  contact: z.object({
    name: z.string().min(1).max(100),
    firstName: z.string().max(50).optional(),
    title: z.string().max(100).optional(),
    company: z.string().min(1).max(100),
    email: z.string().email(),
  }),
  context: z.string().max(500).optional(),
});

export const aiCompanyResearchSchema = z.object({
  companyName: z.string().min(1).max(100),
  domain: z.string().url().optional(),
});

// Extended validation schemas for production
export const emailSchema = z.string()
  .email('Invalid email address')
  .min(5, 'Email too short')
  .max(254, 'Email too long')
  .transform(email => email.toLowerCase().trim());

export const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]{10,20}$/, 'Invalid phone number format')
  .transform(phone => phone.replace(/\s+/g, ''));

export const urlSchema = z.string()
  .url('Invalid URL')
  .max(2048, 'URL too long')
  .transform(url => {
    try {
      const parsed = new URL(url);
      return parsed.toString();
    } catch {
      return url;
    }
  });

export const dealTitleSchema = z.string()
  .min(1, 'Title is required')
  .max(200, 'Title too long (max 200 characters)')
  .transform(title => title.trim())
  .refine(title => !/<script/i.test(title), 'Invalid characters in title');

export const companyNameSchema = z.string()
  .min(1, 'Company name is required')
  .max(100, 'Company name too long')
  .transform(name => name.trim())
  .refine(name => !/[<>]/g.test(name), 'Invalid characters in company name');

export const currencySchema = z.number()
  .min(0, 'Value must be positive')
  .max(999999999999, 'Value exceeds maximum')
  .transform(val => Math.round(val * 100) / 100);

export const tagSchema = z.string()
  .min(1, 'Tag cannot be empty')
  .max(30, 'Tag too long (max 30 characters)')
  .regex(/^[a-zA-Z0-9\-_]+$/, 'Tags can only contain letters, numbers, hyphens, and underscores')
  .transform(tag => tag.toLowerCase().trim());

export const idSchema = z.string()
  .uuid('Invalid ID format')
  .or(z.string().regex(/^[a-zA-Z0-9_-]{10,50}$/, 'Invalid ID format'));

export const searchQuerySchema = z.string()
  .min(1, 'Search query required')
  .max(200, 'Search query too long')
  .transform(query => query.trim())
  .refine(query => {
    const dangerousPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i,
      /(--|#|\/\*|\*\/)/,
      /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i
    ];
    return !dangerousPatterns.some(pattern => pattern.test(query));
  }, 'Invalid search query');

// Validation helper functions
export function validateContact(data: unknown) {
  return contactSchema.safeParse(data);
}

export function validateDeal(data: unknown) {
  return dealSchema.safeParse(data);
}

export function validateAIContactAnalysis(data: unknown) {
  return aiContactAnalysisSchema.safeParse(data);
}

export function validateAIEmailGeneration(data: unknown) {
  return aiEmailGenerationSchema.safeParse(data);
}

export function validateAICompanyResearch(data: unknown) {
  return aiCompanyResearchSchema.safeParse(data);
}

// Enhanced sanitization helpers
export function sanitizeString(input: string): string {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeEmail(email: string): string {
  if (!email) return '';
  return email.toLowerCase().trim();
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

export function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

export function sanitizeFileName(fileName: string): string {
  if (!fileName) return '';
  return fileName
    .replace(/[\\/]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255);
}

// Validate and sanitize deal data
export function validateDealData(data: Record<string, any>): {
  valid: boolean;
  errors: string[];
  sanitized: Record<string, any>;
} {
  const errors: string[] = [];
  const sanitized: Record<string, any> = {};

  if (data.title !== undefined) {
    const result = dealTitleSchema.safeParse(data.title);
    if (!result.success) {
      errors.push(`Title: ${result.error.errors[0].message}`);
    } else {
      sanitized.title = result.data;
    }
  }

  if (data.company !== undefined) {
    const result = companyNameSchema.safeParse(data.company);
    if (!result.success) {
      errors.push(`Company: ${result.error.errors[0].message}`);
    } else {
      sanitized.company = result.data;
    }
  }

  if (data.value !== undefined) {
    const result = currencySchema.safeParse(data.value);
    if (!result.success) {
      errors.push(`Value: ${result.error.errors[0].message}`);
    } else {
      sanitized.value = result.data;
    }
  }

  if (data.tags !== undefined && Array.isArray(data.tags)) {
    const validTags: string[] = [];
    data.tags.forEach((tag, index) => {
      const result = tagSchema.safeParse(tag);
      if (result.success) {
        validTags.push(result.data);
      } else {
        errors.push(`Tag ${index + 1}: ${result.error.errors[0].message}`);
      }
    });
    sanitized.tags = validTags;
  }

  if (data.notes !== undefined) {
    sanitized.notes = sanitizeText(data.notes);
  }

  if (data.description !== undefined) {
    sanitized.description = sanitizeText(data.description);
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized
  };
}

// Validate automation configuration
export function validateAutomationConfig(config: Record<string, any>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.name || typeof config.name !== 'string' || config.name.length < 1 || config.name.length > 100) {
    errors.push('Automation name must be between 1 and 100 characters');
  }

  if (!Array.isArray(config.steps) || config.steps.length === 0) {
    errors.push('Automation must have at least one step');
  } else if (config.steps.length > 50) {
    errors.push('Automation cannot have more than 50 steps');
  }

  const validStepTypes = ['email', 'call', 'task', 'ai', 'delay', 'communication', 'attachment'];
  config.steps?.forEach((step: any, index: number) => {
    if (!step.type || !validStepTypes.includes(step.type)) {
      errors.push(`Step ${index + 1}: Invalid step type`);
    }
    if (!step.name || typeof step.name !== 'string' || step.name.length < 1) {
      errors.push(`Step ${index + 1}: Step name is required`);
    }
  });

  config.steps?.forEach((step: any, index: number) => {
    if (step.type === 'delay') {
      const delayDays = parseInt(step.delayDays);
      if (isNaN(delayDays) || delayDays < 0 || delayDays > 365) {
        errors.push(`Step ${index + 1}: Delay must be between 0 and 365 days`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// Rate limit key generator
export function generateRateLimitKey(userId: string, action: string): string {
  return `${userId}:${action}`;
}

export default {
  contactSchema,
  dealSchema,
  aiContactAnalysisSchema,
  aiEmailGenerationSchema,
  aiCompanyResearchSchema,
  emailSchema,
  phoneSchema,
  urlSchema,
  dealTitleSchema,
  companyNameSchema,
  currencySchema,
  tagSchema,
  idSchema,
  searchQuerySchema,
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeFileName,
  validateDealData,
  validateAutomationConfig,
  generateRateLimitKey
};
