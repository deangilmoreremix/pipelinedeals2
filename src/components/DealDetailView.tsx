import React, { useState, useEffect, useRef } from 'react';
import { Deal } from '../types';
import { Contact } from '../types/contact';
import { useAIResearch } from '../services/aiResearchService';
import { CustomizableAIToolbar } from './ui/CustomizableAIToolbar';
import { AIInsightsPanel } from './deals/AIInsightsPanel';
import { DealJourneyTimeline } from './deals/DealJourneyTimeline';
import { DealCommunicationHub } from './deals/DealCommunicationHub';
import { DealAnalyticsDashboard } from './deals/DealAnalyticsDashboard';
import { DealAutomationPanel } from './deals/DealAutomationPanel';
import { ModernButton } from './ui/ModernButton';
import {
  X,
  Edit,
  Globe,
  Mail, 
  Phone,
  Building2,
  Tag,
  Save,
  Plus,
  User,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  Database,
  BarChart2,
  MessageSquare,
  Zap,
  FileText,
  Target,
  Sparkles,
  Brain,
  Crown,
  Star,
  Award,
  Trophy,
  Heart,
  Briefcase,
  FileUp,
  Link,
  ExternalLink,
  Trash2,
  Camera,
  RefreshCw,
  Loader2,
  Search,
  Wand2,
  Users,
} from 'lucide-react';

interface DealDetailViewProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Deal>) => Promise<any>;
  contactData?: Contact | null;
}

