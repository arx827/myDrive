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
            @apply font-light;
          }
        }
      ```

  - #### vscode 支援 alias

  
  
  
  [Using webpack aliases / jsconfig](https://code.visualstudio.com/docs/languages/jsconfig#_using-webpack-aliases)
### 單元 9 - vite-plugin-pages - 檔案驅動的 Vite 路由套件

-----

