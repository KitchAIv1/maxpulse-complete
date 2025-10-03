
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

export default defineConfig({
  base: '/assessment/',
  plugins: [react()],
  define: {
    // Enable Real AI for Data Collection Mission
    'import.meta.env.VITE_USE_SUPABASE': '"true"',
    'import.meta.env.VITE_AI_EDGE_FUNCTION': '"true"',
    'import.meta.env.VITE_REALTIME_TRACKING': '"true"',
    'import.meta.env.VITE_DATABASE_SUBSCRIPTIONS': '"true"',
    'import.meta.env.VITE_DEBUG_MODE': '"true"',
    'import.meta.env.VITE_MOCK_DATA': '"false"',
    // 🔒 SECURITY: Let Vite read from .env.local instead of hardcoding
    // REMOVED: 'import.meta.env.VITE_SUPABASE_URL' and 'VITE_SUPABASE_ANON_KEY'
    // These will now be read from .env.local file (which is in .gitignore)
  },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/ui': path.resolve(__dirname, './src/components/ui'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/styles': path.resolve(__dirname, './src/styles'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        'figma:asset/ce5ce6019a6fda95c3a63c46fe96e1ea1cb7f568.png': path.resolve(__dirname, './src/assets/ce5ce6019a6fda95c3a63c46fe96e1ea1cb7f568.png'),
        'figma:asset/96dcadeabe733c4dc3859640e08db5b63dd9c67c.png': path.resolve(__dirname, './src/assets/96dcadeabe733c4dc3859640e08db5b63dd9c67c.png'),
        'figma:asset/1abd4d1b99491112739630342a8feaea8d80bdbe.png': path.resolve(__dirname, './src/assets/1abd4d1b99491112739630342a8feaea8d80bdbe.png'),
        'figma:asset/14bf28e7853e7532e3e77ea0f55fd57859116566.png': path.resolve(__dirname, './src/assets/14bf28e7853e7532e3e77ea0f55fd57859116566.png'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
    },
    server: {
      port: 5174,
      open: false,
    },
  });