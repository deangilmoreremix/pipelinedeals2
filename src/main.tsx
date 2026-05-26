import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/global-dark-mode.css';

if (window.__SMARTCRM_REMOTE__) {
  console.log('[SmartCRM Remote] bootstrapped');
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

export type { SmartCRMRemoteProps } from './SmartCRMApp';
export { default as SmartCRMApp } from './SmartCRMApp';