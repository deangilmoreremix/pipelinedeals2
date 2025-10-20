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

// Sanitization helpers
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeUrl(url: string): string {
  // Basic URL sanitization - remove potentially dangerous characters
  return url.trim().replace(/[<>'"]/g, '');
}