import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const wmPoiId = 19556633
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css:{
    //* css模块化
    modules: { // css模块化 文件以.module.[css|less|scss]结尾
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      hashPrefix: 'prefix',
    },
    //* 预编译支持less
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      "components": path.resolve(__dirname, "src/components"),
      "pages": path.resolve(__dirname, "src/pages"),
      "api": path.resolve(__dirname, "src/api"),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      '/api': {
        changeOrigin: true,
        target: `https://yiyao.meituan.com`,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          Origin: 'https://yiyao.meituan.com',
          Referer: 'https://yiyao.meituan.com',
        }
      },
    }
  }
})
