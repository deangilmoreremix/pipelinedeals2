import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { GamificationProvider } from './contexts/GamificationContext';
import Pipeline from './components/Pipeline';
import { DarkModeToggle } from './components/ui/DarkModeToggle';
import { useKeyboardShortcuts, globalShortcuts } from './hooks/useKeyboardShortcuts';
import ErrorBoundary from './components/ErrorBoundary';
import { setupGlobalErrorHandling } from './utils/errorHandling';
import LandingPage from './components/landing/LandingPage';
import { ContactsModal } from './components/contacts/ContactsModal';

// Exact props contract as required
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

function FullAppShell({ onEvent }: { onEvent?: SmartCRMRemoteProps['onEvent'] }) {
  useKeyboardShortcuts(globalShortcuts);
  const { isInitialized } = useTheme();
  const [showContactsModal, setShowContactsModal] = useState(false);

  // Fire navigation events for host consumption
  const fireNavEvent = useCallback((route: string) => {
    onEvent?.({ type: 'navigation', payload: { route, timestamp: Date.now() } });
    console.log('[SmartCRM Remote] Navigation event fired:', route);
  }, [onEvent]);

  // Example: open contacts via global (for deep links in this shell)
  React.useEffect(() => {
    const handler = () => {
      setShowContactsModal(true);
      fireNavEvent('/contacts');
    };
    window.addEventListener('smartcrm:open-contacts', handler);
    return () => window.removeEventListener('smartcrm:open-contacts', handler);
  }, [fireNavEvent]);

  const handleLaunchContacts = () => {
    setShowContactsModal(true);
    fireNavEvent('/contacts');
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-white ${
      isInitialized ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Header - full shell */}
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

      {/* Full functional Pipeline - all features, AI, drag drop, modals, etc. */}
      <Pipeline />

      {/* Global modals controlled at shell for demo deep links */}
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
  const [mode, setMode] = useState<'landing' | 'full-app'>('landing');
  const [hasBootstrapped, setHasBootstrapped] = useState(false);

  const { setTheme, isDarkMode } = useTheme();

  // Apply theme from host sharedData globally - critical requirement
  useEffect(() => {
    if (sharedData?.theme) {
      console.log('[SmartCRM Remote] Applying theme from host sharedData:', sharedData.theme);
      setTheme(sharedData.theme);
      // Also force on document for immediate effect outside provider
      document.documentElement.classList.toggle('dark', sharedData.theme === 'dark');
    }
  }, [sharedData?.theme, setTheme]);

  // Determine if we should bypass landing (non-negotiable default behavior)
  const shouldBypassLanding = React.useMemo(() => {
    if (!initialRoute) return false;
    const r = initialRoute.toLowerCase().trim();
    if (r === '' || r === '/' || r === '/landing' || r === '/home' || r === '#') return false;
    return true;
  }, [initialRoute]);

  // Bootstrap + initialRoute handling + diagnostics
  useEffect(() => {
    if (hasBootstrapped) return;

    console.log('%c[SmartCRM Remote] Full application bootstrapped successfully via Module Federation.', 'color:#10b981; font-weight:600', {
      initialRoute: initialRoute || '(none - showing landing)',
      sharedDataKeys: sharedData ? Object.keys(sharedData) : [],
      timestamp: new Date().toISOString(),
      standalone: !window.__SMARTCRM_REMOTE_MODE__
    });

    // Mark as remote loaded for host detection
    (window as any).__SMARTCRM_REMOTE_BOOTSTRAPPED__ = true;
    (window as any).__SMARTCRM_REMOTE_VERSION__ = '1.0.0-federation';

    setHasBootstrapped(true);

    onEvent?.({ 
      type: 'lifecycle:bootstrapped', 
      payload: { 
        hasInitialRoute: !!initialRoute, 
        route: initialRoute,
        timestamp: Date.now() 
      } 
    });

    // Drive internal navigation from initialRoute
    if (shouldBypassLanding) {
      setMode('full-app');
      onEvent?.({ type: 'navigation', payload: { route: initialRoute, source: 'initialRoute', timestamp: Date.now() } });
      console.log('[SmartCRM Remote] Bypassed landing due to initialRoute:', initialRoute);

      // Simulate deep link actions inside full app (e.g. open specific views)
      const routeLower = initialRoute!.toLowerCase();
      setTimeout(() => {
        if (routeLower.includes('contact')) {
          window.dispatchEvent(new CustomEvent('smartcrm:open-contacts'));
          onEvent?.({ type: 'deep-link:contacts', payload: { route: initialRoute } });
        }
        if (routeLower.includes('deal') || routeLower.includes('pipeline')) {
          onEvent?.({ type: 'deep-link:pipeline', payload: { route: initialRoute } });
          // Pipeline is already the main view - could enhance selected deal here in future
        }
        if (routeLower.includes('analytics')) {
          onEvent?.({ type: 'deep-link:analytics', payload: { route: initialRoute } });
        }
      }, 450);
    } else {
      // Default rich landing behavior
      setMode('landing');
      console.log('[SmartCRM Remote] Showing rich Landing / Overview page (default behavior)');
    }
  }, [initialRoute, shouldBypassLanding, onEvent, sharedData, hasBootstrapped]);

  const handleLaunch = useCallback(() => {
    setMode('full-app');
    onEvent?.({ type: 'action:launch-full-app', payload: { from: 'landing', timestamp: Date.now() } });
    console.log('[SmartCRM Remote] User launched full application from landing page');
    onDataUpdate?.({ event: 'app-launched', mode: 'full' });
  }, [onEvent, onDataUpdate]);

  const handleNavigate = useCallback((route: string) => {
    onEvent?.({ type: 'navigation', payload: { route, source: 'landing-feature', timestamp: Date.now() } });
    // For demo: map some routes to direct full app sections
    if (route.includes('contact')) {
      setMode('full-app');
      setTimeout(() => window.dispatchEvent(new CustomEvent('smartcrm:open-contacts')), 120);
    } else {
      setMode('full-app');
    }
    console.log('[SmartCRM Remote] Navigated from landing to:', route);
  }, [onEvent]);

  // Fire generic action events from shell (example)
  const fireAction = (type: string, payload?: any) => {
    onEvent?.({ type, payload });
  };

  return (
    <div className="smartcrm-remote-root" data-remote="smartcrm" data-mode={mode}>
      {mode === 'landing' ? (
        <LandingPage 
          onLaunch={handleLaunch} 
          onNavigate={handleNavigate}
          theme={sharedData?.theme || (isDarkMode ? 'dark' : 'light')}
          userName={sharedData?.user?.name || sharedData?.user?.fullName}
        />
      ) : (
        <FullAppShell onEvent={onEvent} />
      )}
    </div>
  );
}

function SmartCRMApp(props: SmartCRMAppProps) {
  // Set up global error handling - runs only on mount of root
  React.useEffect(() => {
    setupGlobalErrorHandling();
    console.log('[SmartCRM Remote] Global error handlers initialized');
  }, []);

  // IMPORTANT: zero side effects on import - only inside render/effects
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

// Also export the props interface for hosts
export type { SmartCRMRemoteProps };

// Default export for convenience + named for federation clarity
export default SmartCRMApp;
