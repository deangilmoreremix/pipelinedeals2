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
        './App': './src/App.tsx',
        './SmartCRMApp': './src/SmartCRMApp.tsx',
      },
      shared: {
        react: {
          import: 'react',
          shareKey: 'react',
          shareScope: 'default',
          singleton: true,
          requiredVersion: '^18.3.1',
        },
        'react-dom': {
          import: 'react-dom',
          shareKey: 'react-dom',
          shareScope: 'default',
          singleton: true,
          requiredVersion: '^18.3.1',
        },
        zustand: {
          import: 'zustand',
          shareKey: 'zustand',
          shareScope: 'default',
          singleton: true,
          requiredVersion: '^4.4.7',
        },
      },
    }),
    fixFederationCssForVite8(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  cssCodeSplit: false,
  target: 'esnext',
  minify: false,
  base: './',
  build: {
    cssCodeSplit: false,
    outDir: 'dist',
    assetsDir: 'assets',
  },
});