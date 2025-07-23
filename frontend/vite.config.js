// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// Plugin to ensure SPA routing works on static hosts
const createRedirectsPlugin = () => {
  return {
    name: 'create-redirects',
    writeBundle() {
      const redirectsContent = '/* /index.html 200\n';
      try {
        writeFileSync(resolve('dist/_redirects'), redirectsContent);
        console.log('✅ Created _redirects file for SPA routing');
      } catch (error) {
        console.warn('⚠️ Could not create _redirects file:', error.message);
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createRedirectsPlugin()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  publicDir: 'public',
  preview: {
    port: 4173,
    strictPort: true,
  }
});
