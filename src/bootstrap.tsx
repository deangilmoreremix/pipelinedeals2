console.log('[SmartCRM Remote] bootstrap.tsx loaded');

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/global-dark-mode.css';

let root: ReturnType<typeof createRoot> | null = null;

export function mount(target: HTMLElement) {
  console.log('[SmartCRM Remote] mount() called, target:', target);

  // Ensure target has proper styling for fullscreen
  target.className = 'federation-remote-container';
  target.style.minHeight = '100vh';
  target.style.width = '100%';

  // Prevent duplicate mounts
  if (root) {
    console.log('[SmartCRM Remote] Root exists, rendering to existing root');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    return;
  }

  console.log('[SmartCRM Remote] Creating new root');
  root = createRoot(target);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

export function unmount() {
  console.log('[SmartCRM Remote] unmount() called');
  if (root) {
    root.unmount();
    root = null;
  }
}

// Check if running as a remote module (Module Federation)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;
const isRemote = typeof __webpack_init_sharer__ !== 'undefined' ||
                 !!(w).__SMARTCRM_REMOTE__ ||
                 !!(w).__FEDERATION__;

if (!isRemote) {
  console.log('[SmartCRM Remote] Standalone mode - auto-mounting to #root');
  const rootElement = document.getElementById('root');
  if (rootElement) {
    mount(rootElement);
  }
}