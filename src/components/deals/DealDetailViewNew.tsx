import React, { useState } from 'react';
import { Deal } from '../../types';
import { FileText, MessageSquare, CheckSquare, Edit, Sparkles } from 'lucide-react';
import { DealDetailHeader } from './DealDetailHeader';
import { DealDetailSidebar } from './DealDetailSidebar';
import { DealDetailSummary } from './DealDetailSummary';
import { DealDetailTasks } from './DealDetailTasks';
import { DealDetailCommunications } from './DealDetailCommunications';
import { DealDetailAttachments } from './DealDetailAttachments';
import { DealDetailEdit } from './DealDetailEdit';
import { DealAutomationPanel } from './DealAutomationPanel';

interface DealDetailViewNewProps {
  deal: Deal;
  onClose: () => void;
  onUpdate: (deal: Deal) => void;
  contactData?: {
    name: string;
    email: string;
    phone?: string;
    title: string;
    avatarSrc?: string;
  };
}

export const DealDetailViewNew: React.FC<DealDetailViewNewProps> = ({
  deal,
  onClose,
  onUpdate,
  contactData
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'tasks' | 'communications' | 'attachments' | 'edit' | 'automation'>('summary');

  const tabs = [
    { id: 'summary' as const, label: 'Summary', icon: Sparkles },
    { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare },
    { id: 'communications' as const, label: 'Communications', icon: MessageSquare },
    { id: 'attachments' as const, label: 'Attachments', icon: FileText },
    { id: 'automation' as const, label: 'Automation', icon: Sparkles },
    { id: 'edit' as const, label: 'Edit', icon: Edit },
  ];

  const handleSave = (updatedDeal: Deal) => {
    onUpdate(updatedDeal);
    setActiveTab('summary'); // Switch back to summary after save
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <DealDetailSummary deal={deal} />;
      case 'tasks':
        return <DealDetailTasks deal={deal} />;
      case 'communications':
        return <DealDetailCommunications deal={deal} />;
      case 'attachments':
        return <DealDetailAttachments deal={deal} />;
      case 'automation':
        return <DealAutomationPanel deal={deal} />;
      case 'edit':
        return (
          <DealDetailEdit
            deal={deal}
            onSave={handleSave}
            onCancel={() => setActiveTab('summary')}
          />
        );
      default:
        return <DealDetailSummary deal={deal} />;
    }
  };

  return (
    <>
      <DealDetailHeader deal={deal} onClose={onClose} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {contactData && <DealDetailSidebar deal={deal} contactData={contactData} />}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <nav className="flex space-x-4 px-6 py-3 overflow-x-auto" aria-label="Deal detail tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }
                    `}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};