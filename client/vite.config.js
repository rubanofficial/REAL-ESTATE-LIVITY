import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 1. Import the Tailwind CSS Vite plugin
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  // 2. Add the tailwindcss() plugin alongside react()
  plugins: [
    react(),
    tailwindcss({
      // 3. Configure Tailwind directly here (same as tailwind.config.js)
      config: {
        content: [
          "./index.html",
          "./src/**/*.{js,ts,jsx,tsx}", // Scan all relevant files in src
        ],
        theme: {
          extend: {},
        },
        plugins: [],
      }
    }),
  ],

  // 4. KEEP THE ESSENTIAL PROXY CONFIGURATION
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        secure: false,
      },
    },
  },
});

