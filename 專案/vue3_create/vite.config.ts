import { defineConfig, loadEnv, type JsonOptions, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import svgLoader from 'vite-svg-loader'
import filterReplace from 'vite-plugin-filter-replace';

interface stringReplaceType {
  options: {
    search: string,
    replace: string
  }[]
}

const stringReplace: stringReplaceType = require('./src/plugins/filterReplace/stringReplace.json');

import { resolve } from 'path'

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}

// https://cn.vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 環境變數
  const env = loadEnv(mode, process.cwd())
  const IS_PROD = ['production', 'prod', 'uat'].includes(mode)

  return {
    base: env.VITE_BASE_URL ? env.VITE_BASE_URL : '/',
    build: {
      outDir: `dist`,
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
      filterReplace([
        {
          filter: /\.js$/,
          replace : [
            // 套用 stringReplace.json 裡面的 替換列表
            ...stringReplace.options.map((i) => ({
              from: new RegExp(i.search, 'ig'),
              to: i.replace,
            })),

            // ----- 若想使用 全局替代的話 可以改用以下語法 ------ //
            // 針對 版本號 替換
            // {
            //   from: /(\w+)@((\d\.)+\d)/ig,
            //   to: '$1_$2',
            // },
            // // 針對 Email 替換
            // {
            //   from: /(\w+)@(([\da-z.-]+)\.com)/ig,
            //   to: '$1_$2',
            // },
          ]
        }
      ]),
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
          modifyVars: {
            // https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
            'border-radius-base': '4px',
            'table-header-bg': '#23C4A8',
            'table-header-color': '#FFF',
            'table-row-hover-bg': '#E6F7FF',
            'table-border-radius-base': '0px',

            // menu
            'menu-dark-bg': '#30ACB3',
            'menu-dark-submenu-bg': '#02829B',
            'menu-dark-inline-submenu-bg': 'transparent',
            'menu-dark-item-active-bg': '#02829B',

            // table
            'table-header-sort-bg': '#02829B',
            'table-body-selected-sort-bg': '#02829B',
            'table-header-bg-sm': '#23C4A8',
          },
          javascriptEnabled: true,
        },
      },
      devSourcemap: true,
    },
    // 代理服務設定 https://cn.vitejs.dev/config/server-options.html
    server: {
      proxy: {
        '^/api': {
          port: 8200,
          target: env.VITE_APP_API_BASE_URL,
          ws: true,
          changOrigin: true,
        },
      },
    },
  }
})
