import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mudssky/react-components': path.resolve(__dirname, './src/index.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
