import React, { useState } from 'react';
import { Deal } from '../../types';
import { User, Edit, X, Check } from 'lucide-react';
import { getSupabaseService } from '../../services/supabaseService';
import { logError, handleAPIError } from '../../utils/errorHandling';

interface DealDetailSidebarProps {
  deal: Deal;
  contactData?: {
    name: string;
    email: string;
    phone?: string;
    title: string;
    avatarSrc?: string;
  };
}

export const DealDetailSidebar: React.FC<DealDetailSidebarProps> = ({ deal, contactData }) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(deal.notes || '');
  const [saving, setSaving] = useState(false);

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      const supabase = getSupabaseService();
      await supabase.updateDeal(deal.id, { notes });

      // Update local deal object (in real app, this would come from props update)
      deal.notes = notes;
      setEditingNotes(false);
    } catch (err) {
      const appError = handleAPIError(err, 'update-deal-notes');
      logError(appError, 'DealDetailSidebar save notes');
      // TODO: Show error toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-700 md:col-span-1">
      {/* Deal Overview */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deal Overview</h3>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="space-y-3">
            {/* Deal Value */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">Deal Value</p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(deal.value)}
              </p>
            </div>

            {/* Deal Stage */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">Stage</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                deal.stage === 'qualification' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                deal.stage === 'proposal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                deal.stage === 'negotiation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                deal.stage === 'closed-won' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {deal.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>

            {/* Probability */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">Probability</p>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${deal.probability}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{deal.probability}%</span>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">Priority</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                deal.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                deal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
              </span>
            </div>

            {/* Due Date */}
            {deal.dueDate && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-300">Due Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(deal.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">Created</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(deal.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Updated Date */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">Last Updated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(deal.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Person */}
      {contactData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Primary Contact</h3>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {contactData.avatarSrc ? (
                  <img
                    src={contactData.avatarSrc}
                    alt={contactData.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{contactData.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{contactData.title}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={`mailto:${contactData.email}`} className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/60 transition-colors text-sm">
                Email
              </a>
              {contactData.phone && (
                <a href={`tel:${contactData.phone}`} className="inline-flex items-center justify-center px-3 py-1 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-md hover:bg-green-100 dark:hover:bg-green-800/60 transition-colors text-sm">
                  Call
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h3>
          <button
            onClick={() => setEditingNotes(!editingNotes)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {editingNotes ? (
              <>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </>
            )}
          </button>
        </div>

        {editingNotes ? (
          <div className="space-y-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={6}
              placeholder="Add notes about this deal..."
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingNotes(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 min-h-[100px]">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {deal.notes || 'No notes added for this deal.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};