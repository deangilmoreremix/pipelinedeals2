import React, { useState, useEffect } from 'react';
import { Deal } from '../../types';
import { getSupabaseService } from '../../services/supabaseService';
import { logError, handleAPIError } from '../../utils/errorHandling';
import { 
  Zap, 
  Mail, 
  Plus, 
  Settings, 
  Clock, 
  Calendar, 
  Play,
  Pause,
  Check,
  Edit,
  Trash2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Info,
  PlusCircle,
  Copy,
  Eye,
  ArrowRight,
  SlidersHorizontal,
  Brain,
  Target,
  DollarSign,
  Building2,
  FileText,
  User,
  X,
  RefreshCw,
  Sparkles,
  Phone,
  Briefcase
} from 'lucide-react';

interface DealAutomationPanelProps {
  deal: Deal;
}

interface Automation {
  id: string;
  name: string;
  description: string;
  type: 'drip' | 'event' | 'date' | 'ai';
  status: 'active' | 'paused' | 'completed' | 'draft';
  progress?: number;
  condition?: {
    field: string;
    operator: string;
    value?: any;
  };
  trigger?: string;
  steps: {
    id: string;
    type: 'email' | 'call' | 'task' | 'ai' | 'delay' | 'communication' | 'attachment';
    name: string;
    details: string;
    status: 'pending' | 'active' | 'completed' | 'failed';
    scheduledAt?: Date;
    completedAt?: Date;
    // Email specific
    emailSubject?: string;
    emailBody?: string;
    // Task specific
    taskTitle?: string;
    taskPriority?: 'low' | 'medium' | 'high';
    // Communication specific
    communicationType?: 'email' | 'call' | 'meeting' | 'note';
    communicationContent?: string;
    // Attachment specific
    attachmentName?: string;
    attachmentType?: string;
    // Delay specific
    delayDays?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  nextRun?: Date;
}

export const DealAutomationPanel: React.FC<DealAutomationPanelProps> = ({ deal }) => {
  const [activeAutomations, setActiveAutomations] = useState<Automation[]>([]);
  const [availableAutomations, setAvailableAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [realTimeSubscription, setRealTimeSubscription] = useState<any>(null);

  // Load automations on component mount
  useEffect(() => {
    loadAutomations();
    setupRealTimeUpdates();

    return () => {
      if (realTimeSubscription) {
        realTimeSubscription.unsubscribe();
      }
    };
  }, [deal.id]);

  const loadAutomations = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = getSupabaseService();
      const automations = await supabase.getAutomations(deal.id);

      // Separate active and available automations
      const active = automations.filter(a => a.status === 'active' || a.status === 'paused');
      const available = automations.filter(a => a.status === 'draft' || a.status === 'completed');

      setActiveAutomations(active);
      setAvailableAutomations(available);
    } catch (err) {
      const appError = handleAPIError(err, 'load-automations');
      logError(appError, 'DealAutomationPanel load');
      setError('Failed to load automations');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    try {
      const supabase = getSupabaseService();
      const subscription = supabase.subscribeToAutomations(deal.id, (payload) => {
        console.log('Real-time automation update:', payload);
        // Reload automations when changes occur
        loadAutomations();
      });

      setRealTimeSubscription(subscription);
    } catch (err) {
      console.error('Failed to setup real-time updates:', err);
    }
  };
  
  const [expandedAutomations, setExpandedAutomations] = useState<string[]>(['1']);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showAIBuilder, setShowAIBuilder] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'valid' | 'invalid'>('all');

  const toggleExpand = (id: string) => {
    setExpandedAutomations(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };
  
  const activateAutomation = async (id: string) => {
    try {
      setSaving(true);
      const supabase = getSupabaseService();

      // Update automation status in database
      await supabase.updateAutomation(id, { status: 'active' });

      // Trigger workflow execution (simulate Netlify function call)
      await triggerWorkflowExecution(id, 'activate');

      // Update local state
      const automation = availableAutomations.find(a => a.id === id);
      if (automation) {
        const updated = { ...automation, status: 'active' as const, lastRun: new Date() };
        setAvailableAutomations(prev => prev.filter(a => a.id !== id));
        setActiveAutomations(prev => [...prev, updated]);
      }
    } catch (err) {
      const appError = handleAPIError(err, 'activate-automation');
      logError(appError, 'DealAutomationPanel activate');
      setError('Failed to activate automation');
    } finally {
      setSaving(false);
    }
  };

  const triggerWorkflowExecution = async (automationId: string, action: string) => {
    // Simulate calling a Netlify function for workflow execution
    // In production, this would call: /netlify/functions/execute-automation
    try {
      const response = await fetch('/.netlify/functions/execute-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          automationId,
          action,
          dealId: deal.id,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Workflow execution failed');
      }

      const result = await response.json();
      console.log('Workflow execution result:', result);
    } catch (err) {
      // For now, just log the error - in production this would be handled
      console.warn('Workflow execution not available (Netlify function not deployed):', err);
    }
  };
  
  const pauseAutomation = async (id: string) => {
    try {
      setSaving(true);
      const supabase = getSupabaseService();
      await supabase.updateAutomation(id, { status: 'paused' });

      setActiveAutomations(prev =>
        prev.map(a => a.id === id ? { ...a, status: 'paused' as const } : a)
      );
    } catch (err) {
      const appError = handleAPIError(err, 'pause-automation');
      logError(appError, 'DealAutomationPanel pause');
      setError('Failed to pause automation');
    } finally {
      setSaving(false);
    }
  };

  const resumeAutomation = async (id: string) => {
    try {
      setSaving(true);
      const supabase = getSupabaseService();
      await supabase.updateAutomation(id, { status: 'active' });

      setActiveAutomations(prev =>
        prev.map(a => a.id === id ? { ...a, status: 'active' as const } : a)
      );
    } catch (err) {
      const appError = handleAPIError(err, 'resume-automation');
      logError(appError, 'DealAutomationPanel resume');
      setError('Failed to resume automation');
    } finally {
      setSaving(false);
    }
  };

  const deleteAutomation = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this automation? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const supabase = getSupabaseService();
      await supabase.deleteAutomation(id);

      setActiveAutomations(prev => prev.filter(a => a.id !== id));
      setAvailableAutomations(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      const appError = handleAPIError(err, 'delete-automation');
      logError(appError, 'DealAutomationPanel delete');
      setError('Failed to delete automation');
    } finally {
      setSaving(false);
    }
  };
  
