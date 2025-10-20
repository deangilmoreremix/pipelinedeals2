import React, { useState, useEffect } from 'react';
import { Deal } from '../../types';
import { Mail, Phone, MessageSquare, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { getSupabaseService } from '../../services/supabaseService';
import { logError, handleAPIError } from '../../utils/errorHandling';

interface Communication {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  subject?: string;
  content: string;
  direction: 'inbound' | 'outbound';
  dealId: string;
  contactId?: string;
  createdAt: Date;
  createdBy: string;
}

interface DealDetailCommunicationsProps {
  deal: Deal;
}

export const DealDetailCommunications: React.FC<DealDetailCommunicationsProps> = ({ deal }) => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: 'note' as 'email' | 'call' | 'meeting' | 'note',
    subject: '',
    content: '',
    direction: 'outbound' as 'inbound' | 'outbound'
  });

  useEffect(() => {
    loadCommunications();
  }, [deal.id]);

  const loadCommunications = async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseService();
      const commData = await supabase.getCommunications(deal.id);
      setCommunications(commData);
    } catch (err) {
      const appError = handleAPIError(err, 'load-communications');
      logError(appError, 'DealDetailCommunications load');
      setError('Failed to load communications');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommunication = async () => {
    if (!newCommunication.content.trim()) return;

    try {
      setSaving(true);
      const supabase = getSupabaseService();

      const commData = {
        type: newCommunication.type,
        ...(newCommunication.subject && { subject: newCommunication.subject }),
        content: newCommunication.content,
        direction: newCommunication.direction,
        dealId: deal.id,
        createdBy: 'current-user', // TODO: Get from auth context
      };

      const createdComm = await supabase.createCommunication(commData);
      setCommunications(prev => [createdComm, ...prev]);

      // Reset form
      setNewCommunication({
        type: 'note',
        subject: '',
        content: '',
        direction: 'outbound'
      });
      setShowAddForm(false);
    } catch (err) {
      const appError = handleAPIError(err, 'create-communication');
      logError(appError, 'DealDetailCommunications create');
      setError('Failed to add communication');
    } finally {
      setSaving(false);
    }
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'call': return Phone;
      case 'meeting': return MessageSquare;
      case 'note': return MessageSquare;
      default: return MessageSquare;
    }
  };

  const getCommunicationTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/50';
      case 'call': return 'text-green-600 bg-green-100 dark:bg-green-900/50';
      case 'meeting': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/50';
      case 'note': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/50';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/50';
    }
  };

  const getDirectionBadge = (direction: string) => {
    return direction === 'inbound'
      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Loading communications...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Communication History</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Communication
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={loadCommunications}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Add Communication Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add Communication</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newCommunication.type}
                  onChange={(e) => setNewCommunication(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="note">Note</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Direction
                </label>
                <select
                  value={newCommunication.direction}
                  onChange={(e) => setNewCommunication(prev => ({ ...prev, direction: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="outbound">Outbound</option>
                  <option value="inbound">Inbound</option>
                </select>
              </div>
            </div>

            {(newCommunication.type === 'email' || newCommunication.type === 'meeting') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newCommunication.subject}
                  onChange={(e) => setNewCommunication(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Communication subject"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                value={newCommunication.content}
                onChange={(e) => setNewCommunication(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                placeholder="Communication details..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCommunication}
                disabled={saving || !newCommunication.content.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Communication'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Communications List */}
      <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600">
        {communications.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No communications yet</h4>
            <p className="text-gray-500 dark:text-gray-400">Start logging your communications with this deal.</p>
          </div>
        ) : (
          communications.map((comm) => {
            const IconComponent = getCommunicationIcon(comm.type);

            return (
              <div key={comm.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-600">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getCommunicationTypeColor(comm.type)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {comm.subject || `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)} Communication`}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDirectionBadge(comm.direction)}`}>
                          {comm.direction}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comm.createdAt).toLocaleDateString()} at {new Date(comm.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {comm.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};