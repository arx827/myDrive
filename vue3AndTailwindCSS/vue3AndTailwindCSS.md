# Vue3 + TailwindCSS (課後筆記)

#### 切版技術再升級！一課覆蓋 TailwindCSS + Vue3｜打造後台管理頁面 UI

#### 課程連結
- [Hiskio 課程介紹](https://hiskio.com/courses/620/about) fubonco50 / fbit22
- [Github](https://github.com/ycs77lucasv/lucas-press)

#### 相關連結
- [TailwindCSS 中文文檔](https://www.tailwindcss.cn/docs)
- [TailwindCSS 英文官網](https://tailwindcss.com/)

-----

## 第1章 行前準備
### 單元 3 - Vite - 快速啟動的本地開發工具
[Vite 中文官網](https://cn.vitejs.dev/)、[Vite 英文官網](https://vitejs.dev/)、[簡報](https://lucas-hiskio-2021-tailwindcss-slide.vercel.app/vite/1) (左右鍵切換)
  #### Vite 介紹
  - 現代瀏覽器原生支援ESM
  - 原生支援 HMR (熱更新)
  - 使用 esbuild 預編譯依賴套件，和處理 TS、JSX
  - 兼容 Rollup 插件
  - 生產環境：提供基於 Rollup 的 打包工具
  - vite v2 不綁定框架，React 也能用
  ![image](./bundler.37740380.png)
  ![image](./esm.3070012d.png)

  #### Vite 插件
  - vite-plugin-pages 檔案驅動的 Vite 路由套件
  - unplugin-vue-components 自動加載 Vue 組件
  - unplugin-icons 快速使用100+套icon套件庫 & Heroicons 介紹
  Awesome Vite 列表 (其他好用plugin可在此尋找)：https://github.com/vitejs/awesome-vite

  #### 建立 Vite 專案
  ```sh
    npm init vite

    // 或

    yarn create vite
  ```
  [npm vs yarn 指令比較表](https://www.digitalocean.com/community/tutorials/nodejs-npm-yarn-cheatsheet)

### 單元 4 - 安裝 Tailwind CSS
[安裝 Tailwind CSS with Vue3 and Vite](https://tailwindcss.com/docs/guides/vite#vue)

  - #### 安裝 Tailwind CSS
    ```sh
      npm install -D tailwindcss postcss autoprefixer
    ```

  - #### 產生 Tailwind CSS、PostCSS 兩支config 檔案
    ```sh
      npx tailwindcss init -p
    ```

  - #### 修改 tailwind.config.js
    設定其編譯的匹配範圍
    ```js
      module.exports = {
        content: [
          "./index.html",
          "./src/**/*.{vue,js,ts,jsx,tsx}",
        ],
        theme: {
          extend: {},
        },
        plugins: [],
      }
    ```

  - #### 將 Tailwind 指令到 自定義CSS中
    新增CSS檔案，並加入3個預設指令。`./src/style.css`
    ```css
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    ```
    > 當出現 黃色波浪時，可安裝『 [PostCSS Language Support](https://marketplace.visualstudio.com/items?itemName=csstools.postcss) 』擴充套件
    > ![image](./tws_img1.png)


  - #### 將 自定義CSS 引入 main.js
    ```js
      import { createApp } from 'vue'
      import App from './App.vue'
      import './style.css'      // 將 自定義CSS 引入

      const app = createApp(App)
      app.mount('#app')
    ```

  - #### 在 VScode 使用 Tailwind 提示建議
    搜尋擴充套件 『 [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) 』
    > 快速 重啟VScode ( Ctrl + Shift + P，輸入 'reload Window' ) 

  - #### 若之前使用 Tailwindcss v2.x ，想升級 v3.x，可參考[此篇](https://tailwindcss.com/docs/upgrade-guide)
  
### 單元 6 - 安裝 Tailwind CSS 相關套件
  - #### 固定元素長寬比 ( [@tailwindcss/aspect-ratio](https://github.com/tailwindlabs/tailwindcss-aspect-ratio) )
    可用於 `<iframe>`，設定長寬比，也可設定斷點。
    - ##### 安裝
      ```sh
        npm i -D @tailwindcss/aspect-ratio
      ```
    - ##### 設定 `tailwind.config.js`
      先禁用 `aspectRatio` 核心插件，避免衝突。
      ```js
        // tailwind.config.js
        module.exports = {
          theme: {
            // ...
          },
          corePlugins: {
            aspectRatio: false,
          },
          plugins: [
            require('@tailwindcss/aspect-ratio'),
            // ...
          ],
        }
      ```
    - ##### 用法
      ```html
        <div class="aspect-w-16 aspect-h-9">
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      ```

  - #### Forms 統一樣式 ( [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) )
    - [Demo](https://tailwindcss-forms.vercel.app/)
    - ##### 安裝
      ```sh
        npm install -D @tailwindcss/forms
      ```
    - ##### 設定 `tailwind.config.js`
      ```js
        // tailwind.config.js
        module.exports = {
          theme: {
            // ...
          },
          plugins: [
            require('@tailwindcss/forms'),
            // ...
          ],
        }
      ```

  - #### markdown 保留樣式 ( [@tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)、[官方文件](https://tailwindcss.com/docs/typography-plugin) )
    - ##### 安裝
      ```sh
        npm install -D @tailwindcss/typography
      ```
    - ##### 設定 `tailwind.config.js`
      ```js
        // tailwind.config.js
        module.exports = {
          theme: {
            // ...
          },
          plugins: [
            require('@tailwindcss/typography'),
            // ...
          ],
        }
      ```

### 單元 7 - postcss-import - CSS檔案模組化
  在tailwind 使用 import
  - #### [官方文檔](https://tailwindcss.com/docs/using-with-preprocessors#build-time-imports)
  - ##### 安裝
    ```sh
      npm install -D postcss-import
    ```

  - ##### 設定 `postcss.config.js`
    ```js
      // postcss.config.js
      module.exports = {
        plugins: {
          'postcss-import': {},
          tailwindcss: {},
          autoprefixer: {},
        }
      }
    ```

  - ##### 將 @tailwind 改為 @import
    ```css
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    ```
    改為
    ```css
      @import 'taiwindcss/base';
      @import 'taiwindcss/components';
      @import 'taiwindcss/utilities';
    ```
  
  - ##### 欲撰寫像SCSS的巢狀結構，可安裝 `tailwindcss/nesting` 插件
    - ###### 安裝
      ```sh
        npm install -D postcss-nesting
      ```
    - ###### 設定 `postcss.config.js`
      ```js
        // postcss.config.js
        module.exports = {
          plugins: {
            'postcss-import': {},
            'tailwindcss/nesting': {},
            tailwindcss: {},
            autoprefixer: {},
          }
        }
      ```

### 單元 8 - 專案設定
  - #### 導出顏色
    - ##### 更改預設色票
      調整Tailwind color 預設指定的色票，更改別名對應的顏色
      色票對照表 => [Tailwind CSS - Customizing Colors - 顏色別名](https://tailwindcss.com/docs/customizing-colors)
      ```js
        // tailwind.config.js
        const colors = require('tailwindcss/colors')
        module.exports = {
          content: {},
          theme: {
            extend: {
              colors: {
                'gray': colors.zinc,
              }
            }
          }
        }
      ```
      > 注意：若無`extend`，會覆蓋原本定義的其他色碼，其他顏色會消失，只保留有設定的色票。

    - ##### 生成自定義顏色的 50 到 900 的色階
      [Tailwind CSS Shades Generator](https://javisperez.github.io/tailwindcolorshades/) (只支援16位元，如：#FFFFFF)
      
      - ###### 使用範例
        ```js
          module.exports = {
            theme: {
              extend: {
                colors: {
                  brown: {
                    50: '#fdf8f6',
                    100: '#f2e8e5',
                    200: '#eaddd7',
                    300: '#e0cec7',
                    400: '#d2bab0',
                    500: '#bfa094',
                    600: '#a18072',
                    700: '#977669',
                    800: '#846358',
                    900: '#43302b',
                  },
                }
              },
            },
          }
        ```

  - #### 安裝字型
    - [Google Fonts](https://fonts.google.com/)
    - [Noto Sans TC 字型](https://fonts.google.com/noto/specimen/Noto+Sans+TC)
    
    - ##### 產生套用格式
      針對要安裝的字型，並在下方的『Styles』勾選字體樣式(可多選)，
      選取後，會自動產生 html 的 `<link>` 與 `@import` 格式 與 CSS格式，
      
      `<link>` 如下：
        ```html
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        ```
      `@import`如下：
        ```html
          <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300&display=swap');
          </style>
        ```
      CSS 格式，如下：
        ```css
          font-family: 'Noto Sans TC', sans-serif;
        ```
      就可直接複製使用。
    - ##### 引入html
      直接找到 index.html 貼上即可。
      ```html
        <html>
          ...
          <head>
            ...
            <link rel="preconnect" href="https://fonts.googleapis.com">
          </head>
        </html>
      ```

    - ##### 調整 TailwindCss 字體
      字型分為 襯線字體(sans)、非襯線字體、等寬字體
      ```js
        const { fantFamily } = require('tailwindcss/defaultTheme')
        module.exports = {
            theme: {
              extend: {
                ...
                fontFamily: {
                  // 前面放要追加的字體，並將原本預設的字體保留
                  sans: ['Noto Sans TC', ...fantFamily.sans],
                }
              },
            },
          }
      ```

    - ##### 套用到 CSS
      ```css
        // styles/base
        @layer base {
          html {
            // 設定預設字型樣式
            @apply font-light;
          }
        }
      ```

  - #### vscode 支援 alias (路徑別名)
    - ##### vite.config.js
      ```js
        export default defineConfig({
          resolve: {
            alias: {
              '@': path.resolve(__dirname, 'src'),
            }
          }
        })
      ```
    - ##### jsconfig.js / tsconfig.js
      提供給 vscode 讀取的設定
      - [Using webpack aliases / jsconfig](https://code.visualstudio.com/docs/languages/jsconfig#_using-webpack-aliases)

      ```js
        {
          "compilerOptions": {
            "baseUrl": ".",
            "paths": {
              "@/*": ["./src/*"]
            }
          }
        }
      ```


### 單元 9 - vite-plugin-pages - 檔案驅動的 Vite 路由套件
  自動Router生成工具
  如：
  - 基礎：
    - `src/pages/users.vue` -> `/users`
    - `src/pages/users/profile.vue` -> `/users/profile`
    - `src/pages/settings.vue` -> `/settings`

  - 首頁：
    - `src/pages/index.vue` -> `/`
    - `src/pages/users/index.vue` -> `/users`

  - 動態路由：
    - `src/pages/users/[id].vue` -> `/users/:id (/users/one)`
    - `src/pages/[users]/settings.vue` -> `/:users/settings (/one/settings)`
  - [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)
  - ##### 安裝
    ```sh
      npm install -D vite-plugin-pages
      npm install vue-router
    ```

  - ##### 設定 vite.config.js
    ```js
      import Pages from 'vite-plugin-pages'

      export default {
        plugins: [
          // ...
          Pages(),
        ],
      }
    ```

    默認情況下，頁面是從目錄中的 `.vue` 或 `.js` 文件 導出的Vue組件 `src/pages`。
    可通過 `~pages` 導入模塊來訪問生成的路由。

  - ##### 引入 router
    ```js
      // main.js
      import { createApp } from 'vue'
      import { createRouter } from 'vue-router'
      import routes from '~pages'
      import App from './App.vue'

      const router = createRouter({
        history: createWebHistory(),
        routes,
      })

      createApp(App)
        .use(router)
        .mount('#app')
    ```
    Type
    ```ts
      // vite-env.d.ts
      /// <reference types="vite-plugin-pages/client" />
    ```
  

### 單元 10 - unplugin-vue-components - 自動加載Vue組件
  - [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)
  套件前身：`vite-plugin-components`
  - ##### 安裝
    ```sh
      npm i unplugin-vue-components -D
    ```

  - ##### 設定 vite.config.js
    ```js
      // vite.config.ts
      import Components from 'unplugin-vue-components/vite'

      export default defineConfig({
        plugins: [
          Components({ /* options */ }),
        ],
      })
    ```

  - ##### 支援UI框架
    - Ant Design Vue
    - Arco Design Vue
    - BootstrapVue
    - Element Plus
    - Element UI
    - Headless UI
    - IDux
    - Inkline
    - Ionic
    - Naive UI
    - Prime Vue
    - Quasar
    - TDesign
    - Vant
    - Varlet UI
    - VEUI
    - View UI
    - Vuetify
    - VueUse Components
    - VueUse Directives
    - Dev UI

  - ##### 設定UI框架自動按需載入
    ```js
      // vite.config.js
      import Components from 'unplugin-vue-components/vite'
      import {
        AntDesignVueResolver,
        ElementPlusResolver,
        VantResolver,
      } from 'unplugin-vue-components/resolvers'

      // your plugin installation
      Components({
        resolvers: [
          AntDesignVueResolver(),
          ElementPlusResolver(),
          VantResolver(),
        ],
      })
    ```
    也可使用function比對
    ```js
      // vite.config.js
      Components({
        resolvers: [
          // example of importing Vant
          (componentName) => {
            // where `componentName` is always CapitalCase
            if (componentName.startsWith('Van'))
              return { name: componentName.slice(3), from: 'vant' }
          },
        ],
      })
    ```
  
  - ##### 設定默認值
    ```js
      // vite.config.js
      Components({
        dirs: ['src/components'],     // 設定自動載入偵測的資料夾
        extensions: ['vue'],          // 組件的有效副檔名
        deep: true,                   // 深層搜尋
        resolvers: [],                // 自定義組件的解析器
        dts: false,                   // 生成 `components.d.ts` 全局聲明，也接受自定義文件名的路徑，默認值：如果安裝了 typescript package，則默認為 true
        directoryAsNamespace: false,  // 允許子目錄作為組件的命名空間前綴
        globalNamespaces: [],         // 忽略命名空間前綴的子目錄路徑，當 `directoryAsNamespace: true` 時有效

        // auto import for directives
        // default: `true` for Vue 3, `false` for Vue 2
        // Babel is needed to do the transformation for Vue 2, it's disabled by default for performance concerns.
        // To install Babel, run: `npm install -D @babel/parser`
        directives: true,             // 自動導入指令，Vue3 預設為 true，Vue2 預設為 false，需要 Babel 來為 Vue2 進行轉換，出於性能考慮，默認情況下禁用，Babel安裝：`npm i -D @babel/parser`
        importPathTransform: v => v,    // 解析前變換路徑
        allowOverrides: false,          // 允許組件覆蓋同名的其他組件

        // 轉換編譯目標的過濾器
        include: [/\.vue$/, /\.vue\?vue/],    
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],

        version: 2.7                    // 項目 Vue版本，如未指定，它會自動檢測
      })
    ```

### 單元 11 - unplugin-icons - 快速使用 100+ 套icon套件庫 & Heroicons介紹
  - [unplugin-icons](https://github.com/antfu/unplugin-icons) 以 iconify 為基礎，做打包整合
  - [iconify (整合100+ icon)](https://github.com/iconify/iconify)
  - [Icônes (icon 100+ 列表)](https://icones.js.org/)
  - ##### 安裝 unplugin-icons
    ```sh
      npm i -D unplugin-icons
    ```
  - ##### 安裝 iconify 資料庫
    ```sh
      npm i -D @iconify/json
    ```

  - ##### 設定 vite.config.js
    ```js
      // vite.config.ts
      import Icons from 'unplugin-icons/vite'

      export default defineConfig({
        plugins: [
          Icons({ /* options */ }),
        ],
      })
    ```

  - ##### 使用 unplugin-icons
    - icon 範例
      - [HeroIcons Outline Icônes](https://icones.js.org/collection/heroicons-outline)
      - [Heroicons 官網](https://heroicons.com/)

    - 先到 [iconify](https://github.com/iconify/iconify) 找到相應icon
    - 複製icon名稱
    - 引入頁面 (以 `heroicons-outline:home` 為例)
      引入時將`:`改為`/`
      ```html
        <script>
          import IconHome from '~icons/heroicons-outline:/home'
        </script>

        <template>
          <IconHome />
        </template>
      ```
  
  - ##### 自動引入
    ```js
      // vite.config.ts
      import IconsResolver from 'unplugin-icons/resolver'

      export default defineConfig({
        plugins: [
          Components({
            resolvers: [
              IconsResolver()
            ]
          })
        ],
      })
    ```

    - 自動引入範例，以 `heroicons-outline:home` 為例
      ```html
        <template>
          <IHeroiconsOutlineHome />
        </template>
      ```

    - 改變自動引入前綴
      ```js
        // vite.config.ts
        IconsResolver({
          prefix: 'icon',
        })
      ```

    - 移除前綴
      ```js
        IconsResolver({
          prefix: false,
          enabledCollections: ['heroicons-outline'],  // 須自動引入的UI
        })
      ```

### 單元 12 - Headless UI - 適用於 Tailwind CSS 的 無樣式組件庫
  - [Headless UI](https://headlessui.com/)
  - #### 安裝
    ```sh
      npm i @headlessui/vue
    ```

### 單元 13 - Tailwind UI - Tailwind CSS 官方的組件懶人包
  - [Tailwind UI](https://tailwindui.com/)

### 單元 14 - VueUse - Vue Composition API 的 功能大寶箱
  - [VueUse](https://vueuse.org/)
  - #### 安裝
    ```sh
      npm i @vueuse/core
    ```
-----