  const getStepIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'call': return Phone;
      case 'task': return Check;
      case 'delay': return Clock;
      case 'ai': return Brain;
      default: return Mail;
    }
  };
  
  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'active': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };
  
  const getAutomationTypeIcon = (type: string) => {
    switch (type) {
      case 'drip': return Mail;
      case 'event': return Zap;
      case 'date': return Calendar;
      case 'ai': return Brain;
      default: return Mail;
    }
  };
  
  const getAutomationStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Play;
      case 'paused': return Pause;
      case 'completed': return Check;
      case 'draft': return Edit;
      default: return Play;
    }
  };
  
  const getAutomationTypeColor = (type: string) => {
    switch (type) {
      case 'drip': return 'text-blue-600';
      case 'event': return 'text-purple-600';
      case 'date': return 'text-yellow-600';
      case 'ai': return 'text-indigo-600';
      default: return 'text-blue-600';
    }
  };
  
  const getAutomationStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'completed': return 'text-blue-600';
      case 'draft': return 'text-gray-600';
      default: return 'text-green-600';
    }
  };
  
  const getAutomationTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'drip': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'date': return 'bg-yellow-100 text-yellow-800';
      case 'ai': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getAutomationStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Template validation functions
  const validateTemplateConditions = (template: any, deal: Deal) => {
    // Check conditional logic
    if (template.condition) {
      const { field, operator, value } = template.condition;
      const dealValue = deal[field as keyof Deal];

      switch (operator) {
        case '>':
          return typeof dealValue === 'number' && dealValue > value;
        case '<':
          return typeof dealValue === 'number' && dealValue < value;
        case 'equals':
          return dealValue === value;
        case 'contains':
          return String(dealValue).toLowerCase().includes(String(value).toLowerCase());
        case 'empty':
          return !dealValue || dealValue === '';
        default:
          return false;
      }
    }
    return true; // No conditions means always valid
  };

  const validateTemplateTriggers = (template: any) => {
    // Check stage triggers
    if (template.trigger?.startsWith('stage-')) {
      return true; // Stage triggers are valid
    }

    // Check date triggers
    if (template.trigger?.includes('days') || template.trigger?.includes('weekly') || template.trigger?.includes('milestone')) {
      return true; // Date triggers are valid
    }

    // Check event triggers
    if (template.trigger?.includes('changed') || template.trigger?.includes('uploaded') || template.trigger?.includes('overdue')) {
      return true; // Event triggers are valid
    }

    return !template.trigger; // No trigger means valid (manual activation)
  };

  const getTemplateCapabilities = (template: any, deal: Deal) => {
    return {
      hasEmailSteps: template.steps.some((step: any) => step.type === 'email'),
      hasTaskSteps: template.steps.some((step: any) => step.type === 'task'),
      hasCommunicationSteps: template.steps.some((step: any) => step.type === 'communication'),
      hasConditionalLogic: !!template.condition,
      hasStageTriggers: !!template.trigger?.startsWith('stage-'),
      hasDateTriggers: !!(template.trigger?.includes('days') || template.trigger?.includes('weekly') || template.trigger?.includes('milestone')),
      isConditionValid: validateTemplateConditions(template, deal),
      isTriggerValid: validateTemplateTriggers(template)
    };
  };

  // Pre-defined automation templates
  const automationTemplates = [
    {
      id: 'follow-up-basic',
      name: 'Basic Follow-up Sequence',
      description: 'Simple 3-step follow-up for new deals',
      type: 'drip' as const,
      steps: [
        {
          id: 'email-intro',
          type: 'email' as const,
          name: 'Initial Introduction',
          details: 'Send introduction email with value proposition',
          status: 'pending' as const,
          emailSubject: 'Introduction and Value Proposition for {deal}',
          emailBody: 'Hi {contact},\n\nI\'d like to discuss how we can help {company} achieve their goals...'
        },
        {
          id: 'delay-3days',
          type: 'delay' as const,
          name: 'Wait 3 Days',
          details: 'Allow time for initial response',
          status: 'pending' as const,
          delayDays: 3
        },
        {
          id: 'task-followup',
          type: 'task' as const,
          name: 'Follow-up Call',
          details: 'Schedule follow-up call to discuss proposal',
          status: 'pending' as const,
          taskTitle: 'Call {contact} to discuss {deal}',
          taskPriority: 'medium' as const
        }
      ]
    },
    {
      id: 'high-value-acceleration',
      name: 'High-Value Deal Acceleration',
      description: 'Accelerated sequence for deals over $50K',
      type: 'event' as const,
      condition: { field: 'value', operator: '>', value: 50000 },
      steps: [
        {
          id: 'task-executive-meeting',
          type: 'task' as const,
          name: 'Schedule Executive Meeting',
          details: 'Arrange meeting with key decision makers',
          status: 'pending' as const,
          taskTitle: 'URGENT: Schedule executive meeting for {deal}',
          taskPriority: 'high' as const
        },
        {
          id: 'email-executive-intro',
          type: 'email' as const,
          name: 'Executive Introduction',
          details: 'Send personalized introduction to executives',
          status: 'pending' as const,
          emailSubject: 'Executive Introduction - {deal}',
          emailBody: 'Dear Executive Team,\n\nI\'m reaching out regarding our proposal for {company}...'
        },
        {
          id: 'delay-1day',
          type: 'delay' as const,
          name: 'Quick Follow-up',
          details: 'Follow up within 24 hours',
          status: 'pending' as const,
          delayDays: 1
        },
        {
          id: 'task-custom-proposal',
          type: 'task' as const,
          name: 'Prepare Custom Proposal',
          details: 'Create tailored proposal for high-value deal',
          status: 'pending' as const,
          taskTitle: 'Prepare custom proposal for {deal} - {company}',
          taskPriority: 'high' as const
        }
      ]
    },
    {
      id: 'stagnation-alert',
      name: 'Stagnation Alert',
      description: 'Alert when deals become inactive',
      type: 'date' as const,
      trigger: 'no-activity-7days',
      steps: [
        {
          id: 'task-stagnation-check',
          type: 'task' as const,
          name: 'Check Deal Status',
          details: 'URGENT: Review stagnant deal',
          status: 'pending' as const,
          taskTitle: 'URGENT: Check status of stagnant deal - {deal}',
          taskPriority: 'high' as const
        },
        {
          id: 'email-stagnation-followup',
          type: 'email' as const,
          name: 'Stagnation Follow-up',
          details: 'Re-engage with inactive prospect',
          status: 'pending' as const,
          emailSubject: 'Following up on our {deal} discussion',
          emailBody: 'Hi {contact},\n\nI wanted to follow up on our previous conversation about {deal}...'
        },
        {
          id: 'communication-stagnation-log',
          type: 'communication' as const,
          name: 'Log Stagnation Alert',
          details: 'Stagnation alert sent to prospect',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Stagnation alert sent - no activity for 7+ days'
        }
      ]
    },
    {
      id: 'deadline-approaching',
      name: 'Deadline Approaching',
      description: 'Reminders before deal deadlines',
      type: 'date' as const,
      trigger: 'deadline-3days',
      steps: [
        {
          id: 'task-deadline-push',
          type: 'task' as const,
          name: 'Final Push',
          details: 'Make final push before deadline',
          status: 'pending' as const,
          taskTitle: 'FINAL PUSH: {deal} due in 3 days',
          taskPriority: 'high' as const
        },
        {
          id: 'email-deadline-reminder',
          type: 'email' as const,
          name: 'Deadline Reminder',
          details: 'Final reminder before deadline',
          status: 'pending' as const,
          emailSubject: 'Final reminder: {deal} deadline approaching',
          emailBody: 'Hi {contact},\n\nThis is a final reminder that our {deal} proposal is due soon...'
        }
      ]
    },
    {
      id: 'stage-change-notification',
      name: 'Stage Change Notification',
      description: 'Notify when deal stages change',
      type: 'event' as const,
      trigger: 'stage-changed',
      steps: [
        {
          id: 'communication-stage-log',
          type: 'communication' as const,
          name: 'Stage Change Log',
          details: 'Deal stage changed to {newStage}',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Deal stage changed from {oldStage} to {newStage}'
        },
        {
          id: 'task-crm-update',
          type: 'task' as const,
          name: 'Update CRM',
          details: 'Update CRM with new stage information',
          status: 'pending' as const,
          taskTitle: 'Update CRM: {deal} moved to {newStage}',
          taskPriority: 'medium' as const
        }
      ]
    },
    {
      id: 'contact-update-required',
      name: 'Contact Update Required',
      description: 'Alert when contact info is missing',
      type: 'event' as const,
      condition: { field: 'contact', operator: 'empty' },
      steps: [
        {
          id: 'task-research-contact',
          type: 'task' as const,
          name: 'Research Contact',
          details: 'Find and update missing contact information',
          status: 'pending' as const,
          taskTitle: 'Research contact info for {deal} - {company}',
          taskPriority: 'medium' as const
        },
        {
          id: 'email-contact-request',
          type: 'email' as const,
          name: 'Contact Info Request',
          details: 'Request updated contact details',
          status: 'pending' as const,
          emailSubject: 'Updated contact information needed',
          emailBody: 'Hi there,\n\nWe need updated contact information to proceed with {deal}...'
        },
        {
          id: 'communication-contact-log',
          type: 'communication' as const,
          name: 'Contact Update Requested',
          details: 'Contact update request sent',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Contact update requested - missing information'
        }
      ]
    },
    {
      id: 'deal-value-increase',
      name: 'Value Increase Opportunity',
      description: 'Explore upsell opportunities',
      type: 'date' as const,
      trigger: 'value-unchanged-14days',
      steps: [
        {
          id: 'task-upsell-exploration',
          type: 'task' as const,
          name: 'Explore Upsell',
          details: 'Look for additional services or products',
          status: 'pending' as const,
          taskTitle: 'Explore upsell opportunities for {deal}',
          taskPriority: 'medium' as const
        },
        {
          id: 'email-upsell-discussion',
          type: 'email' as const,
          name: 'Additional Services',
          details: 'Discuss additional services that might interest them',
          status: 'pending' as const,
          emailSubject: 'Additional services for {company}',
          emailBody: 'Hi {contact},\n\nIn addition to our {deal} proposal, we also offer...'
        },
        {
          id: 'communication-upsell-log',
          type: 'communication' as const,
          name: 'Upsell Discussion',
          details: 'Upsell opportunities discussed',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Upsell discussion initiated - exploring additional services'
        }
      ]
    },
    {
      id: 'priority-escalation',
      name: 'Priority Deal Escalation',
      description: 'Escalate high-priority inactive deals',
      type: 'event' as const,
      condition: { field: 'priority', operator: 'equals', value: 'high' },
      trigger: 'inactive-5days',
      steps: [
        {
          id: 'task-priority-attention',
          type: 'task' as const,
          name: 'Priority Attention Required',
          details: 'URGENT: High priority deal needs immediate attention',
          status: 'pending' as const,
          taskTitle: 'URGENT: High priority deal {deal} needs attention',
          taskPriority: 'high' as const
        },
        {
          id: 'email-priority-followup',
          type: 'email' as const,
          name: 'Priority Follow-up',
          details: 'Follow up on high-priority deal',
          status: 'pending' as const,
          emailSubject: 'Priority follow-up on {deal}',
          emailBody: 'Hi {contact},\n\nI\'m following up on our high-priority {deal} discussion...'
        },
        {
          id: 'communication-priority-log',
          type: 'communication' as const,
          name: 'Priority Escalation',
          details: 'Priority escalation initiated',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Priority escalation - high priority deal inactive for 5+ days'
        }
      ]
    },
    {
      id: 'contract-preparation',
      name: 'Contract Preparation',
      description: 'Prepare contracts when deals move to negotiation',
      type: 'event' as const,
      trigger: 'stage-negotiation',
      steps: [
        {
          id: 'task-contract-draft',
          type: 'task' as const,
          name: 'Prepare Contract Draft',
          details: 'Create initial contract draft',
          status: 'pending' as const,
          taskTitle: 'Prepare contract draft for {deal}',
          taskPriority: 'high' as const
        },
        {
          id: 'attachment-contract-template',
          type: 'attachment' as const,
          name: 'Upload Contract Template',
          details: 'Upload contract template for review',
          status: 'pending' as const,
          attachmentName: 'Contract_Template_{deal}.pdf',
          attachmentType: 'contract'
        },
        {
          id: 'email-contract-ready',
          type: 'email' as const,
          name: 'Contract Ready',
          details: 'Notify that contract is ready for review',
          status: 'pending' as const,
          emailSubject: 'Contract draft ready for {deal}',
          emailBody: 'Hi {contact},\n\nThe contract draft for {deal} is ready for your review...'
        }
      ]
    },
    {
      id: 'win-celebration',
      name: 'Win Celebration',
      description: 'Celebrate when deals are won',
      type: 'event' as const,
      trigger: 'stage-closed-won',
      steps: [
        {
          id: 'communication-win-log',
          type: 'communication' as const,
          name: 'Deal Won!',
          details: '🎉 Deal successfully closed!',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: '🎉 DEAL WON! - {deal} closed successfully'
        },
        {
          id: 'task-thank-you',
          type: 'task' as const,
          name: 'Send Thank You',
          details: 'Send thank you note to champion',
          status: 'pending' as const,
          taskTitle: 'Send thank you note for {deal} win',
          taskPriority: 'medium' as const
        },
        {
          id: 'email-welcome-aboard',
          type: 'email' as const,
          name: 'Welcome Aboard',
          details: 'Welcome new client onboard',
          status: 'pending' as const,
          emailSubject: 'Welcome to our team!',
          emailBody: 'Congratulations! We\'re excited to have {company} as a client...'
        }
      ]
    },
    {
      id: 'loss-analysis',
      name: 'Loss Analysis',
      description: 'Analyze why deals were lost',
      type: 'event' as const,
      trigger: 'stage-closed-lost',
      steps: [
        {
          id: 'task-loss-analysis',
          type: 'task' as const,
          name: 'Document Loss Reason',
          details: 'Document why the deal was lost',
          status: 'pending' as const,
          taskTitle: 'Analyze loss: {deal} - document reasons',
          taskPriority: 'medium' as const
        },
        {
          id: 'communication-loss-log',
          type: 'communication' as const,
          name: 'Loss Recorded',
          details: 'Deal loss documented and analyzed',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Deal lost - analysis needed to improve future proposals'
        },
        {
          id: 'email-thank-you-loss',
          type: 'email' as const,
          name: 'Thank You for Consideration',
          details: 'Thank them for considering us',
          status: 'pending' as const,
          emailSubject: 'Thank you for considering us',
          emailBody: 'Hi {contact},\n\nThank you for considering {company} for {deal}...'
        }
      ]
    },
    {
      id: 'weekly-review',
      name: 'Weekly Deal Review',
      description: 'Weekly review of all open deals',
      type: 'date' as const,
      trigger: 'weekly-monday',
      steps: [
        {
          id: 'task-weekly-review',
          type: 'task' as const,
          name: 'Weekly Deal Review',
          details: 'Review all open deals and progress',
          status: 'pending' as const,
          taskTitle: 'Weekly deal review - check all open deals',
          taskPriority: 'medium' as const
        },
        {
          id: 'communication-weekly-log',
          type: 'communication' as const,
          name: 'Weekly Review Completed',
          details: 'Weekly deal review completed',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Weekly deal review completed - all deals assessed'
        },
        {
          id: 'task-overdue-followup',
          type: 'task' as const,
          name: 'Follow Up Overdue',
          details: 'Follow up on overdue items from review',
          status: 'pending' as const,
          taskTitle: 'Follow up on overdue items from weekly review',
          taskPriority: 'high' as const
        }
      ]
    },
    {
      id: 'attachment-alert',
      name: 'New Attachment Alert',
      description: 'Alert when new files are uploaded',
      type: 'event' as const,
      trigger: 'attachment-uploaded',
      steps: [
        {
          id: 'communication-attachment-log',
          type: 'communication' as const,
          name: 'New Attachment',
          details: 'New file uploaded: {filename}',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'New attachment uploaded: {filename} ({filesize})'
        },
        {
          id: 'task-review-document',
          type: 'task' as const,
          name: 'Review Document',
          details: 'Review newly uploaded document',
          status: 'pending' as const,
          taskTitle: 'Review uploaded document: {filename}',
          taskPriority: 'medium' as const
        },
        {
          id: 'email-document-uploaded',
          type: 'email' as const,
          name: 'Document Uploaded',
          details: 'Notify that document has been uploaded',
          status: 'pending' as const,
          emailSubject: 'Document uploaded for {deal}',
          emailBody: 'Hi {contact},\n\nA new document has been uploaded for your review...'
        }
      ]
    },
    {
      id: 'task-overdue-alert',
      name: 'Task Overdue Alert',
      description: 'Alert when deal tasks become overdue',
      type: 'event' as const,
      trigger: 'task-overdue',
      steps: [
        {
          id: 'task-overdue-attention',
          type: 'task' as const,
          name: 'Overdue Task Attention',
          details: 'URGENT: Overdue task requires immediate attention',
          status: 'pending' as const,
          taskTitle: 'URGENT: Overdue task - {taskTitle}',
          taskPriority: 'high' as const
        },
        {
          id: 'email-overdue-reminder',
          type: 'email' as const,
          name: 'Overdue Task Reminder',
          details: 'Remind about overdue task',
          status: 'pending' as const,
          emailSubject: 'Overdue task reminder: {deal}',
          emailBody: 'Hi {contact},\n\nThis is a reminder about an overdue task related to {deal}...'
        },
        {
          id: 'communication-overdue-log',
          type: 'communication' as const,
          name: 'Overdue Alert Sent',
          details: 'Overdue task alert sent',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Overdue task alert sent - requires immediate attention'
        }
      ]
    },
    {
      id: 'deal-milestone',
      name: 'Deal Age Milestone',
      description: 'Celebrate deal age milestones',
      type: 'date' as const,
      trigger: 'age-milestone',
      steps: [
        {
          id: 'communication-milestone-log',
          type: 'communication' as const,
          name: 'Deal Milestone',
          details: 'Deal milestone reached: {age} days',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Deal milestone: {deal} has been active for {age} days'
        },
        {
          id: 'task-progress-review',
          type: 'task' as const,
          name: 'Progress Review',
          details: 'Review deal progress at milestone',
          status: 'pending' as const,
          taskTitle: 'Review progress: {deal} at {age} days',
          taskPriority: 'medium' as const
        },
        {
          id: 'email-progress-checkin',
          type: 'email' as const,
          name: 'Progress Check-in',
          details: 'Check in on deal progress',
          status: 'pending' as const,
          emailSubject: 'Deal progress check-in - {deal}',
          emailBody: 'Hi {contact},\n\nIt\'s been {age} days since we started discussing {deal}...'
        }
      ]
    },
    {
      id: 'communication-gap',
      name: 'Communication Gap Alert',
      description: 'Alert when communication gaps occur',
      type: 'date' as const,
      trigger: 'no-communication-10days',
      steps: [
        {
          id: 'task-reengage-prospect',
          type: 'task' as const,
          name: 'Re-engage Prospect',
          details: 'Re-engage with prospect after communication gap',
          status: 'pending' as const,
          taskTitle: 'Re-engage prospect: {deal} - no communication for 10+ days',
          taskPriority: 'medium' as const
        },
        {
          id: 'email-reengagement',
          type: 'email' as const,
          name: 'Re-engagement Email',
          details: 'Re-engage after period of no communication',
          status: 'pending' as const,
          emailSubject: 'Following up on our {deal} conversation',
          emailBody: 'Hi {contact},\n\nI wanted to follow up on our previous conversation about {deal}...'
        },
        {
          id: 'communication-reengagement-log',
          type: 'communication' as const,
          name: 'Re-engagement Initiated',
          details: 'Re-engagement attempt after communication gap',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Re-engagement initiated after 10+ day communication gap'
        }
      ]
    },
    {
      id: 'expansion-opportunity',
      name: 'Deal Expansion Opportunity',
      description: 'Explore expansion in negotiation stage',
      type: 'event' as const,
      trigger: 'stage-negotiation-7days',
      steps: [
        {
          id: 'task-expansion-exploration',
          type: 'task' as const,
          name: 'Explore Expansion',
          details: 'Look for opportunities to expand the deal',
          status: 'pending' as const,
          taskTitle: 'Explore expansion opportunities for {deal}',
          taskPriority: 'medium' as const
        },
        {
          id: 'email-expansion-discussion',
          type: 'email' as const,
          name: 'Additional Services',
          details: 'Discuss additional services during negotiation',
          status: 'pending' as const,
          emailSubject: 'Additional services for {company}',
          emailBody: 'Hi {contact},\n\nAs we finalize {deal}, you might also be interested in...'
        },
        {
          id: 'communication-expansion-log',
          type: 'communication' as const,
          name: 'Expansion Discussed',
          details: 'Expansion opportunities discussed',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Expansion opportunities discussed during negotiation phase'
        }
      ]
    },
    {
      id: 'competitor-alert',
      name: 'Competitor Mention Alert',
      description: 'Alert when competitors are mentioned',
      type: 'event' as const,
      trigger: 'competitor-mentioned',
      steps: [
        {
          id: 'task-competitor-response',
          type: 'task' as const,
          name: 'Address Competitor Concerns',
          details: 'URGENT: Address competitor concerns immediately',
          status: 'pending' as const,
          taskTitle: 'URGENT: Address competitor concerns for {deal}',
          taskPriority: 'high' as const
        },
        {
          id: 'email-competitive-advantages',
          type: 'email' as const,
          name: 'Our Competitive Advantages',
          details: 'Highlight competitive advantages',
          status: 'pending' as const,
          emailSubject: 'Our competitive advantages for {deal}',
          emailBody: 'Hi {contact},\n\nI understand you\'re also considering other options...'
        },
        {
          id: 'communication-competitor-log',
          type: 'communication' as const,
          name: 'Competitor Concern Addressed',
          details: 'Competitor concerns addressed',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Competitor concerns addressed - competitive advantages highlighted'
        }
      ]
    },
    {
      id: 'budget-discussion',
      name: 'Budget Discussion Trigger',
      description: 'Trigger when deal value changes significantly',
      type: 'event' as const,
      trigger: 'value-changed-20percent',
      steps: [
        {
          id: 'task-budget-discussion',
          type: 'task' as const,
          name: 'Discuss Budget Implications',
          details: 'Discuss budget implications of value change',
          status: 'pending' as const,
          taskTitle: 'Discuss budget implications for {deal} value change',
          taskPriority: 'high' as const
        },
        {
          id: 'email-updated-proposal',
          type: 'email' as const,
          name: 'Updated Proposal',
          details: 'Send updated proposal based on budget discussion',
          status: 'pending' as const,
          emailSubject: 'Updated proposal for {deal}',
          emailBody: 'Hi {contact},\n\nBased on our budget discussion, here\'s an updated proposal...'
        },
        {
          id: 'communication-budget-log',
          type: 'communication' as const,
          name: 'Budget Discussion',
          details: 'Budget discussion initiated due to value change',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Budget discussion initiated - deal value changed significantly'
        }
      ]
    },
    {
      id: 'deal-handover',
      name: 'Deal Handover Preparation',
      description: 'Prepare when deals are transferred',
      type: 'event' as const,
      trigger: 'owner-changed',
      steps: [
        {
          id: 'task-handover-notes',
          type: 'task' as const,
          name: 'Prepare Handover Notes',
          details: 'Create comprehensive handover notes',
          status: 'pending' as const,
          taskTitle: 'Prepare handover notes for {deal}',
          taskPriority: 'high' as const
        },
        {
          id: 'attachment-handover-summary',
          type: 'attachment' as const,
          name: 'Upload Handover Summary',
          details: 'Upload deal summary document',
          status: 'pending' as const,
          attachmentName: 'Deal_Handover_{deal}.pdf',
          attachmentType: 'summary'
        },
        {
          id: 'email-handover-notification',
          type: 'email' as const,
          name: 'Handover Notification',
          details: 'Notify of deal ownership transfer',
          status: 'pending' as const,
          emailSubject: 'Deal handover: {deal}',
          emailBody: 'Hi {contact},\n\n{deal} has been transferred to a new representative...'
        },
        {
          id: 'communication-handover-log',
          type: 'communication' as const,
          name: 'Ownership Transferred',
          details: 'Deal ownership transferred to new owner',
          status: 'pending' as const,
          communicationType: 'note' as const,
          communicationContent: 'Deal ownership transferred from {oldOwner} to {newOwner}'
        }
      ]
    }
  ];

  const handleGenerateAutomation = async () => {
    try {
      setAiGenerating(true);

      // Call AI service to generate automation (simulate Netlify function)
      const aiResponse = await fetch('/.netlify/functions/generate-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal.id,
          dealData: {
            title: deal.title,
            company: deal.company,
            value: deal.value,
            stage: deal.stage,
            priority: deal.priority
          },
          context: 'closing-sequence'
        })
      });

      let automationData;
      if (aiResponse.ok) {
        const responseText = await aiResponse.text();
        try {
          automationData = JSON.parse(responseText);
        } catch (parseError) {
          console.warn('Failed to parse AI response as JSON, using fallback:', parseError);
          automationData = null;
        }
      }

      // Fallback to client-side generation if Netlify function not available or JSON parsing failed
      if (!automationData) {
        console.warn('AI service not available or returned invalid JSON, using fallback generation');
        automationData = {
          name: `${deal.title} Closing Sequence`,
          description: 'AI-generated sequence to move this deal to closed-won stage',
          type: 'ai',
          steps: [
            {
              id: `s${Date.now()}-1`,
              type: 'email',
              name: 'Value Proposition Reinforcement',
              details: `Email highlighting key value propositions specific to ${deal.company}`,
              status: 'pending',
              emailSubject: `Enhanced Value Proposition for ${deal.title}`,
              emailBody: `Hi {contact},\n\nI wanted to follow up on our discussion about ${deal.title}. Based on your needs, here are the key value propositions that make our solution ideal for ${deal.company}...`
            },
            {
              id: `s${Date.now()}-2`,
              type: 'delay',
              name: 'Wait for Response',
              details: 'Wait 3 days for a response before proceeding',
              status: 'pending',
              delayDays: 3
            },
            {
              id: `s${Date.now()}-3`,
              type: 'task',
              name: 'Decision Maker Call',
              details: `Schedule call with primary decision maker at ${deal.company}`,
              status: 'pending',
              taskTitle: `URGENT: Schedule decision maker call for ${deal.title}`,
              taskPriority: 'high'
            },
            {
              id: `s${Date.now()}-4`,
              type: 'delay',
              name: 'Wait for Decision',
              details: 'Wait 5 days for internal decision process',
              status: 'pending',
              delayDays: 5
            },
            {
              id: `s${Date.now()}-5`,
              type: 'email',
              name: 'Contract Review',
              details: 'Send final contract for review and signature',
              status: 'pending',
              emailSubject: `Contract Ready for Review - ${deal.title}`,
              emailBody: `Hi {contact},\n\nThe contract for ${deal.title} is ready for your review. Please find attached the final agreement...`
            }
          ]
        };
      }

      const supabase = getSupabaseService();
      const newAutomation = await supabase.createAutomation({
        ...automationData,
        status: 'draft',
        dealId: deal.id,
      });

      setAvailableAutomations(prev => [...prev, newAutomation]);
      setShowAIBuilder(false);
    } catch (err) {
      const appError = handleAPIError(err, 'generate-automation');
      logError(appError, 'DealAutomationPanel AI generation');
      setError('Failed to generate automation');
    } finally {
      setAiGenerating(false);
    }
  };

  // Function to execute automation steps
  const executeAutomationStep = async (automationId: string, stepIndex: number) => {
    try {
      const automation = [...activeAutomations, ...availableAutomations].find(a => a.id === automationId);
      if (!automation || !automation.steps[stepIndex]) return;

      const step = automation.steps[stepIndex];

      // Execute step based on type
      switch (step.type) {
        case 'email':
          await executeEmailStep(step, deal);
          break;
        case 'task':
          await executeTaskStep(step, deal);
          break;
        case 'communication':
          await executeCommunicationStep(step, deal);
          break;
        case 'attachment':
          await executeAttachmentStep(step, deal);
          break;
        case 'delay':
          await executeDelayStep(automationId, stepIndex);
          return; // Don't mark as completed immediately
      }

      // Mark step as completed
      await updateStepStatus(automationId, stepIndex, 'completed');

    } catch (err) {
      console.error('Failed to execute automation step:', err);
      await updateStepStatus(automationId, stepIndex, 'failed');
    }
  };

  const executeEmailStep = async (step: any, deal: Deal) => {
    try {
      const subject = (step.emailSubject || '')
        .replace('{deal}', deal.title)
        .replace('{company}', deal.company)
        .replace('{contact}', deal.contact || '');

      const body = (step.emailBody || '')
        .replace('{deal}', deal.title)
        .replace('{company}', deal.company)
        .replace('{contact}', deal.contact || '');

      // Validate email content
      if (!subject.trim()) {
        throw new Error('Email subject cannot be empty');
      }

      if (!body.trim()) {
        throw new Error('Email body cannot be empty');
      }

      // Use mailto for email - ensure proper encoding
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Check if mailto is supported
      if (typeof window !== 'undefined' && window.open) {
        const mailWindow = window.open(mailtoUrl, '_blank');

        // Fallback if popup blocked
        if (!mailWindow || mailWindow.closed || typeof mailWindow.closed === 'undefined') {
          // Copy to clipboard as fallback
          if (navigator.clipboard) {
            const emailContent = `Subject: ${subject}\n\n${body}`;
            await navigator.clipboard.writeText(emailContent);
            alert('Email client could not be opened. Email content copied to clipboard.');
          } else {
            alert('Please copy this email content manually:\n\n' + `Subject: ${subject}\n\n${body}`);
          }
        }
      } else {
        throw new Error('Email functionality not available in this environment');
      }

      // Log the communication
      const supabase = getSupabaseService();
      await supabase.createCommunication({
        type: 'email',
        subject,
        content: body,
        direction: 'outbound',
        dealId: deal.id,
        createdBy: 'automation'
      });
    } catch (error) {
      console.error('Failed to execute email step:', error);
      throw error; // Re-throw to be handled by caller
    }
  };

  const executeTaskStep = async (step: any, deal: Deal) => {
    const title = (step.taskTitle || '')
      .replace('{deal}', deal.title)
      .replace('{company}', deal.company)
      .replace('{contact}', deal.contact || '');

    const supabase = getSupabaseService();
    await supabase.createTask({
      title,
      description: step.details,
      priority: step.taskPriority || 'medium',
      status: 'pending',
      dealId: deal.id
    });
  };

  const executeCommunicationStep = async (step: any, deal: Deal) => {
    const content = (step.communicationContent || '')
      .replace('{deal}', deal.title)
      .replace('{company}', deal.company)
      .replace('{contact}', deal.contact || '')
      .replace('{oldStage}', deal.stage)
      .replace('{newStage}', deal.stage)
      .replace('{age}', '30')
      .replace('{filename}', 'document.pdf')
      .replace('{filesize}', '1MB')
      .replace('{taskTitle}', 'task')
      .replace('{oldOwner}', 'previous owner')
      .replace('{newOwner}', 'new owner');

    const supabase = getSupabaseService();
    await supabase.createCommunication({
      type: step.communicationType || 'note',
      content,
      direction: 'outbound', // Changed from 'internal' to 'outbound'
      dealId: deal.id,
      createdBy: 'automation'
    });
  };

  const executeAttachmentStep = async (step: any, deal: Deal) => {
    // For now, just log that an attachment should be uploaded
    // In a real implementation, this would trigger file upload or generation
    console.log('Attachment step executed:', step.attachmentName);
  };

  const executeDelayStep = async (automationId: string, stepIndex: number) => {
    const automation = [...activeAutomations, ...availableAutomations].find(a => a.id === automationId);
    if (!automation || !automation.steps[stepIndex]) return;

    const step = automation.steps[stepIndex];
    const delayMs = (step.delayDays || 1) * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    // Schedule next step execution
    setTimeout(() => {
      executeAutomationStep(automationId, stepIndex + 1);
    }, delayMs);
  };

  const updateStepStatus = async (automationId: string, stepIndex: number, status: string) => {
    const supabase = getSupabaseService();
    // For now, just update the automation's last run time
    // In a full implementation, this would update individual step status
    await supabase.updateAutomation(automationId, {
      lastRun: new Date(),
      updatedAt: new Date()
    });
  };

  const createAutomationFromTemplate = async (template: any) => {
    try {
      setSaving(true);
      const supabase = getSupabaseService();

      // Create automation from template
      const newAutomation = await supabase.createAutomation({
        name: template.name,
        description: template.description,
        type: template.type,
        status: 'draft',
        dealId: deal.id,
        steps: template.steps.map((step: any) => ({
          ...step,
          id: `${step.id}-${Date.now()}`, // Make IDs unique
          status: 'pending' as const
        }))
      });

      setAvailableAutomations(prev => [...prev, newAutomation]);
    } catch (err) {
      const appError = handleAPIError(err, 'create-from-template');
      logError(appError, 'DealAutomationPanel template creation');
      setError('Failed to create automation from template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-600" />
          Deal Automations
        </h3>
        <div>
          <button 
            onClick={() => setIsCreatingNew(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-1 inline" />
            New Automation
          </button>
        </div>
      </div>
      
      {/* AI-Powered Automation Builder */}
      <div className="mb-6">
        <button 
          onClick={() => setShowAIBuilder(!showAIBuilder)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-colors shadow-md"
        >
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg mr-3">
              <Brain className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-white">AI Automation Builder</h4>
              <p className="text-white/80 text-sm">Generate deal-specific automation sequence with AI</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${showAIBuilder ? 'rotate-180' : ''}`} />
        </button>
        
        {showAIBuilder && (
          <div className="mt-3 p-6 bg-white rounded-xl border border-purple-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Generate Deal-Specific Automation</h4>
            
            {aiGenerating ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <h5 className="text-lg font-medium text-gray-900 mb-2">AI is generating your automation...</h5>
                <p className="text-gray-600 max-w-md mx-auto">
                  Creating a personalized sequence based on {deal.title}'s profile, stage, and probability.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Automation Goal
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Move to Next Stage</option>
                      <option>Accelerate Closing</option>
                      <option>Overcome Objections</option>
                      <option>Increase Deal Value</option>
                      <option>Nurture Relationship</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deal Information to Include
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" id="include-stage" />
                        <label htmlFor="include-stage" className="ml-2 text-sm text-gray-700">
                          Stage: {deal.stage}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" id="include-value" />
                        <label htmlFor="include-value" className="ml-2 text-sm text-gray-700">
                          Value: ${deal.value.toLocaleString()}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" id="include-probability" />
                        <label htmlFor="include-probability" className="ml-2 text-sm text-gray-700">
                          Probability: {deal.probability}%
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" id="include-company" />
                        <label htmlFor="include-company" className="ml-2 text-sm text-gray-700">
                          Company: {deal.company}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sequence Length
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Short (3-4 steps)</option>
                      <option>Medium (5-7 steps)</option>
                      <option>Long (8+ steps)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Communication Style
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Consultative</option>
                      <option>Direct</option>
                      <option>Educational</option>
                      <option>Value-Focused</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowAIBuilder(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleGenerateAutomation}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-colors text-sm font-medium flex items-center"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Generate with AI
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading automations...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={loadAutomations}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4 inline mr-1" />
            Retry
          </button>
        </div>
      )}

      {/* Active Automations */}
      {!loading && !error && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-medium text-gray-900">Active Automations</h4>
            <span className="text-sm text-gray-500">{activeAutomations.length} active</span>
          </div>

          {activeAutomations.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
            <Zap className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h5 className="text-lg font-medium text-gray-700 mb-2">No Active Automations</h5>
            <p className="text-gray-500 text-sm mb-4">
              Start automating your deal progression
            </p>
            <button 
              onClick={() => setIsCreatingNew(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Automation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAutomations.map(automation => (
              <div key={automation.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Automation Header */}
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${automation.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {React.createElement(getAutomationTypeIcon(automation.type), { 
                          className: `w-5 h-5 ${getAutomationTypeColor(automation.type)}` 
                        })}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="text-base font-medium text-gray-900">{automation.name}</h5>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getAutomationStatusBadgeColor(automation.status)}`}>
                            {automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getAutomationTypeBadgeColor(automation.type)}`}>
                            {automation.type === 'drip' ? 'Sequence' : 
                             automation.type === 'event' ? 'Event-Based' : 
                             automation.type === 'date' ? 'Date-Based' : 'AI-Powered'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{automation.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {automation.status === 'active' ? (
                        <button 
                          onClick={() => pauseAutomation(automation.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          title="Pause Automation"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : automation.status === 'paused' ? (
                        <button 
                          onClick={() => resumeAutomation(automation.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          title="Resume Automation"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      ) : null}
                      
                      <button 
                        onClick={() => toggleExpand(automation.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        {expandedAutomations.includes(automation.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button 
                        onClick={() => deleteAutomation(automation.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Automation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar (if applicable) */}
                  {automation.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{automation.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${automation.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Expanded Steps */}
                {expandedAutomations.includes(automation.id) && (
                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h6 className="text-sm font-medium text-gray-700">Automation Steps</h6>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Edit Steps
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {automation.steps.map((step, index) => {
                        const StepIcon = getStepIcon(step.type);
                        
                        return (
                          <div key={step.id} className="flex items-start relative">
                            {/* Connector line between steps */}
                            {index < automation.steps.length - 1 && (
                              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                            )}
                            
                            <div className={`relative flex-shrink-0 w-8 h-8 rounded-full border-2 ${
                              step.status === 'completed' ? 'border-green-500 bg-green-100' :
                              step.status === 'active' ? 'border-blue-500 bg-blue-100' :
                              step.status === 'failed' ? 'border-red-500 bg-red-100' :
                              'border-gray-300 bg-gray-100'
                            } flex items-center justify-center mr-4`}>
                              <StepIcon className={`w-4 h-4 ${getStepStatusColor(step.status)}`} />
                            </div>
                            
                            <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-3">
                              <div className="flex justify-between">
                                <h6 className="text-sm font-medium text-gray-900">{step.name}</h6>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  step.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  step.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                  step.status === 'failed' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{step.details}</p>
                              
                              {step.scheduledAt && (
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>
                                    {step.status === 'completed' ? 'Completed' : 'Scheduled'} on {step.scheduledAt.toLocaleDateString()}
                                    {step.status === 'completed' && step.completedAt && ` at ${step.completedAt.toLocaleTimeString()}`}
                                  </span>
                                </div>
                              )}
                              
                              {/* Step Actions */}
                              {step.status === 'active' && (
                                <div className="mt-2 flex space-x-2">
                                  <button className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                    Mark Complete
                                  </button>
                                  <button className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                                    Reschedule
                                  </button>
                                </div>
                              )}
                              
                              {step.status === 'pending' && (
                                <button className="mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                  View Details
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {automation.nextRun && (
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                            Next: {automation.nextRun.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        View Full Automation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      {/* Available Automations */}
      {!loading && !error && (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-medium text-gray-900">Recommended Automations</h4>
          <span className="text-sm text-gray-500">{automationTemplates.length + availableAutomations.length} available</span>
        </div>

        {/* Template Validation Summary */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
          <h5 className="text-sm font-medium text-blue-800 mb-3">Template Validation Summary</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{automationTemplates.length}</div>
              <div className="text-blue-700">Total Templates</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {automationTemplates.filter(t => getTemplateCapabilities(t, deal).isConditionValid).length}
              </div>
              <div className="text-blue-700">Valid Conditions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {automationTemplates.filter(t => getTemplateCapabilities(t, deal).isTriggerValid).length}
              </div>
              <div className="text-blue-700">Valid Triggers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {automationTemplates.filter(t => getTemplateCapabilities(t, deal).hasEmailSteps).length}
              </div>
              <div className="text-blue-700">Email Templates</div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs rounded ${filterType === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            >
              All Templates ({automationTemplates.length})
            </button>
            <button
              onClick={() => setFilterType('valid')}
              className={`px-3 py-1 text-xs rounded ${filterType === 'valid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              Valid Only ({automationTemplates.filter(t => getTemplateCapabilities(t, deal).isConditionValid && getTemplateCapabilities(t, deal).isTriggerValid).length})
            </button>
            <button
              onClick={() => setFilterType('invalid')}
              className={`px-3 py-1 text-xs rounded ${filterType === 'invalid' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
            >
              Needs Fix ({automationTemplates.filter(t => !getTemplateCapabilities(t, deal).isConditionValid || !getTemplateCapabilities(t, deal).isTriggerValid).length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Template Automations */}
          {automationTemplates
            .filter(template => {
              const capabilities = getTemplateCapabilities(template, deal);
              switch (filterType) {
                case 'valid': return capabilities.isConditionValid && capabilities.isTriggerValid;
                case 'invalid': return !capabilities.isConditionValid || !capabilities.isTriggerValid;
                default: return true;
              }
            })
            .map(template => {
              const capabilities = getTemplateCapabilities(template, deal);

              return (
                <div key={template.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      {React.createElement(getAutomationTypeIcon(template.type), {
                        className: `w-5 h-5 ${getAutomationTypeColor(template.type)}`
                      })}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-base font-medium text-gray-900 truncate">{template.name}</h5>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getAutomationTypeBadgeColor(template.type)}`}>
                            Template
                          </span>
                          {/* Status indicators */}
                          {capabilities.hasConditionalLogic && (
                            <span className={`px-2 py-0.5 text-xs rounded-full ${capabilities.isConditionValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {capabilities.isConditionValid ? '✓' : '✗'} Condition
                            </span>
                          )}
                          {(capabilities.hasStageTriggers || capabilities.hasDateTriggers) && (
                            <span className={`px-2 py-0.5 text-xs rounded-full ${capabilities.isTriggerValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {capabilities.isTriggerValid ? '✓' : '✗'} Trigger
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{template.description}</p>

                      {/* Enhanced condition display */}
                      {template.condition && (
                        <div className={`mt-2 text-xs px-2 py-1 rounded ${
                          capabilities.isConditionValid
                            ? 'text-green-700 bg-green-50 border border-green-200'
                            : 'text-red-700 bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span>
                              Condition: {template.condition.field} {template.condition.operator} {template.condition.value}
                            </span>
                            <span className="font-medium">
                              {capabilities.isConditionValid ? '✓ Valid' : '✗ Invalid'}
                            </span>
                          </div>
                          {!capabilities.isConditionValid && (
                            <div className="mt-1 text-xs opacity-75">
                              Current deal value: {String(deal[template.condition.field as keyof Deal] || 'undefined')}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Enhanced trigger display */}
                      {template.trigger && (
                        <div className={`mt-2 text-xs px-2 py-1 rounded ${
                          capabilities.isTriggerValid
                            ? 'text-blue-700 bg-blue-50 border border-blue-200'
                            : 'text-red-700 bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span>Trigger: {template.trigger.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            <span className="font-medium">
                              {capabilities.isTriggerValid ? '✓ Valid' : '✗ Invalid'}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{template.steps.length} steps</span>
                          {/* Step type indicators */}
                          {capabilities.hasEmailSteps && <span title="Has email steps"><Mail className="w-3 h-3 ml-2 text-blue-500" /></span>}
                          {capabilities.hasTaskSteps && <span title="Has task steps"><Check className="w-3 h-3 ml-1 text-green-500" /></span>}
                          {capabilities.hasCommunicationSteps && <span title="Has communication steps"><FileText className="w-3 h-3 ml-1 text-purple-500" /></span>}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleExpand(template.id)}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => createAutomationFromTemplate(template)}
                            disabled={!capabilities.isConditionValid || !capabilities.isTriggerValid}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              capabilities.isConditionValid && capabilities.isTriggerValid
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            title={
                              !capabilities.isConditionValid || !capabilities.isTriggerValid
                                ? 'Template has validation issues'
                                : 'Use this template'
                            }
                          >
                            {capabilities.isConditionValid && capabilities.isTriggerValid ? 'Use Template' : 'Fix Issues'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Preview */}
                  {expandedAutomations.includes(template.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h6 className="text-xs font-medium text-gray-700 uppercase mb-2">Steps Preview</h6>
                      <div className="space-y-2">
                        {template.steps.map((step: any, index: number) => {
                          const StepIcon = getStepIcon(step.type);

                          return (
                            <div key={step.id} className="flex items-center space-x-2">
                              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                <StepIcon className="w-3 h-3 text-gray-600" />
                              </div>
                              <span className="text-xs text-gray-700">{step.name}</span>
                              {index < template.steps.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Validation Summary */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <h6 className="text-xs font-medium text-gray-700 uppercase mb-2">Validation Status</h6>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`p-2 rounded ${capabilities.hasEmailSteps ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                            Email Steps: {capabilities.hasEmailSteps ? '✓' : '✗'}
                          </div>
                          <div className={`p-2 rounded ${capabilities.hasTaskSteps ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                            Task Steps: {capabilities.hasTaskSteps ? '✓' : '✗'}
                          </div>
                          <div className={`p-2 rounded ${capabilities.hasCommunicationSteps ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-500'}`}>
                            Communication Steps: {capabilities.hasCommunicationSteps ? '✓' : '✗'}
                          </div>
                          <div className={`p-2 rounded ${capabilities.isConditionValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            Conditions: {capabilities.isConditionValid ? '✓' : '✗'}
                          </div>
                          <div className={`p-2 rounded ${capabilities.isTriggerValid ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                            Triggers: {capabilities.isTriggerValid ? '✓' : '✗'}
                          </div>
                          <div className={`p-2 rounded ${capabilities.hasStageTriggers || capabilities.hasDateTriggers ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-500'}`}>
                            Automation Type: {capabilities.hasStageTriggers ? 'Stage' : capabilities.hasDateTriggers ? 'Date' : 'Manual'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Custom Automations */}
          {availableAutomations.map(automation => (
            <div key={automation.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  {React.createElement(getAutomationTypeIcon(automation.type), {
                    className: `w-5 h-5 ${getAutomationTypeColor(automation.type)}`
                  })}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-base font-medium text-gray-900 truncate">{automation.name}</h5>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getAutomationTypeBadgeColor(automation.type)}`}>
                      {automation.type === 'drip' ? 'Sequence' :
                       automation.type === 'event' ? 'Event-Based' :
                       automation.type === 'date' ? 'Date-Based' : 'AI-Powered'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{automation.description}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{automation.steps.length} steps</span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleExpand(automation.id)}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => activateAutomation(automation.id)}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        Activate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Preview */}
              {expandedAutomations.includes(automation.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h6 className="text-xs font-medium text-gray-700 uppercase mb-2">Steps Preview</h6>
                  <div className="space-y-2">
                    {automation.steps.map((step, index) => {
                      const StepIcon = getStepIcon(step.type);

                      return (
                        <div key={step.id} className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <StepIcon className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="text-xs text-gray-700">{step.name}</span>
                          {index < automation.steps.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      )}

      {/* Create New Automation Modal */}
      {isCreatingNew && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-gray-900">Create New Automation</h4>
              <button 
                onClick={() => setIsCreatingNew(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Basic Info */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Automation Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., Closing Sequence"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe the purpose of this automation"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Automation Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center border border-blue-500 bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors">
                    <Mail className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-blue-600">Drip Sequence</span>
                  </button>
                  <button className="flex flex-col items-center border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <Calendar className="h-6 w-6 text-yellow-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Stage-Based</span>
                  </button>
                  <button className="flex flex-col items-center border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <Target className="h-6 w-6 text-red-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Event-Based</span>
                  </button>
                  <button className="flex flex-col items-center border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <Brain className="h-6 w-6 text-indigo-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">AI-Powered</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Steps Builder */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-base font-medium text-gray-900">Automation Steps</h5>
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Step
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-blue-100 rounded">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <h6 className="text-sm font-medium text-gray-900">Value Proposition Email</h6>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Send email with personalized value proposition</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-gray-200 rounded">
                        <Clock className="w-4 h-4 text-gray-600" />
                      </div>
                      <h6 className="text-sm font-medium text-gray-900">Wait 3 Days</h6>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Wait 3 days before next action</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-blue-100 rounded">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>
                      <h6 className="text-sm font-medium text-gray-900">Follow-up Call</h6>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Schedule follow-up call to discuss next steps</p>
                </div>
                
                <button className="w-full border border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Another Step
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle save
                  setIsCreatingNew(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Save Automation
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings & Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-medium text-gray-900 flex items-center">
            <Settings className="w-4 h-4 mr-2 text-gray-600" />
            Automation Settings & Metrics
          </h4>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            <SlidersHorizontal className="w-4 h-4 mr-1" />
            Configure
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h5 className="text-sm font-medium text-gray-700 mb-1">Active Sequences</h5>
            <p className="text-2xl font-bold text-gray-900">{activeAutomations.length}</p>
            <p className="text-xs text-gray-500 mt-1">Running automations</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h5 className="text-sm font-medium text-gray-700 mb-1">Steps Completed</h5>
            <p className="text-2xl font-bold text-gray-900">
              {activeAutomations.reduce((sum, a) => 
                sum + a.steps.filter(s => s.status === 'completed').length, 0
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">Completed automation steps</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h5 className="text-sm font-medium text-gray-700 mb-1">Next Scheduled</h5>
            <p className="text-2xl font-bold text-gray-900">
              {activeAutomations[0]?.nextRun 
                ? activeAutomations[0].nextRun.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})
                : 'None'
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">Next automated action</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 flex items-center space-x-3">
          <div className="p-2 rounded-full bg-yellow-100">
            <Info className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-medium text-yellow-800">Deal Stage Control</h5>
            <p className="text-xs text-yellow-700 mt-1">
              Automations are synchronized with the current deal stage: {deal.stage}.
              Stage changes may trigger or pause certain automation sequences.
            </p>
          </div>
          <button className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-lg text-xs font-medium hover:bg-yellow-300 transition-colors">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};