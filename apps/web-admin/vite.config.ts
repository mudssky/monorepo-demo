import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: parseInt(env.VITE_PORT),
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET, //开发环境
          changeOrigin: true,
          rewrite: (path) => {
            return path
          },
        },
        '/static': {
          target: env.VITE_PROXY_TARGET, //开发环境
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
  }
})
