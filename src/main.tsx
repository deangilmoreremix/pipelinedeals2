import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App, { SmartCRMApp } from './App.tsx'; // App for legacy full, SmartCRMApp for modern landing+props
import './index.css';
import './styles/global-dark-mode.css';

// Standalone dev mode: render the modern full root (SmartCRMApp) by default.
// This shows the rich landing page first (per requirements), unless ?full=1 or deep route.
const params = new URLSearchParams(window.location.search);
const forceFull = params.has('full') || params.has('app');
const initialRouteFromUrl = params.get('route') || params.get('initialRoute') || undefined;

const rootEl = document.getElementById('root')!;

console.log('%c[SmartCRM] Standalone bootstrap starting...', 'color:#3b82f6');

createRoot(rootEl).render(
  <StrictMode>
    {forceFull ? (
      <App />
    ) : (
      <SmartCRMApp 
        initialRoute={initialRouteFromUrl}
        sharedData={{ theme: (localStorage.getItem('theme') as any) || undefined }}
        onEvent={(e) => console.log('[SmartCRM Standalone Event]', e)}
        onDataUpdate={(d) => console.log('[SmartCRM Standalone DataUpdate]', d)}
      />
    )}
  </StrictMode>
);

// Runtime diagnostic
console.log('%c[SmartCRM] Standalone render complete. Use ?full or ?route=/pipeline to bypass landing.', 'color:#64748b');
