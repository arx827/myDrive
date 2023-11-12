// import { fileURLToPath, URL } from "url";

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// 如果編輯器提示 path 模塊找不到，則可以安裝一下 @types/node -> npm i @types/node -D
import path, { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n'],
      dts: 'src/auto-imports.js',
    }),
    Components({
      // 從 `./src/components/` 路徑查找
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/auto-components.js',
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      symbolId: '[dir]/[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': pathResolve('src'),
      '@assets': pathResolve('src/assets'),
      '@images': pathResolve('src/assets/images'),
      '@components': pathResolve('src/components'),
      '@layout': pathResolve('src/components/layout'),
      '@pages': pathResolve('src/pages'),
      '@style': pathResolve('src/style'),
    },
  },
  // 全局CSS
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/style/import/_varibles.scss";
          @import "@/style/import/_mixin.scss";
        `
      },
    },
    devSourcemap: true,
  },
  json: {
    stringify: true, // 導入的JSON會被轉換為 export default JSON.parse(...)，當JSON文件較大的時候，性能更好
  },
  // 代理服務
  server: {
    port: 9002,
    proxy: {
      '/api': {
        target: '',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // outDir: '/dist',
    rollupOptions: {
      output: {
        // 最小化拆分包
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        // 用於從入口點創建的塊的打包輸出格式[name]表示文件名,[hash]表示該文件內容hash值
        entryFileNames: 'js/[name].[hash].js',
        // 用於命名代碼拆分時創建的共享塊的輸出命名
        chunkFileNames: 'js/[name].[hash].js',
        // 用於輸出靜態資源的命名，[ext]表示文件擴展名
        assetFileNames: '[ext]/[name].[hash].[ext]',
        // 拆分js到模塊文件夾
        // chunkFileNames: (chunkInfo) => {
        //     const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
        //     const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
        //     return `js/${fileName}/[name].[hash].js`;
        // },
      },
    },
  },
});
