import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { GamificationProvider } from './contexts/GamificationContext';
import Pipeline from './components/Pipeline';
import { DarkModeToggle } from './components/ui/DarkModeToggle';
import { useKeyboardShortcuts, globalShortcuts } from './hooks/useKeyboardShortcuts';
import ErrorBoundary from './components/ErrorBoundary';
import { setupGlobalErrorHandling } from './utils/errorHandling';
import { ContactsModal } from './components/contacts/ContactsModal';

// Exact props contract as required for Module Federation hosts
export interface SmartCRMRemoteProps {
  sharedData?: {
    user?: any;
    isAuthenticated?: boolean;
    session?: any;
    tenant?: any;
    theme?: 'light' | 'dark';
  };
  initialRoute?: string;           // e.g. "/dashboard", "/contacts/123", "/pipeline"
  onEvent?: (event: { type: string; payload?: any }) => void;
  onDataUpdate?: (data: any) => void;
}

interface SmartCRMAppProps extends SmartCRMRemoteProps {}

// The complete, full self-contained application shell.
// This is what every host (including app.smartcrm.vip) will see when loading the remote.
function FullAppShell({ onEvent, initialRoute }: { onEvent?: SmartCRMRemoteProps['onEvent']; initialRoute?: string }) {
  useKeyboardShortcuts(globalShortcuts);
  const { isInitialized } = useTheme();
  const [showContactsModal, setShowContactsModal] = useState(false);

  // Fire navigation + lifecycle events for the host
  const fireEvent = useCallback((type: string, payload?: any) => {
    onEvent?.({ type, payload });
    console.log('[SmartCRM Remote] Event:', type, payload);
  }, [onEvent]);

  // Support for deep linking via initialRoute (fires events + triggers in-app behavior)
  useEffect(() => {
    if (!initialRoute) return;

    const route = initialRoute.toLowerCase();
    fireEvent('navigation', { route, source: 'initialRoute', timestamp: Date.now() });

    // Handle common deep link patterns (expand as needed for real routes)
    setTimeout(() => {
      if (route.includes('contact')) {
        setShowContactsModal(true);
        fireEvent('deep-link:contacts', { route });
        window.dispatchEvent(new CustomEvent('smartcrm:open-contacts'));
      }
      if (route.includes('deal') || route.includes('pipeline')) {
        fireEvent('deep-link:pipeline', { route });
      }
      if (route.includes('analytics')) {
        fireEvent('deep-link:analytics', { route });
      }
    }, 300);
  }, [initialRoute, fireEvent]);

  // Global event listener for contacts (used by deep links + header button)
  useEffect(() => {
    const handler = () => {
      setShowContactsModal(true);
      fireEvent('navigation', { route: '/contacts', source: 'internal' });
    };
    window.addEventListener('smartcrm:open-contacts', handler);
    return () => window.removeEventListener('smartcrm:open-contacts', handler);
  }, [fireEvent]);

  const handleLaunchContacts = () => {
    setShowContactsModal(true);
    fireEvent('navigation', { route: '/contacts' });
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-white ${
      isInitialized ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Full application header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart CRM</h1>
              <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400 font-mono tracking-widest">REMOTE</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLaunchContacts}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Contacts
              </button>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* The complete, full application (Pipeline + all features: AI, deals, analytics, gamification, modals, etc.) */}
      <Pipeline />

      {/* Contacts modal (supports deep links from initialRoute) */}
      <ContactsModal 
        isOpen={showContactsModal} 
        onClose={() => {
          setShowContactsModal(false);
          onEvent?.({ type: 'modal:closed', payload: { modal: 'contacts' } });
        }} 
      />
    </div>
  );
}

function SmartCRMAppContent({ sharedData, initialRoute, onEvent, onDataUpdate }: SmartCRMAppProps) {
  const { setTheme } = useTheme();

  // Apply theme from host sharedData globally — required behavior
  useEffect(() => {
    if (sharedData?.theme) {
      console.log('[SmartCRM Remote] Applying theme from host sharedData:', sharedData.theme);
      setTheme(sharedData.theme);
      document.documentElement.classList.toggle('dark', sharedData.theme === 'dark');
    }
  }, [sharedData?.theme, setTheme]);

  // Bootstrap diagnostics + lifecycle (fires for every host load)
  useEffect(() => {
    console.log('%c[SmartCRM Remote] Full application bootstrapped successfully via Module Federation.', 'color:#10b981; font-weight:600', {
      initialRoute: initialRoute || '(none)',
      sharedDataKeys: sharedData ? Object.keys(sharedData) : [],
      timestamp: new Date().toISOString(),
      standalone: !window.__SMARTCRM_REMOTE_MODE__
    });

    (window as any).__SMARTCRM_REMOTE_BOOTSTRAPPED__ = true;
    (window as any).__SMARTCRM_REMOTE_VERSION__ = '1.0.0-federation';

    onEvent?.({ 
      type: 'lifecycle:bootstrapped', 
      payload: { 
        hasInitialRoute: !!initialRoute, 
        route: initialRoute,
        timestamp: Date.now() 
      } 
    });

    // Optional: notify host of data readiness
    onDataUpdate?.({ status: 'ready', hasPipeline: true });
  }, []); // run once on mount

  // Always render the complete full application (no landing page for MF remotes)
  return (
    <div className="smartcrm-remote-root" data-remote="smartcrm">
      <FullAppShell onEvent={onEvent} initialRoute={initialRoute} />
    </div>
  );
}

function SmartCRMApp(props: SmartCRMAppProps) {
  React.useEffect(() => {
    setupGlobalErrorHandling();
    console.log('[SmartCRM Remote] Global error handlers initialized');
  }, []);

  // Zero side-effects on static import — everything is inside effects / render
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

export type { SmartCRMRemoteProps };
export default SmartCRMApp;
