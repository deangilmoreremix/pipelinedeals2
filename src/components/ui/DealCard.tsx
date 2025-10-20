import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Deal } from '../../types';
import { logError, handleAPIError } from '../../utils/errorHandling';
import {
  DollarSign,
  Edit3,
  Save,
  X,
  Trash2,
  User,
  UserPlus,
  Target,
  AlertCircle,
  CheckCircle,
  Calendar,
  Clock,
  Star,
  FileText,
  Upload,
  Brain,
  Loader2,
  Mail,
  Phone,
  UserX
} from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  onUpdate?: (id: string, updates: Partial<Deal>) => void;
  onDelete?: (id: string) => void;
  onAIResearch?: (deal: Deal) => void;
  isResearching?: boolean;
  onClick?: () => void;
}

export const DealCard: React.FC<DealCardProps> = ({ 
  deal, 
  onUpdate, 
  onDelete, 
  onAIResearch,
  isResearching = false,
  onClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editForm, setEditForm] = useState({
    company: deal.company,
    value: deal.value,
    stage: deal.stage,
    priority: deal.priority,
    contact: deal.contact || '',
    contactId: deal.contactId || '',
    notes: deal.notes || '',
    nextFollowUp: deal.nextFollowUp || '',
    tags: deal.tags || []
  });

  // Reset edit form when deal changes
  useEffect(() => {
    setEditForm({
      company: deal.company,
      value: deal.value,
      stage: deal.stage,
      priority: deal.priority,
      contact: deal.contact || '',
      contactId: deal.contactId || '',
      notes: deal.notes || '',
      nextFollowUp: deal.nextFollowUp || '',
      tags: deal.tags || []
    });
  }, [deal]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not editing
      if (isEditing) return;

      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        setIsEditing(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing]);

  const handleSave = useCallback(async () => {
    if (!onUpdate) return;

    setIsSaving(true);
    try {
      const updates: Partial<Deal> = {
        company: editForm.company,
        value: editForm.value,
        stage: editForm.stage,
        priority: editForm.priority,
        contact: editForm.contact,
        contactId: editForm.contactId,
        notes: editForm.notes,
        nextFollowUp: editForm.nextFollowUp,
        tags: editForm.tags,
        updatedAt: new Date()
      };

      await onUpdate(deal.id, updates);
      setIsEditing(false);
    } catch (error) {
      const appError = handleAPIError(error, 'deal-update');
      logError(appError, 'DealCard save operation');
      // TODO: Show error toast to user
    } finally {
      setIsSaving(false);
    }
  }, [onUpdate, deal.id, editForm, handleAPIError, logError]);

  const handleCancel = useCallback(() => {
    setEditForm({
      company: deal.company,
      value: deal.value,
      stage: deal.stage,
      priority: deal.priority,
      contact: deal.contact || '',
      contactId: deal.contactId || '',
      notes: deal.notes || '',
      nextFollowUp: deal.nextFollowUp || '',
      tags: deal.tags || []
    });
    setIsEditing(false);
  }, [deal]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Don't trigger the click if the user is clicking on a button or input
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('input')
    ) {
      return;
    }

    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) onClick();
    }
  }, [onClick]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpdate) {
      try {
        // Basic file validation
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          throw new Error('File size exceeds 10MB limit');
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('File type not supported');
        }

        const attachment = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        };

        const currentAttachments = deal.attachments || [];
        onUpdate(deal.id, {
          attachments: [...currentAttachments, attachment],
          updatedAt: new Date()
        });
      } catch (error) {
        const appError = handleAPIError(error, 'file-upload');
        logError(appError, 'DealCard file upload');
        // TODO: Show error toast to user
      }
    }
  }, [onUpdate, deal.id, deal.attachments, handleAPIError, logError]);

  const removeAttachment = useCallback((attachmentId: string) => {
    if (!onUpdate) return;

    try {
      const updatedAttachments = (deal.attachments || []).filter(
        att => att.id !== attachmentId
      );

      onUpdate(deal.id, {
        attachments: updatedAttachments,
        updatedAt: new Date()
      });
    } catch (error) {
      const appError = handleAPIError(error, 'attachment-remove');
      logError(appError, 'DealCard attachment removal');
      // TODO: Show error toast to user
    }
  }, [onUpdate, deal.id, deal.attachments, handleAPIError, logError]);

  const addTag = useCallback((tag: string) => {
    if (!tag.trim() || editForm.tags.includes(tag.trim())) return;

    setEditForm(prev => ({
      ...prev,
      tags: [...prev.tags, tag.trim()]
    }));
  }, [editForm.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const getStageColor = (stage: string) => {
    const colors = {
      'lead': 'bg-gray-100 text-gray-800',
      'qualified': 'bg-blue-100 text-blue-800',
      'proposal': 'bg-yellow-100 text-yellow-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed-won': 'bg-green-100 text-green-800',
      'closed-lost': 'bg-red-100 text-red-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600',
      'high': 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  // Generate avatar URLs based on company and contact names
  const companyAvatar = useMemo(() =>
    deal.companyAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.company)}&background=3b82f6&color=ffffff&size=40`,
    [deal.companyAvatar, deal.company]
  );

  const getContactAvatar = useCallback((contactName: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(contactName)}&background=10b981&color=ffffff&size=32`;
  }, []);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Deal card for ${deal.company}, value ${formatCurrency(deal.value)}, stage ${deal.stage}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={companyAvatar}
            alt={deal.company}
            className="w-10 h-10 rounded-lg object-cover dark:border-gray-600"
          />
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editForm.company}
                onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                aria-label="Company name"
                className="text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none dark:focus:border-blue-400"
                required
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{deal.title || deal.company}</h3>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                {deal.stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <div className={`flex items-center space-x-1 ${getPriorityColor(deal.priority)}`}>
                {getPriorityIcon(deal.priority)}
                <span className="text-xs font-medium capitalize">{deal.priority}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onAIResearch && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAIResearch(deal);
              }}
              disabled={isResearching}
              aria-label={isResearching ? `Researching ${deal.company}` : `Research ${deal.company} with AI`}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              {isResearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  <span>AI Research</span>
                </>
              )}
            </button>
          )}
          
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={isSaving}
                aria-label={isSaving ? "Saving changes" : "Save changes"}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                aria-label="Cancel editing"
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                aria-label={`Edit deal ${deal.company}`}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Add confirmation dialog
                    if (window.confirm(`Are you sure you want to delete the deal for ${deal.company}?`)) {
                      setIsDeleting(true);
                      try {
                        onDelete(deal.id);
                      } catch (error) {
                        const appError = handleAPIError(error, 'deal-delete');
                        logError(appError, 'DealCard delete operation');
                        // TODO: Show error toast to user
                      } finally {
                        setIsDeleting(false);
                      }
                    }
                  }}
                  disabled={isDeleting}
                  aria-label={isDeleting ? `Deleting deal ${deal.company}` : `Delete deal ${deal.company}`}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
          {isEditing ? (
            <input
              type="number"
              value={editForm.value}
              onChange={(e) => setEditForm(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
              aria-label="Deal value"
              className="text-lg font-semibold text-green-600 dark:text-green-400 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none w-full"
              onClick={(e) => e.stopPropagation()}
              min="0"
              step="1000"
            />
          ) : (
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(deal.value)}
            </span>
          )}
        </div>
      </div>

      {/* Contact Person (Brief Version) */}
      {deal.contact && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{deal.contact}</span>
          </div>
        </div>
      )}

      {/* Next Follow-up (Brief Version) */}
      {deal.nextFollowUp && (
        <div className="mb-4">
          <div className={`flex items-center space-x-2 ${isOverdue(deal.nextFollowUp) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Due: {formatDate(deal.nextFollowUp)}
              {isOverdue(deal.nextFollowUp) && ' (Overdue)'}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
        <span>{formatDate(deal.createdAt.toISOString())}</span>
        <span className="text-blue-600 dark:text-blue-400 hover:underline">View Details</span>
      </div>
    </div>
  );
};