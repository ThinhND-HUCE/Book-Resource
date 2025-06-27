import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  publicDir: 'public',
  server: {
    fs: {
      allow: ['..', 'node_modules'],
    },
  },
  optimizeDeps: {
    include: ['mathjax'],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
})
  