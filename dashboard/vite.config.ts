
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

export default defineConfig({
  base: '/dashboard/',
  plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/ui': path.resolve(__dirname, './src/components/ui'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/styles': path.resolve(__dirname, './src/styles'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        'figma:asset/ef1d11c2648582b1848365ba6b9ea4e83af21994.png': path.resolve(__dirname, './src/assets/ef1d11c2648582b1848365ba6b9ea4e83af21994.png'),
        'figma:asset/b8f0486b85e63e46a398309656e7e70a0ff0418f.png': path.resolve(__dirname, './src/assets/b8f0486b85e63e46a398309656e7e70a0ff0418f.png'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/assessment': {
          target: 'http://localhost:5174',
          changeOrigin: true,
          secure: false
        }
      }
    },
  });