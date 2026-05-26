console.log('[SmartCRM Remote] App.tsx loaded');

import React from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { GamificationProvider } from './contexts/GamificationContext';
import Pipeline from './components/Pipeline';
import { DarkModeToggle } from './components/ui/DarkModeToggle';
import { useKeyboardShortcuts, globalShortcuts } from './hooks/useKeyboardShortcuts';
import ErrorBoundary from './components/ErrorBoundary';
import { setupGlobalErrorHandling } from './utils/errorHandling';

function AppContent() {
  useKeyboardShortcuts(globalShortcuts);
  const { theme, isInitialized } = useTheme();

  console.log('[SmartCRM Remote] AppContent render, theme:', theme, 'isInitialized:', isInitialized);

  if (!isInitialized) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isRemote = !!(window as any).__SMARTCRM_REMOTE__ || !!(window as any).__FEDERATION__;

  // In remote mode, render fullscreen without header (host provides layout)
  if (isRemote) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-white">
        <Pipeline />
      </div>
    );
  }

  // Standalone mode: include header
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-white">
      {/* Header */}
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

      {/* Main content */}
      <Pipeline />
    </div>
  );
}

function App() {
  console.log('[SmartCRM Remote] App component rendering');

  React.useEffect(() => {
    setupGlobalErrorHandling();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PersonalizationProvider>
          <GamificationProvider>
            <AppContent />
          </GamificationProvider>
        </PersonalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;