export const DealDetailView: React.FC<DealDetailViewProps> = ({
  deal,
  isOpen,
  onClose,
  onUpdate,
  contactData
}) => {
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({ ...deal });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'journey' | 'communication' | 'analytics' | 'automation'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [isFindingImage, setIsFindingImage] = useState(false);
  const [showAttachmentForm, setShowAttachmentForm] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [newAttachment, setNewAttachment] = useState({ name: '', file: null as File | null });
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [newTag, setNewTag] = useState('');
  const [newCustomField, setNewCustomField] = useState({ name: '', value: '' });
  
  // Create refs for file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dealCardRef = useRef<HTMLDivElement>(null);
  
  // Get the AI research service
  const aiResearch = useAIResearch();

  useEffect(() => {
    // Update form data when deal changes
    setFormData({ ...deal });
  }, [deal]);

  const toggleEditMode = (field: string) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (field: string) => {
    setSaving(true);
    try {
      const updates = { [field]: formData[field as keyof Deal] };
      await onUpdate(deal.id, updates);
      toggleEditMode(field);
    } catch (error) {
      console.error('Failed to update deal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTagAdd = () => {
    if (!newTag.trim()) return;
    const updatedTags = [...(formData.tags || []), newTag.trim()];
    setFormData(prev => ({ ...prev, tags: updatedTags }));
    onUpdate(deal.id, { tags: updatedTags });
    setNewTag('');
  };

  const handleTagRemove = (tagToRemove: string) => {
    const updatedTags = (formData.tags || []).filter(tag => tag !== tagToRemove);
    setFormData(prev => ({ ...prev, tags: updatedTags }));
    onUpdate(deal.id, { tags: updatedTags });
  };

  const handleAddCustomField = () => {
    if (!newCustomField.name || !newCustomField.value) return;
    
    const updatedCustomFields = {
      ...(formData.customFields || {}),
      [newCustomField.name]: newCustomField.value
    };
    
    setFormData(prev => ({ ...prev, customFields: updatedCustomFields }));
    onUpdate(deal.id, { customFields: updatedCustomFields });
    setNewCustomField({ name: '', value: '' });
  };

  const handleRemoveCustomField = (fieldName: string) => {
    const updatedCustomFields = { ...(formData.customFields || {}) };
    delete updatedCustomFields[fieldName];
    
    setFormData(prev => ({ ...prev, customFields: updatedCustomFields }));
    onUpdate(deal.id, { customFields: updatedCustomFields });
  };

  const handleAddLink = () => {
    if (!newLink.url || !newLink.title) return;
    
    const link = {
      title: newLink.title,
      url: newLink.url,
      createdAt: new Date().toISOString()
    };
    
    const updatedLinks = [...(formData.links || []), link];
    setFormData(prev => ({ ...prev, links: updatedLinks }));
    onUpdate(deal.id, { links: updatedLinks });
    setNewLink({ title: '', url: '' });
    setShowLinkForm(false);
  };

  const handleRemoveLink = (url: string) => {
    const updatedLinks = (formData.links || []).filter(link => link.url !== url);
    setFormData(prev => ({ ...prev, links: updatedLinks }));
    onUpdate(deal.id, { links: updatedLinks });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAttachment({
        ...newAttachment,
        file: e.target.files[0],
        name: e.target.files[0].name
      });
    }
  };

  const handleAddAttachment = () => {
    if (!newAttachment.file) return;
    
    // In a real app, you'd upload the file to storage and get a URL
    // For now, we'll just add the file metadata
    const attachment = {
      id: Date.now().toString(),
      name: newAttachment.name || newAttachment.file.name,
      size: newAttachment.file.size,
      type: newAttachment.file.type,
      uploadedAt: new Date().toISOString()
    };
    
    const updatedAttachments = [...(formData.attachments || []), attachment];
    setFormData(prev => ({ ...prev, attachments: updatedAttachments }));
    onUpdate(deal.id, { attachments: updatedAttachments });
    setNewAttachment({ name: '', file: null });
    setShowAttachmentForm(false);
  };

  const handleRemoveAttachment = (id: string) => {
    const updatedAttachments = (formData.attachments || []).filter(a => a.id !== id);
    setFormData(prev => ({ ...prev, attachments: updatedAttachments }));
    onUpdate(deal.id, { attachments: updatedAttachments });
  };

  const handleToggleFavorite = async () => {
    const isFavorite = !formData.isFavorite;
    setFormData(prev => ({ ...prev, isFavorite }));
    await onUpdate(deal.id, { isFavorite });
  };
  
  const handleFindNewImage = async () => {
    setIsFindingImage(true);
    try {
      // Call AI service to find a company logo
      const newLogo = await aiResearch.findCompanyLogo(formData.company);
      setFormData(prev => ({ ...prev, companyAvatar: newLogo }));
      await onUpdate(deal.id, { companyAvatar: newLogo });
    } catch (error) {
      console.error('Failed to find new image:', error);
    } finally {
      setIsFindingImage(false);
    }
  };
  
  // AI Analysis functions
  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulating AI analysis
      const analysis = await aiResearch.enhanceWithAI(deal, 'Analyze this deal', 'quality');
      
      // Update deal with analysis results
      const newProbability = Math.min(deal.probability + 10, 95);
      await onUpdate(deal.id, {
        probability: newProbability,
        notes: deal.notes 
          ? `${deal.notes}\n\nAI Analysis: ${analysis.aiInsights.join('. ')}`
          : `AI Analysis: ${analysis.aiInsights.join('. ')}`,
        aiScore: newProbability,
        lastEnrichment: {
          confidence: newProbability,
          aiProvider: analysis.enhancedBy || 'AI Assistant',
          timestamp: new Date()
        }
      });
      
      return true;
    } catch (error) {
      console.error('AI analysis failed:', error);
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleAIEnrich = async () => {
    setIsEnriching(true);
    try {
      // Use AI to research the company
      const companyData = await aiResearch.researchCompany(formData.company);
      
      // Update deal with enriched company data
      const newProbability = Math.min(deal.probability + 15, 95);
      const enrichmentNotes = `
AI Company Research (${companyData.aiProvider}):
- Industry: ${companyData.industry}
- Founded: ${companyData.foundedYear}
- HQ: ${companyData.headquarters}
- Revenue: ${companyData.revenue}
- Employees: ${companyData.employeeCount}

Description: ${companyData.description}

Key Executives: ${companyData.keyExecutives?.map(exec => `${exec.name} (${exec.title})`).join(', ') || 'Not found'}

Potential Needs:
${companyData.potentialNeeds.map(need => `- ${need}`).join('\n')}

Sales Approach: ${companyData.salesApproach}
      `.trim();
      
      // Update deal with company research
      await onUpdate(deal.id, {
        probability: newProbability,
        notes: deal.notes 
          ? `${deal.notes}\n\n${enrichmentNotes}`
          : enrichmentNotes,
        aiScore: newProbability,
        lastEnrichment: {
          confidence: newProbability,
          aiProvider: companyData.aiProvider,
          timestamp: new Date()
        }
      });
      
      return true;
    } catch (error) {
      console.error('AI enrichment failed:', error);
      return false;
    } finally {
      setIsEnriching(false);
    }
  };

  if (!isOpen) return null;

  // Helper to convert deal stages to colors
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'qualification': return 'bg-blue-500 text-white';
      case 'proposal': return 'bg-indigo-500 text-white';
      case 'negotiation': return 'bg-purple-500 text-white';
      case 'closed-won': return 'bg-green-500 text-white';
      case 'closed-lost': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[95vw] max-h-[95vh] overflow-hidden flex animate-scale-in shadow-2xl">
        {/* Left Side - Deal Profile */}
        <div className="w-2/5 bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col max-h-[95vh]">
          {/* Fixed Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-gray-900">Deal Profile</h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Deal Title and Basic Info */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="relative">
                  <img
                    src={deal.companyAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${deal.company}&backgroundColor=3b82f6&textColor=ffffff`}
                    alt={deal.company}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  />
                  
                  {/* Favorite Badge if applicable */}
                  {deal.isFavorite && (
                    <div className="absolute -top-2 -left-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                  )}
                  
                  <button 
                    onClick={handleFindNewImage}
                    disabled={isFindingImage}
                    className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    {isFindingImage ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Camera className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Deal Title */}
              {editMode.title ? (
                <div className="mb-4">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Deal Title"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleEditMode('title')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('title')}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <h4 className="text-xl font-semibold text-gray-900 mb-1 flex items-center justify-center space-x-2">
                  <span>{deal.title}</span>
                  <button
                    onClick={() => toggleEditMode('title')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                </h4>
              )}
              
              {/* Company Name */}
              {editMode.company ? (
                <div className="mb-4">
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Company Name"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleEditMode('company')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('company')}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm flex items-center justify-center space-x-2">
                  <span>{deal.company}</span>
                  <button
                    onClick={() => toggleEditMode('company')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                </p>
              )}
              
              {/* Deal Stage and Priority */}
              <div className="mt-3 flex justify-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                  {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1).replace('-', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(deal.priority)}`}>
                  {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)} Priority
                </span>
              </div>

              {/* AI Action Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <ModernButton
                  variant="primary"
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      <span>AI Analysis</span>
                    </>
                  )}
                </ModernButton>
                
                <ModernButton
                  variant="outline"
                  onClick={handleAIEnrich}
                  disabled={isEnriching}
                  size="sm"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  {isEnriching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Enriching...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      <span>AI Auto-Enrich</span>
                    </>
                  )}
                </ModernButton>
                
                <ModernButton
                  variant="outline"
                  onClick={handleToggleFavorite}
                  size="sm"
                  className={deal.isFavorite 
                    ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100" 
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"}
                >
                  <Heart className={`w-4 h-4 mr-2 ${deal.isFavorite ? 'fill-current' : ''}`} />
                  <span>{deal.isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                </ModernButton>
                
                <ModernButton
                  variant="outline"
                  onClick={() => {
                    // In a real app, this would open a share dialog
                    console.log('Share deal', deal.id);
                  }}
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>Share Deal</span>
                </ModernButton>
              </div>
              
              {/* AI Enhancement Notice - if applicable */}
              {deal.lastEnrichment && (
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 shadow-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span className="text-xs font-medium text-purple-800">
                      AI Enhanced{deal.lastEnrichment.aiProvider ? ` (${deal.lastEnrichment.aiProvider})` : ''}
                    </span>
                    {deal.lastEnrichment.confidence && (
                      <span className="text-xs text-purple-600">
                        ({deal.lastEnrichment.confidence}% confidence)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Deal Value and Probability */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                Deal Value & Probability
              </h4>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Deal Value */}
                {editMode.value ? (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Deal Value</label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => handleInputChange('value', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleEditMode('value')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave('value')}
                        disabled={saving}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Deal Value</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(deal.value)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleEditMode('value')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Probability/Score */}
                {editMode.probability ? (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Probability (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) => handleInputChange('probability', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleEditMode('probability')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave('probability')}
                        disabled={saving}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {deal.aiScore ? 'AI Score' : 'Probability'}
                          {deal.lastEnrichment?.timestamp && (
                            <span className="text-xs text-gray-500 ml-1">
                              • {new Date(deal.lastEnrichment.timestamp).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center">
                          <p className={`text-xl font-bold ${getScoreColor(deal.probability)}`}>
                            {deal.probability}%
                          </p>
                          {deal.aiScore && <Sparkles className="w-4 h-4 text-yellow-500 ml-1" />}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleEditMode('probability')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Probability Bar */}
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        deal.probability >= 80 ? 'bg-green-500' : 
                        deal.probability >= 60 ? 'bg-blue-500' : 
                        deal.probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${deal.probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Person Information */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <User className="w-4 h-4 mr-2 text-purple-600" />
                  Contact Person
                </h4>
                <button
                  onClick={() => toggleEditMode('contact')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              {editMode.contact ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Contact Name"
                  />
                  <input
                    type="text"
                    value={formData.contactId || ''}
                    onChange={(e) => handleInputChange('contactId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Contact ID (optional)"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleEditMode('contact')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('contact')}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {contactData ? (
                    <div className="flex items-center space-x-3">
                      <img
                        src={contactData.avatarSrc || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contactData.name}`}
                        alt={contactData.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{contactData.name}</p>
                        <p className="text-sm text-gray-600 truncate">{contactData.title} at {contactData.company}</p>
                        
                        <div className="mt-2 flex items-center space-x-3">
                          <a
                            href={`mailto:${contactData.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </a>
                          {contactData.phone && (
                            <a
                              href={`tel:${contactData.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm text-green-600 hover:text-green-800 flex items-center"
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : deal.contact ? (
                    <div className="flex items-center space-x-3">
                      <img
                        src={deal.contactAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${deal.contact}`}
                        alt={deal.contact}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{deal.contact}</p>
                        <p className="text-sm text-gray-600">Contact not linked</p>
                        
                        <button
                          onClick={() => {
                            // This would open a contact selector in a real app
                            console.log('Link contact');
                            toggleEditMode('contact');
                          }}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                        >
                          Link to CRM contact
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3 bg-gray-50 rounded-lg">
                      <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No contact assigned</p>
                      <button
                        onClick={() => toggleEditMode('contact')}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        Add Contact
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timeline and Due Date */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                Timeline
              </h4>
              
              <div className="space-y-4">
                {/* Created At */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="text-sm text-gray-900">{new Date(deal.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                {/* Due Date */}
                {editMode.dueDate ? (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('dueDate', e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleEditMode('dueDate')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave('dueDate')}
                        disabled={saving}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Due Date</p>
                        {deal.dueDate ? (
                          <p className={`text-sm ${
                            new Date() > new Date(deal.dueDate) 
                              ? 'text-red-600 font-medium' 
                              : 'text-gray-900'
                          }`}>
                            {new Date(deal.dueDate).toLocaleDateString()}
                            {new Date() > new Date(deal.dueDate) && ' (Overdue)'}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Not set</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleEditMode('dueDate')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                {/* Days Active */}
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Days Active</p>
                    <p className="text-sm text-gray-900">
                      {Math.ceil((new Date().getTime() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Custom Fields */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Database className="w-4 h-4 mr-2 text-purple-600" />
                  Custom Fields
                </h4>
                <button
                  onClick={() => setNewCustomField({ name: '', value: '' })}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {newCustomField.name !== '' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newCustomField.name}
                      onChange={(e) => setNewCustomField(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Field Name"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={newCustomField.value}
                      onChange={(e) => setNewCustomField(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Field Value"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setNewCustomField({ name: '', value: '' })}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCustomField}
                      disabled={!newCustomField.name || !newCustomField.value}
                      className="flex-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                    >
                      Add Field
                    </button>
                  </div>
                </div>
              )}
              
              {formData.customFields && Object.keys(formData.customFields).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(formData.customFields).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">{key}</p>
                        <p className="text-sm font-medium text-gray-800">{value as string}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveCustomField(key)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 italic">No custom fields</p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-blue-600" />
                  Tags
                </h4>
              </div>
              
              <div className="mb-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add a tag"
                  />
                  <button
                    onClick={handleTagAdd}
                    disabled={!newTag.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {formData.tags && formData.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {tag}
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 italic">No tags</p>
              )}
            </div>
            
            {/* Files & Attachments */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-teal-600" />
                  Files & Attachments
                </h4>
                <button
                  onClick={() => setShowAttachmentForm(!showAttachmentForm)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add File
                </button>
              </div>
              
              {showAttachmentForm && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File
                    </label>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="w-full"
                      ref={fileInputRef}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name (optional)
                    </label>
                    <input
                      type="text"
                      value={newAttachment.name}
                      onChange={(e) => setNewAttachment(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="File name to display"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowAttachmentForm(false)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAttachment}
                      disabled={!newAttachment.file}
                      className="flex-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              )}
              
              {formData.attachments && formData.attachments.length > 0 ? (
                <div className="space-y-2">
                  {formData.attachments.map((file) => (
                    <div key={file.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-blue-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAttachment(file.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 italic">No files attached</p>
              )}
            </div>
            
            {/* External Links */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Link className="w-4 h-4 mr-2 text-indigo-600" />
                  External Links
                </h4>
                <button
                  onClick={() => setShowLinkForm(!showLinkForm)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Link
                </button>
              </div>
              
              {showLinkForm && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link Title
                    </label>
                    <input
                      type="text"
                      value={newLink.title}
                      onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Proposal Document"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowLinkForm(false)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddLink}
                      disabled={!newLink.title || !newLink.url}
                      className="flex-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                    >
                      Add Link
                    </button>
                  </div>
                </div>
              )}
              
              {formData.links && formData.links.length > 0 ? (
                <div className="space-y-2">
                  {formData.links.map((link) => (
                    <div key={link.url} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <ExternalLink className="w-4 h-4 text-indigo-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{link.title}</p>
                          <a 
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-blue-600 hover:text-blue-800 truncate max-w-[180px] inline-block"
                          >
                            {link.url}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveLink(link.url)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 italic">No links added</p>
              )}
            </div>
            
            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gray-600" />
                  Notes
                </h4>
                <button
                  onClick={() => toggleEditMode('notes')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              {editMode.notes ? (
                <div className="space-y-3">
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={5}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleEditMode('notes')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('notes')}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">
                    {deal.notes || 'No notes for this deal.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* AI Tools Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Brain className="w-4 h-4 mr-2 text-purple-600" />
                AI Assistant Tools
              </h4>
              
              <CustomizableAIToolbar
                entityType="deal"
                entityId={deal.id}
                entityData={deal}
                location="dealDetailView"
                layout="grid"
                size="sm"
                showCustomizeButton={true}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Detailed Information */}
        <div className="flex-1 bg-white overflow-y-auto flex flex-col">
          {/* Tabs Navigation */}
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-3">
            <div className="flex space-x-1">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'insights', label: 'AI Insights', icon: Brain },
                { id: 'journey', label: 'Journey', icon: Target },
                { id: 'communication', label: 'Communication', icon: MessageSquare },
                { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                { id: 'automation', label: 'Automation', icon: Zap }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-8 flex-1 overflow-y-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Deal Overview</h3>
                  <ModernButton 
                    variant="primary" 
                    size="sm"
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        <span>AI Analysis</span>
                      </>
                    )}
                  </ModernButton>
                </div>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Deal Details */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-500" />
                      Deal Summary
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Deal Title</p>
                        <p className="text-base text-gray-900">{deal.title}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Company</p>
                        <p className="text-base text-gray-900">{deal.company}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Value</p>
                        <p className="text-base text-green-600 font-bold">{formatCurrency(deal.value)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Stage</p>
                        <p className="text-base text-gray-900 capitalize">{deal.stage.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Priority</p>
                        <p className="text-base text-gray-900 capitalize">{deal.priority}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Enrichment Insights */}
                  {deal.lastEnrichment ? (
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                        AI Enrichment
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">AI Provider</p>
                          <p className="text-base text-gray-900">{deal.lastEnrichment.aiProvider || 'AI Assistant'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Confidence Score</p>
                          <p className="text-base text-purple-600 font-bold">{deal.lastEnrichment.confidence}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Last Updated</p>
                          <p className="text-base text-gray-900">
                            {deal.lastEnrichment.timestamp ? new Date(deal.lastEnrichment.timestamp).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="pt-2">
                          <ModernButton 
                            variant="outline" 
                            size="sm" 
                            onClick={handleAIEnrich}
                            disabled={isEnriching}
                            className="w-full flex items-center justify-center bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
                          >
                            {isEnriching ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                <span>Refreshing...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-3 h-3 mr-2" />
                                <span>Refresh AI Data</span>
                              </>
                            )}
                          </ModernButton>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-purple-500" />
                        AI Research
                      </h4>
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          This deal hasn't been analyzed by AI yet. 
                          Use AI Research to get insights about the company and deal potential.
                        </p>
                        <div className="pt-2">
                          <ModernButton 
                            variant="primary" 
                            size="sm" 
                            onClick={handleAIEnrich}
                            disabled={isEnriching}
                            className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            {isEnriching ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                <span>Researching...</span>
                              </>
                            ) : (
                              <>
                                <Search className="w-4 h-4 mr-2" />
                                <span>Research Company</span>
                              </>
                            )}
                          </ModernButton>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Timeline Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200 p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-green-500" />
                      Timeline
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Created Date</p>
                        <p className="text-base text-gray-900">{new Date(deal.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Last Updated</p>
                        <p className="text-base text-gray-900">{new Date(deal.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Days in Current Stage</p>
                        <p className="text-base text-gray-900">
                          {/* This would be calculated from stage history in a real app */}
                          12
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Expected Close</p>
                        <p className="text-base text-gray-900">
                          {deal.dueDate ? new Date(deal.dueDate).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors">
                      <Mail className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Email</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                      <Phone className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Call</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors">
                      <Calendar className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Meeting</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors">
                      <FileUp className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Upload</span>
                    </button>
                  </div>
                </div>
                
                {/* Social Profiles */}
                {formData.socialProfiles && Object.values(formData.socialProfiles).some(Boolean) && (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-500" />
                      Company Profiles
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {formData.socialProfiles.linkedin && (
                        <a 
                          href={formData.socialProfiles.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                          </svg>
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {formData.socialProfiles.website && (
                        <a 
                          href={formData.socialProfiles.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Website</span>
                        </a>
                      )}
                      {formData.socialProfiles.twitter && (
                        <a 
                          href={formData.socialProfiles.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                          </svg>
                          <span>Twitter</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* AI Insights Tab */}
            {activeTab === 'insights' && (
              <AIInsightsPanel deal={deal} />
            )}
            
            {/* Journey Tab */}
            {activeTab === 'journey' && (
              <DealJourneyTimeline deal={deal} />
            )}
            
            {/* Communication Tab */}
            {activeTab === 'communication' && (
              <DealCommunicationHub deal={deal} contact={contactData || null} />
            )}
            
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <DealAnalyticsDashboard deal={deal} />
            )}
            
            {/* Automation Tab */}
            {activeTab === 'automation' && (
              <DealAutomationPanel deal={deal} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};