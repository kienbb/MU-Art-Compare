import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/MU-Art-Compare/', // IMPORTANT: Change to your GitHub repository name
  build: {
    outDir: 'docs' // Output directory for build files (changed from 'dist' to 'docs')
  },
  server: {
    open: true // Automatically open the app in the browser on dev start
  },
  // Ensure assets from 'public' are copied
  publicDir: 'public'
}); 