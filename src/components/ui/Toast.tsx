import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  id: string;
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

/**
 * Toast notification component with dark mode support and accessibility features
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [paused, setPaused] = useState(false);

  // Control animation and timing
  useEffect(() => {
    // Fade in
    requestAnimationFrame(() => setIsVisible(true));
    
    let progressInterval: NodeJS.Timeout;
    let closeTimeout: NodeJS.Timeout;
    
    if (duration !== Infinity) {
      // Start progress bar animation
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      progressInterval = setInterval(() => {
        if (!paused) {
          const now = Date.now();
          const remaining = endTime - now;
          if (remaining <= 0) {
            clearInterval(progressInterval);
            setProgress(0);
          } else {
            setProgress((remaining / duration) * 100);
          }
        }
      }, 10);
      
      // Set timeout to close toast
      closeTimeout = setTimeout(() => {
        if (!paused) {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300); // Allow time for exit animation
        }
      }, duration);
    }
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(closeTimeout);
    };
  }, [id, duration, paused, onClose]);
  
  // Get icon based on type
  const Icon = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
  }[type];
  
  // Get color classes based on type
  const getTypeClasses = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };
  
  const getIconColor = () => {
    switch (type) {
      case 'info': return 'text-blue-500 dark:text-blue-400';
      case 'success': return 'text-green-500 dark:text-green-400';
      case 'warning': return 'text-yellow-500 dark:text-yellow-400';
      case 'error': return 'text-red-500 dark:text-red-400';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };
  
  const getTextColor = () => {
    switch (type) {
      case 'info': return 'text-blue-800 dark:text-blue-200';
      case 'success': return 'text-green-800 dark:text-green-200';
      case 'warning': return 'text-yellow-800 dark:text-yellow-200';
      case 'error': return 'text-red-800 dark:text-red-200';
      default: return 'text-gray-900 dark:text-white';
    }
  };
  
  return (
    <div
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`max-w-md w-full rounded-lg shadow-lg border ${getTypeClasses()} overflow-hidden transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className={`flex-shrink-0 ${getIconColor()}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          
          {/* Content */}
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {title}
            </p> /* Fixed text color */
            {message && (
              <p className={`mt-1 text-sm ${getTextColor()} opacity-90`}>
                {message}
              </p>
            )}
          </div>
          
          {/* Close button */}
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`rounded-md inline-flex ${getTextColor()} hover:${getTextColor()} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800`}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), 300);
              }}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {duration !== Infinity && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            className={`h-1 transition-all duration-100 ease-linear ${
              type === 'info' ? 'bg-blue-500' :
              type === 'success' ? 'bg-green-500' :
              type === 'warning' ? 'bg-yellow-500' :
              type === 'error' ? 'bg-red-500' :
              'bg-gray-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;