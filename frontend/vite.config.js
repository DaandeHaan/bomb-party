import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()], // Enable Vue plugin for Vite
  server: {
    port: 3000, // Development server port
    open: true // Automatically open the browser on server start
  },
  build: {
    outDir: 'dist', // Output directory for production build
    emptyOutDir: true // Clean the output directory before building
  },
  resolve: {
    alias: {
      '@': '/src' // Shortcut to reference the `src` directory
    }
  }
});
