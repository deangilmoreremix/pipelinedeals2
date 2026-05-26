import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { GamificationProvider } from './contexts/GamificationContext';
import Pipeline from './components/Pipeline';
import { DarkModeToggle } from './components/ui/DarkModeToggle';
import { useKeyboardShortcuts, globalShortcuts } from './hooks/useKeyboardShortcuts';
import ErrorBoundary from './components/ErrorBoundary';
import { setupGlobalErrorHandling } from './utils/errorHandling';

export interface SmartCRMRemoteProps {
  sharedData?: {
    theme?: 'light' | 'dark';
  };
  initialRoute?: string;
  onEvent?: (event: string, data?: unknown) => void;
  onDataUpdate?: (data: unknown) => void;
}

function SmartCRMAppContent({ sharedData, onEvent, onDataUpdate }: SmartCRMRemoteProps) {
  useKeyboardShortcuts(globalShortcuts);

  useEffect(() => {
    onEvent?.('lifecycle', { phase: 'mounted' });
  }, [onEvent]);

  const theme = sharedData?.theme || 'light';

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-white`}
      data-theme={theme}
    >
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 transition-colors duration-300">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart CRM</h1>
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      <Pipeline />
    </div>
  );
}

function SmartCRMApp(props: SmartCRMRemoteProps) {
  useEffect(() => {
    setupGlobalErrorHandling();
    props.onEvent?.('lifecycle', { phase: 'initialized' });
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PersonalizationProvider>
          <GamificationProvider>
            <SmartCRMAppContent {...props} />
          </GamificationProvider>
        </PersonalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default SmartCRMApp;
export type { SmartCRMRemoteProps };
