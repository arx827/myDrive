# Vue3生成器_筆記 vue3_1104_create

## 創建 vite
  ```sh
    npm init vue@latest
  ```
  這一指令將會安裝並執行`create-vue`，它是 `Vue` 官方的項目腳手架工具。
  將會看到一些諸如 TypeScript 和測試支持之類的可選功能提示：


  ✔ Project name: … <your-project-name>
  ✔ Add TypeScript? … No / **`Yes`**
  ✔ Add JSX Support? … **`No`** / Yes
  ✔ Add Vue Router for Single Page Application development? … No / **`Yes`**
  ✔ Add Pinia for state management? … No / **`Yes`**
  ✔ Add Vitest for Unit testing? … **`No`** / Yes
  ✔ Add Cypress for both Unit and End-to-End testing? … **`No`** / Yes
  ✔ Add ESLint for code quality? … No / **`Yes`**
  ✔ Add Prettier for code formatting? … No / **`Yes`**

  Scaffolding project in ./<your-project-name>...
  Done.

## 環境建置
  - ### vscode
    - #### .vscode 設定檔
      放置專案根目錄中 (專案帶著走)，資料夾名稱：`.vscode`，底下新增兩個檔案：
      - ##### settings.json
        ```json
          {
            "editor.detectIndentation": true,
            "editor.tabSize": 2,
            "editor.codeActionsOnSave": {
              "source.fixAll": true,
              "source.fixAll.eslint": true, // 存檔自動解決lint問題
              "source.fixAll.stylelint": true,
            },
            // eslint 支援 vue
            "eslint.validate": [
              "vue",
              "vue-html",
              "javascript",
              "javascriptreact",
              "typescript",
              "typescriptreact",
              // "sass",
              // "scss",
            ],
            // "stylelint.validate": [
            //   "css",
            //   "less",
            //   "postcss",
            //   "sass",
            //   "scss",
            //   "vue",
            // ],
            "eslint.alwaysShowStatus": true,
            "eslint.options": {
              "extensions": [
                ".html",
                ".js",
                ".ts",
                ".vue"
              ]
            },
            "eslint.enable": true,

            "[html]": {
              "editor.defaultFormatter": "HookyQR.beautify"
            },
            "[javascript]": {
              "editor.defaultFormatter": "vscode.typescript-language-features"
            },
            "[json]": {
              "editor.defaultFormatter": "vscode.json-language-features"
            },
            //"[vue]": {
              //"editor.defaultFormatter": "Vue.volar"
            //},
            "workbench.iconTheme": "material-icon-theme",
            "vue3snippets.enable-compile-vue-file-on-did-save-code": false,
            // "files.autoSave": "onFocusChange",
            // "files.autoSave": "afterDelay",
            "files.autoSave": "off",
            "files.eol": "\n",

            /*
            * Emmet
            */
            "emmet.triggerExpansionOnTab": true,    // 按下tab即可展開emmet縮寫
            "emmet.includeLanguages": {             // 在預設未支援的語言中啟用emmet縮寫
              "vue-html": "html sass",
              "vue": "html sass"
            },
            "emmet.syntaxProfiles": {               // 為指定的語法定義設定檔，或透過特定規則使用自己的設定檔
              "vue": "sass"
            },

            /* 須安裝 TODO Highlight 套件
            * 下載路徑：https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight
            * 檢視所有TODO方法：快捷『F1』，輸入『TODOs』，聚焦於TODOs檢視
            */
            "todohighlight.keywords": [
              "DEBUG:",
              "REVIEW:",
              "NOTE:",
              {
                  "text": "TEST:",
                  "backgroundColor": "#BBFF92",
                  "overviewRulerColor": "#333"
              },
              {
                  "text": "API:",
                  "color": "#000",
              },
              {
                  "text": "HACK:",
                  "color": "#000",
                  "isWholeLine": false,
              }
            ],
            /*
            * 須安裝 NPM-Script 套件
            * 下載路徑：https://marketplace.visualstudio.com/items?itemName=traBpUkciP.vscode-npm-scripts
            * 安裝完畢須重啟VScode
            */
            "npm.scriptExplorerAction": "run",
            "npm.packageManager": "npm"
          }
        ```
      - ##### extensions.json
        設定 專案 擴充套件
        ```json
          {
            "recommendations": [
              "Vue.volar",
              "Vue.vscode-typescript-vue-plugin",
              "esbenp.prettier-vscode",
              "dbaeumer.vscode-eslint",
              "stylelint.vscode-stylelint",
              "coenraads.bracket-pair-colorizer-2",
              "oderwat.indent-rainbow",
              "formulahendry.auto-close-tag",    
              "formulahendry.auto-rename-tag",
              "eamodio.gitlens",
              "ritwickdey.livese",
              "trabpukcip.vscode-npm-scripts",
              "simonsiefke.svg-preview",
              "wayou.vscode-todo-highlight",
              "gruntfuggly.todo-tree",
              "redhat.vscode-yaml",
              "wix.vscode-import-cost",
              "sdras.vue-vscode-snippets"    // Vue Emmet
            ]
          }
        ```
        
      
  - ### vite.config
    [vite config 中文說明](https://vitejs.bootcss.com/config/#environment-variables)
    [vite config 官方中文說明](https://cn.vitejs.dev/config/)
    
    
    #### 更改 index.html Title
    - ##### 安裝 [vite-plugin-html](https://www.npmjs.com/package/vite-plugin-html)
      ```sh
        npm install vite-plugin-html -D
      ```
    - #### 調整 vite.config.js
      ```js
        import { defineConfig, loadEnv } from 'vite';
        import vue from '@vitejs/plugin-vue';
        import { createHtmlPlugin } from "vite-plugin-html";
        export default defineConfig(({mode}) => {
          // 環境變數
          const env = loadEnv(mode, "env");
          return {
            ...
            plugins: [
              ...
              createHtmlPlugin({
                inject: {
                  data: {
                    ...env
                  },
                },
              }),
            ]
          }
        })
      ```
    - #### 設定環境變數
      ```js
        // .env
        VITE_APP_TITLE = Vue3 web
      ```
      ```js
        // .env.dev
        VITE_APP_SUBTITLE = DEV
      ```
      ```js
        // .env.production (production不能省)
        VITE_APP_SUBTITLE = DEV
      ```
    - #### 使用環境變數
      使用`.env`內設定的變數
      ```html
        <!-- index.html -->
        <title><%- VITE_APP_TITLE %><%- VITE_APP_SUBTITLE ? ' (' + VITE_APP_SUBTITLE + ')' : '' %></title>
      ```
    - #### 參考資源
      - ##### [vue3 vite 系統標題 系統名稱統一配置](https://www.gushiciku.cn/pl/aBBx/zh-tw)
      - ##### [npm vite-plugin-html-env](https://www.npmjs.com/package/vite-plugin-html-env)
      - ##### [vue3加vite 添加环境变量](https://blog.csdn.net/weixin_43983711/article/details/123258019)

    #### 路徑別名
    - #### 調整 vite.config.js
      ```js
        import { resolve } from 'path';
        function pathResolve(dir: string) {
          return resolve(__dirname, '.', dir);
        }
        export default defineConfig(({mode}) => {
          ...
          return {
            ...
            resolve: {
              alias: {
                '@': pathResolve('src'),
                '@assets': pathResolve('src/assets'),
                '@scss': pathResolve('src/assets/scss'),
                '@images': pathResolve('src/assets/images'),
                '@components': pathResolve('src/components'),
                '@layout': pathResolve('src/components/layout'),
                '@pages': pathResolve('src/pages'),
              },
            },
          }
        })
      ```

    #### 環境判斷
    - #### 調整 vite.config.js
      ```js
        export default defineConfig(({ mode }) => {
          const IS_PROD = ['production', 'prod'].includes(mode);
          ...
        });
      ```

    #### 全域SCSS
    - #### 調整 vite.config.js
      ```js
        export default defineConfig(({mode}) => {
          ...
          return {
            ...
            // 全域CSS
            css: {
              preprocessorOptions: {
                scss: {
                  additionalData: `@import "@/style/import/_varibles.scss"; @import "@/style/import/_mixin.scss";`,
                },
              },
              devSourcemap: IS_PROD,
            },
          }
        })
      ```

    #### 本地端 Server
      API 路徑配置，配合.env檔使用
      ```js
        export default defineConfig(({mode}) => {
          ...
          return {
            ...
            // 代理服務
            server: {
              port: 9002,
              proxy: {
                '/api': {
                  // API 路徑，配合.env檔使用
                  target: '',
                  rewrite: path => path.replace(/^\/api/, ''),
                },
              },
            },
          }
        })
      ```

  - ### tsconfig
    - #### tsconfig.json
      vite 3.1.8 自動生成，目前無須調整
      只需增加 paths 別名
      ```json
        {
          "extends": "@vue/tsconfig/tsconfig.web.json",
          "include": [
            "env.d.ts",
            "src/**/*",
            "src/**/*.vue"
          ],
          "compilerOptions": {
            "target": "esnext",
            "baseUrl": ".",
            "paths": {
              "@/*": ["./src/*"],
              "@assets/*": ["./src/assets/*"],
              "@images/*": ["./src/assets/images/*"],
              "@components/*": ["./src/components/*"],
              "@layout/*": ["./src/components/layout/*"],
              "@pages/*": ["./src/pages/*"],
              "@style/*": ["./src/style/*"],
            }
          },
          "references": [
            {
              "path": "./tsconfig.config.json"
            }
          ]
        }
      ```

    - #### tsconfig.config.json
      vite 3.1.8 自動生成，目前無須調整
      ```json
        {
          "extends": "@vue/tsconfig/tsconfig.node.json",
          "include": ["vite.config.*", "vitest.config.*", "cypress.config.*", "playwright.config.*"],
          "compilerOptions": {
            "composite": true,
            "types": ["node"]
          },
        }
      ```
  
  - ### Vue檔案型態定義
    若出現 ts error： `找不到.vue, 或其對應的型別宣告`，
    - #### 新增以下兩支檔案，放至 `/src` 中：
    ```ts
      // shims-tsx.d.ts
      import Vue, { VNode } from 'vue';

      declare global {
        namespace JSX {
          // tslint:disable no-empty-interface
          interface Element extends VNode {}
          // tslint:disable no-empty-interface
          interface ElementClass extends Vue {}
          interface IntrinsicElements {
            [elem: string]: any;
          }
        }
      }
    ```
    [參考](https://kalacloud.com/blog/vue3-typescript-axios/)
    ```ts
      // shims-vue.d.ts
      import VueRouter, { Route } from 'vue-router'

      /* eslint-disable */
      declare module '*.vue' {
        import type { DefineComponent } from 'vue'
        const component: DefineComponent<{}, {}, any>
        export default component
      }

      declare module 'vue/types/vue' {
        interface Vue {
          $router: VueRouter
        }
      }
    ```

    - #### 調整 tsconfig.config.json，將檔案加進 tsconfig 中
      ```json
        {
          ...
          "files": [
            "src/shims-vue.d.ts",
            "src/shims-tsx.d.ts"
          ]
        }
      ```

  - ### plugin
    - #### components 自動載入工具 `unplugin-vue-components`
      - ##### [Github](https://github.com/antfu/unplugin-vue-components)
      - ##### 安裝
        ```sh
          npm i unplugin-vue-components -D
        ```

      - ##### 設定
        [Github README.md](https://github.com/antfu/unplugin-vue-components) 下方有定義多種UI Libraries 自動載入

        後面 ant design vue css 篇 會再講解 引入方式
        ```ts
          // vite.config.ts
          import Components from 'unplugin-vue-components/vite'

          export default defineConfig({
            plugins: [
              Components({
                // 從 `./src/components/` 路徑查找
                extensions: ['vue'],
                include: [/\.vue$/, /\.vue\?vue/],
                dts: 'src/auto-components.js',
              }),
            ],
          })
        ```
      
      - ##### 排除eslint名單
        在根目錄新增檔案『`.eslintignore`』
        ```sh
          # unplugin-vue-components 自動產生的檔案
          src/auto-components.ts
        ```

    - #### vite SVG 加載器
      將 SVG文件加載為Vue組件
      - ##### 安裝
        [vite-svg-loader](https://www.npmjs.com/package/vite-svg-loader)
        ```sh
          npm i vite-svg-loader -S
        ```
      - ##### 設定 vite.config.js
        ```js
          import svgLoader from 'vite-svg-loader'

          export default defineConfig({
            plugins: [
              vue(),
              svgLoader()
            ]
          })
        ```



  - ### Router 基礎建置 (含登入者 Token 卡控)
    - ##### 404 notFound 改寫為 catchAll(.*)
      使其不會因為指定未識別路徑，而報錯
      ```ts
        import { createRouter, createWebHistory } from 'vue-router';
        import type { RouteRecordRaw } from 'vue-router';

        import LoginPage from '@pages/LoginPage.vue';
        import HomeView from '@pages/HomeView.vue';
        import NotFound from '@pages/NotFound.vue';

        const routes: Array<RouteRecordRaw> = [
          { path: '/login', name: 'Login', component: LoginPage },
          {
            path: '/',
            name: 'home',
            component: HomeView,
            children: [],
            beforeEnter(to, from, next) {
              if (!LoginModule.hasValidToken) {
                // message.warn('尚未登入');
                next({ name: 'Login' });
              } else {
                next();
              }
            },
          },
          // 無法識別的path => 匹配 notFound
          { path: '/:catchAll(.*)', component: NotFound },
        ];

        const router = createRouter({
          history: createWebHistory(import.meta.env.BASE_URL),
          routes,
        });

        export default router;

      ```

  - ### 關於css樣式
    - #### 安裝 SCSS
      ```sh
        npm i -D sass
      ```
    - #### 全域引入方式
      - ##### 方法一：在 App.vue 中引入
        ```html
          <!-- main.ts -->
          <style lang="scss" scoped>
            @import './assets/scss/main.scss';
          </style>
        ```
        或
        ```html
          <style lang="scss" scoped src="./assets/scss/main.scss"></style>
        ```

      - ##### 方法二：透過script匯入 (在main.js import)
        ```js
          import '@/assets/scss/main.scss';
        ```

      - ##### 方法三：引入vite.config.js
        使用 vite.config 達成全域引入，會傳遞共享的全域變數給所有的Component，
        > 因所有Component都會引入，建議只放 變數參數。
        ```js
          module.exports = {
            css: {
              preprocessorOptions: {
                sass: {
                  additionalData: `@import "@/assets/scss/main.scss";`
                }
              }
            }
          };
        ```
    - #### 個別引入方式
      - ##### 引入於個別 Component
        記得加上 `scoped`
        ```html
          <!-- comp.ts -->
          <style scoped lang="scss">
            @import "../assets/scss/comp.scss"
            h3 {
              margin: 40px 0 0;
              color: $mainColor;
            }
          </style>
        ```

    - #### bootstrap 自定義樣式配置
      - ##### 安裝
        ```sh
          npm i -S bootstrap@5.2.2 @popperjs/core@2.11.6
        ```

      - ##### 引入預設function
        - ###### _bsCustom.scss
          ./src/assets/scss/vendors/_bsCustom.scss
          <pre>
          // 1. Include functions first (so you can manipulate colors, SVGs, calc, etc)
          @import "bootstrap/scss/functions";
          // 2. Include any default variable overrides here
          @import "bsVaribles";
          // 3. Include remainder of required Bootstrap stylesheets
          @import "bootstrap/scss/variables";
          // 4. Include any default map overrides here
          // 5. Include remainder of required parts
          @import "bootstrap/scss/maps";
          @import "bootstrap/scss/mixins";
          @import "bootstrap/scss/root";
          // 6. Optionally include any other parts as needed
          @import "bootstrap/scss/utilities";
          @import "bootstrap/scss/reboot";
          @import "bootstrap/scss/type";
          @import "bootstrap/scss/images";
          @import "bootstrap/scss/containers";
          @import "bootstrap/scss/grid";
          // 7. Optionally include utilities API last to generate classes based on the Sass map in `_utilities.scss`
          @import "bootstrap/scss/utilities/api";
          </pre>

        - ###### _bsVaribles
          ./src/assets/scss/vendors/_bsVaribles.scss
          此處可配置 欲覆蓋 bootstrap 的變數
          ```scss
            $grid-columns: 12;
            $grid-gutter-width: 16px;
            $grid-breakpoints: (
              xs: 0,
              sm: 576px,
              md: 768px,
              lg: 992px,
              xl: 1200px,
              xxl: 1366px
            );
            // $container-padding-x: 0;

            $container-max-widths: (
              sm: 540px,
              md: 720px,
              lg: 960px,
              xl: 1088px, //clo-width
              xxl: 1200px
            );
          ```

        - ###### 引入自己的custom scss 中
          ./src/assets/scss/layout.scss
          <pre>
            @import 'vendors/bsCustom';       // bootstrap 組合
            // 以下開始擺放自定義模組樣式
            @import 'component/button';       
          </pre>

        - ###### 將樣式掛載於全域
          ```ts
            // src/main.ts
            import { createApp } from 'vue';

            import App from './App.vue';
            import router from './router';

            import '@scss/layout.scss';         // 全域樣式

            const app = createApp(App);
            app.use(router);
            app.mount('#app');
          ```

    - #### ant design vue 自定義樣式配置
      - ##### 安裝
        ```sh
          npm i ant-design-vue@3.2.14 -S
        ```

      - ##### 設定按需載入
        ```js
          // vite.config.js
          import Components from 'unplugin-vue-components/vite';
          import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

          export default {
            plugins: [
              /* ... */
              Components({
                extensions: ['vue'],
                resolvers: [AntDesignVueResolver()], // ant design vue 按需載入
                include: [/\.vue$/, /\.vue\?vue/],
                dts: 'src/auto-components.js',
              }),
            ],
          };
        ```

        可以使用`unplugin-vue-components`來進行按需加載。
        但是此插件無法處理非組件模塊，如`message`，這種組件需要手動加載：
        ```ts
          import { message } from 'ant-design-vue';
          import 'ant-design-vue/es/message/style/css'; // vite只能用 ant-design-vue/es 而非 ant-design-vue/lib
        ```

      - ##### 調整全域變數 viet.config.ts
        相關變數可參考：[連結](https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less)
        ```ts
          // viet.config.ts
          ...
          export default defineConfig(({ mode }) => {
            ...
            return {
              // 全域CSS
              css: {
                preprocessorOptions: {
                  ...
                  less: {
                    lessOptions: {
                      modifyVars: {
                        'border-radius-base': '4px',
                        'primary-color': '#23C4A8',
                        'font-size-base': '16px',
                        'text-color': '#000000',
                        'btn-font-size': '16px',
                        'btn-height-base': '40px',
                        'table-header-bg': '#F5F8FC',
                        'table-header-color': '#000000D9',
                        'table-row-hover-bg': '#E6F7FF',
                        'table-border-radius-base': '0px',
                        'pagination-item-bg-active': '#999999',
                        'form-item-margin-bottom': '15px',
                        'input-border-color': '#EBEBEB',
                      },
                      javascriptEnabled: true,
                    },
                  },
                },
              },
              ...
            }
          })
        ```

## 頁面功能
  - ### 登入頁
    - #### 增加 antd icon 使用方式
      - [參考](https://juejin.cn/post/7086345377925824519)
      - ##### 安裝
        ```sh
          npm i -S @ant-design/icons-vue
        ```
      - ##### 自動按需載入
        ```ts
          // vite.config.ts
          ...
          import Components from 'unplugin-vue-components/vite'
          import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
          ...

          export default defineConfig(({ mode }) => {
            ...
            return {
              plugins: [
                ...
                Components({
                  resolvers: [
                    // ant design vue 按需載入
                    extensions: ['vue'],
                    AntDesignVueResolver({
                      // 自動引入 ant-design/icons-vue 中的圖標，須先安裝 @ant-design/icons-vue
                      resolveIcons: true,
                    }),
                  ], 
                  include: [/\.vue$/, /\.vue\?vue/],
                  dts: 'src/auto-components.ts',
                }),
                ...
              ],
              ...
            }
          })
        ```

    
    




