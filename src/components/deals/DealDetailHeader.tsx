import React from 'react';
import { Deal } from '../../types';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface DealDetailHeaderProps {
  deal: Deal;
  onClose: () => void;
}

export const DealDetailHeader: React.FC<DealDetailHeaderProps> = ({ deal, onClose }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Deal Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Deal Overview Card */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={deal.companyAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.company)}&background=3b82f6&color=ffffff&size=40`}
                  alt={deal.company}
                  className="h-12 w-12 rounded-lg border border-gray-200 dark:border-gray-600"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{deal.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{deal.company}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Deal Value</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(deal.value)}</p>
                </div>

                <div className="text-right">
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

                {deal.stage !== 'closed-won' && deal.stage !== 'closed-lost' && (
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" /> Mark Won
                    </button>
                    <button className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                      <XCircle className="w-4 h-4 mr-1" /> Mark Lost
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};