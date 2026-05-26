import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

const fixFederationCssForVite8 = () => ({
  name: 'fix-federation-css-for-vite8',
  enforce: 'post' as const,
  async closeBundle() {
    const fs = await import('fs');
    const distDir = path.resolve(__dirname, 'dist');
    const cssFiles = ['remoteEntry.css'];
    for (const file of cssFiles) {
      const filePath = path.join(distDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fixed = content.replace(/:root/g, ':host');
        fs.writeFileSync(filePath, fixed);
      }
    }
  },
});

export default defineConfig({
  plugins: [
    react(),
    federation({
      rollingVersion: 'vite-8',
      exposes: {
        './SmartCRMApp': './src/SmartCRMApp.tsx',
        './App': './src/App.tsx',
      },
      shared: ['react', 'react-dom', 'zustand'],
    }),
    fixFederationCssForVite8(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  cssCodeSplit: false,
  target: 'esnext',
  minify: false,
  build: {
    cssCodeSplit: false,
  },
});