import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Bug } from 'lucide-react';
import { logError } from '../utils/errorHandling';

interface Props {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

/**
 * Specialized Error Boundary for Enhanced Panel Components
 * Provides graceful degradation for AI-powered features
 */
export class EnhancedPanelErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Log error with context
    logError(error, `${this.props.componentName || 'EnhancedPanel'} ErrorBoundary`, {
      errorId,
      componentStack: errorInfo.componentStack,
      componentName: this.props.componentName
    });

    this.setState({
      error,
      errorInfo,
      errorId
    });

    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  handleRefresh = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default panel error UI
      return (
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 p-6 shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {this.props.componentName || 'Panel'} Unavailable
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We encountered an issue loading this feature. This doesn't affect your deal data.
              </p>

              {this.state.errorId && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                  Error ID: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{this.state.errorId}</code>
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Try loading the panel again"
                >
                  <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                  Try Again
                </button>

                <button
                  onClick={this.handleRefresh}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="Refresh the entire page"
                >
                  Refresh Page
                </button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center">
                    <Bug className="w-4 h-4 mr-1" aria-hidden="true" />
                    Development Details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto max-h-40 text-red-600 dark:text-red-400">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping enhanced panel components
export function withEnhancedPanelErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
  errorBoundaryProps?: Omit<Props, 'children' | 'componentName'>
) {
  const WrappedComponent = (props: P) => (
    <EnhancedPanelErrorBoundary componentName={componentName} {...errorBoundaryProps}>
      <Component {...props} />
    </EnhancedPanelErrorBoundary>
  );

  WrappedComponent.displayName = `withEnhancedPanelErrorBoundary(${componentName})`;

  return WrappedComponent;
}

export default EnhancedPanelErrorBoundary;
