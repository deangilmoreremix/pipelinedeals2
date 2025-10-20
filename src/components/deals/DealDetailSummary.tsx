import React from 'react';
import { Deal } from '../../types';
import { Activity, Calendar, ArrowRight, TrendingUp, Users, DollarSign } from 'lucide-react';

interface DealDetailSummaryProps {
  deal: Deal;
}

export const DealDetailSummary: React.FC<DealDetailSummaryProps> = ({ deal }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStageProgress = (stage: string) => {
    const stages = ['qualification', 'proposal', 'negotiation', 'closed-won'];
    const currentIndex = stages.indexOf(stage);
    return currentIndex >= 0 ? ((currentIndex + 1) / stages.length) * 100 : 0;
  };

  const getDaysInPipeline = () => {
    const created = new Date(deal.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deal Summary</h3>

      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Details</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
            <p className="font-medium text-gray-900 dark:text-white">{deal.contact || 'Not assigned'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
            <p className="font-medium text-gray-900 dark:text-white">{deal.company}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Value</p>
            <p className="font-medium text-green-600 dark:text-green-400">{formatCurrency(deal.value)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Stage</p>
            <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              deal.stage === 'qualification' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              deal.stage === 'proposal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
              deal.stage === 'negotiation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              deal.stage === 'closed-won' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {deal.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity Summary */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
            Activity
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last activity 2 days ago</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Email sent: "Follow-up on proposal"</p>
        </div>

        {/* Timeline Position */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
            Timeline
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{getDaysInPipeline()} days in pipeline</p>
          <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2">
            <div
              className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${getStageProgress(deal.stage)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {Math.round(getStageProgress(deal.stage))}% through pipeline
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <ArrowRight className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
            Next Steps
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {deal.stage === 'qualification' && 'Complete qualification checklist and prepare proposal'}
            {deal.stage === 'proposal' && 'Send proposal and schedule follow-up call'}
            {deal.stage === 'negotiation' && 'Address objections and finalize terms'}
            {deal.stage === 'closed-won' && 'Send contract and onboarding materials'}
            {deal.stage === 'closed-lost' && 'Document reasons for loss and update contact'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {deal.nextFollowUp ? `Due ${new Date(deal.nextFollowUp).toLocaleDateString()}` : 'No follow-up scheduled'}
          </p>
        </div>
      </div>

      {/* Deal Metrics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Deal Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(deal.value)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Probability</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{deal.probability}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-purple-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Days Active</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{getDaysInPipeline()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-orange-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{deal.priority}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};