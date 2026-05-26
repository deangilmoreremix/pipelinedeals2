import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { GamificationProvider } from './contexts/GamificationContext';
import Pipeline from './components/Pipeline';
import { useKeyboardShortcuts, globalShortcuts } from './hooks/useKeyboardShortcuts';
import ErrorBoundary from './components/ErrorBoundary';
import { setupGlobalErrorHandling } from './utils/errorHandling';

export interface SmartCRMRemoteProps {
  sharedData?: {
    theme?: 'light' | 'dark';
    user?: {
      id: string;
      email?: string;
      name?: string;
    };
  };
  initialRoute?: string;
  onEvent?: (event: string, data?: unknown) => void;
  onDataUpdate?: (data: unknown) => void;
  mountPoint?: HTMLElement;
}

function SmartCRMAppContent({ onEvent }: SmartCRMRemoteProps) {
  useKeyboardShortcuts(globalShortcuts);
  const { isInitialized } = useTheme();

  useEffect(() => {
    onEvent?.('lifecycle', { phase: 'content-mounted' });
  }, [onEvent]);

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-white">
      <Pipeline />
    </div>
  );
}

function SmartCRMApp(props: SmartCRMRemoteProps) {
  const onEvent = props.onEvent;

  useEffect(() => {
    console.log('[SmartCRM Remote] SmartCRMApp initialized', { props });
    setupGlobalErrorHandling();
    onEvent?.('lifecycle', { phase: 'initialized' });
  }, [onEvent]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PersonalizationProvider>
          <GamificationProvider>
            <SmartCRMAppContent onEvent={onEvent} />
          </GamificationProvider>
        </PersonalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default SmartCRMApp;
export type { SmartCRMRemoteProps };