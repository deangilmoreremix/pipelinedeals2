console.log('[SmartCRM Remote] main.tsx loading');

// Async bootstrap pattern for Module Federation compatibility
// This ensures the app can be loaded as a remote without auto-mounting
const bootstrap = () => import('./bootstrap');

// Check if running as a remote module (Module Federation)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w: Record<string, unknown> = window as any;
const isRemote: boolean = typeof __webpack_init_sharer__ !== 'undefined' ||
                          !!(w).__SMARTCRM_REMOTE__ ||
                          !!(w).__FEDERATION__;

console.log('[SmartCRM Remote] isRemote:', isRemote);

// Initialize in standalone mode, defer in remote mode
if (!isRemote) {
  console.log('[SmartCRM Remote] Running in standalone mode - auto-mounting');
  bootstrap().then(({ mount }) => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      mount(rootElement);
    }
  });
} else {
  console.log('[SmartCRM Remote] Running in Module Federation mode - ready for host mounting');
}

// Re-export for Module Federation host consumption
export { mount, unmount } from './bootstrap';
export type { SmartCRMRemoteProps } from './SmartCRMApp';
export { SmartCRMApp } from './SmartCRMApp';
export { default as App } from './App';