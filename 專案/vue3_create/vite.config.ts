import { defineConfig, loadEnv, type JsonOptions, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import svgLoader from 'vite-svg-loader'

// 如果編輯器提示 path 模塊找不到，則可以安裝一下 @types/node -> npm i @types/node -D
// import path, { resolve } from "path";
import { resolve } from 'path'

// const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
// const IS_UAT = ['uat', 'ut'].includes(process.env.NODE_ENV);

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}

// https://cn.vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 環境變數
  const env = loadEnv(mode, process.cwd())
  const IS_PROD = ['production', 'prod', 'uat'].includes(mode)

  return {
    // publicDir: env.VITE_APP_PUBLIC_PATH || false,
    build: {
      outDir: `dist/${mode}`,
      assetsDir: 'static',
      // sourcemap: !IS_PROD,
      // copyPublicDir: true,
      rollupOptions: {
        output: {
          assetFileNames: assetInfo => {
            if (assetInfo.name) {
              // 利用附檔名產生資料夾
              const info = assetInfo.name.split('.')
              let extType = info[info.length - 1]
              if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
                extType = 'media'
              } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
                extType = 'img'
              } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
                extType = 'fonts'
              }
              return `${extType}/[name]-[hash][extname]`
            }
            return ''
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
        },
      },
    },
    plugins: [
      vue(),
      Components({
        // 從 `./src/components/` 路徑查找
        // extensions: ['vue'],
        resolvers: [
          // ant design vue 按需載入
          AntDesignVueResolver({
            // 自動引入 ant-design/icons-vue 中的圖標，須先安裝 @ant-design/icons-vue
            resolveIcons: true,
            importStyle: 'less',
          }),
        ],
        include: [/\.vue$/, /\.vue\?vue/],
        exclude: [/[/]node_modules[/]/, /[/].git[/]/, /[/].nuxt[/]/],
        dts: 'src/auto-components.d.ts',
      }),
      // AutoImport({
      //   imports: ['vue', 'vue-router'],
      //   dts: 'src/auto-import.d.ts',
      // }),
      createHtmlPlugin({
        inject: {
          data: {
            ...env,
          },
        },
      }),
      svgLoader({
        defaultImport: 'component',
      }),
      splitVendorChunkPlugin(),
    ],
    resolve: {
      alias: {
        '@': pathResolve('src'),
        '@assets': pathResolve('src/assets'),
        '@style': pathResolve('src/assets/style'),
        '@img': pathResolve('src/assets/img'),
        '@components': pathResolve('src/components'),
        '@layout': pathResolve('src/components/layout'),
        '@shared': pathResolve('src/components/shared'),
        '@pages': pathResolve('src/pages'),
        '@stores': pathResolve('src/stores'),
        '@plugins': pathResolve('src/plugins'),
        '~bootstrap': pathResolve('node_modules/bootstrap'),
      },
    },
    json: {
      stringify: true, // 導入的JSON會被轉換為 export default JSON.parse(...)，當JSON文件較大的時候，性能更好
    },
    // 全域CSS
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@style/_varibles.scss";
            @import "@style/_mixin.scss";
          `,
        },
        less: {
          // lessOptions: {
          modifyVars: {
            // https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
            'border-radius-base': '4px',
            'table-header-bg': '#23C4A8',
            'table-header-color': '#FFF',
            'table-row-hover-bg': '#E6F7FF',
            'table-border-radius-base': '0px',

            // 'primary-color': '#23C4A8',
            // 'font-size-base': '16px',
            // 'text-color': '#000000',
            // 'btn-font-size': '16px',
            // 'btn-height-base': '40px',

            // 'pagination-item-bg-active': '#999999',
            // 'form-item-margin-bottom': '15px',
            // 'input-border-color': '#EBEBEB',
          },
          javascriptEnabled: true,
          // },
        },
      },
      devSourcemap: true,
    },
    // 代理服務 https://cn.vitejs.dev/config/server-options.html
    server: {
      proxy: {
        '^/api': {
          port: 8200,
          target: 'http://sdtwlvx00404:8083/iams-api',
          ws: true,
          changOrigin: true,
        },
      },
    },
  }
})
