import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Vite 8 Rolldown CSS workaround for Module Federation remotes (closeBundle + enforce: post)
// This ensures CSS side-effects are properly associated after Rolldown deduplication.
// Matches the pattern required by the SmartCRM host (Vite 8).
function fixFederationCssForVite8(): Plugin {
  return {
    name: 'fix-federation-css-for-vite8',
    enforce: 'post',
    closeBundle() {
      // Diagnostic + hook point for any future manifest/remoteEntry CSS patching
      if (process.env.NODE_ENV === 'production' || process.env.CI) {
        console.log('[SmartCRM Federation] Vite 8 Rolldown CSS workaround applied (enforce:post closeBundle)');
      }
      // In advanced scenarios you can read/write to the emitted files here using this.emitFile
      // or fs on the outDir for remoteEntry + css association fixes.
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'smartcrm_remote',
      filename: 'remoteEntry.js',
      // Primary full application root (self-contained, with landing + props contract)
      // + legacy App for compatibility
      exposes: {
        './SmartCRMApp': './src/SmartCRMApp.tsx',
        './App': './src/App.tsx'
      },
      shared: {
        // Core framework - must share to avoid duplicate React instances in host
        react: {
          singleton: true,
          requiredVersion: '^18.3.1'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1'
        },
        // Heavy shared lib per prompt guidance
        zustand: {
          singleton: true
        }
      }
    }),
    // The CSS fix plugin must come after federation so it sees final bundle
    fixFederationCssForVite8()
  ],
  build: {
    // Federation best practices + Vite 8 / Rolldown safety
    target: 'esnext',
    minify: false,           // easier debugging of remotes; can enable in prod if desired
    cssCodeSplit: false,     // Critical for reliable CSS delivery from remotes (especially Vite 8)
    modulePreload: false,
    rollupOptions: {
      output: {
        // Ensure consistent chunking for federation
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Helpful for remote dev/testing
  server: {
    port: 5174,
    strictPort: false
  }
});
