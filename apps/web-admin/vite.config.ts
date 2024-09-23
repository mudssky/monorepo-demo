import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import tsChecker from 'vite-plugin-checker'
// import { visualizer } from 'rollup-plugin-visualizer'

// 分包策略，1.把node_modules中的内容单独打包
export const vendorRollupOption = {
  output: {
    chunkFileNames: 'js/[name]-[hash].js', // 产生的 chunk 自定义命名
    entryFileNames: 'js/[name]-[hash].js', // 指定 chunks 的入口文件匹配模式
    assetFileNames: '[ext]/[name]-[hash].[ext]', // 自定义构建结果中的静态资源名称，资源文件像 字体，图片等
    manualChunks(id) {
      if (id.includes('node_modules')) {
        return 'vendor'
      }
    },
  },
}

// 2.手动分包
export const manualRollupOption = {
  output: {
    manualChunks: {
      vender1: ['react-dom'],
      vender2: ['antd'],
    },
  },
}
// 3.可以用dynamic import，比如在路由上可以用

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') as ImportMetaEnv

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@server/*': path.resolve(__dirname, '。。/server/*'),
      },
    },
    server: {
      port: parseInt(env.VITE_PORT ?? '21101'),
      proxy: {
        [env.VITE_REQUEST_BASE_URL]: {
          target: env.VITE_PROXY_TARGET, //开发环境
          changeOrigin: true,
          rewrite: (path: string) => {
            // console.log({ path })
            // 移除前缀
            // return path.replace(/^\/api/, '')
            return path.replace(new RegExp(`^${env.VITE_REQUEST_BASE_URL}`), '')
          },
        },
        '/static': {
          target: env.VITE_PROXY_TARGET, //开发环境
          changeOrigin: true,
        },
        // socket.io 转发配置
        // ws://localhost:5173/socket.io -> http://env.VITE_WS_TARGET/socket.io
        '/socket.io': {
          target: env.VITE_WS_TARGET,
          ws: true,
          // rewriteWsOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        ...vendorRollupOption,
      },
    },
    plugins: [
      react(),
      tsChecker({
        typescript: true,
        eslint: {
          lintCommand:
            'eslint "./src/**/*.{ts,tsx} --report-unused-disable-directives --max-warnings 0',
        },
      }),
      // visualizer({
      //   open: true, //在默认用户代理中打开生成的文件
      //   gzipSize: true, // 收集 gzip 大小并将其显示
      //   brotliSize: true, // 收集 brotli 大小并将其显示
      //   filename: 'stats.html', // 分析图生成的文件名
      // }),
    ],
  }
})
