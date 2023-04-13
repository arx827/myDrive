<script setup lang="ts">
import { ref, computed } from 'vue'
interface tree {
  title: string
  description?: string
  key: string
  children?: tree[]
}
const expandedKeys = ref<string[]>([''])
const selectedKeys = ref<string[]>([''])
const treeData = ref<tree[]>([
  {
    title: '.vscode',
    key: 'vscode',
    description: 'VSCode 相關',
    children: [
      {
        title: 'extensions.json',
        key: 'extensions.json',
        description: 'VSCode 相關 / 延伸模組 『推薦』設定檔',
      },
      {
        title: 'settings.json',
        key: 'settings',
        description: 'VSCode 相關 / VSCode 設定檔 (包括格式化、延伸模組設定)',
      },
    ],
  },
  {
    title: 'dist',
    key: 'dist',
    description: '打包編譯完成檔 相關',
    children: [
      {
        title: 'development',
        key: 'development',
        description: '打包編譯完成檔 相關 / 依運行模式 產生 資料夾。 如：build:prod',
        children: [
          {
            title: 'css',
            key: 'development...css',
            description: '打包編譯完成檔 相關 / 依運行模式 產生 資料夾 / CSS檔案',
            children: [
              {
                title: '...',
                key: 'development...css...',
              },
            ],
          },
          {
            title: 'ico',
            key: 'development...ico',
            description: '打包編譯完成檔 相關 / 依運行模式 產生 資料夾 / 圖檔 依照副檔名產生的資料夾。如：favicon.ico',
            children: [
              {
                title: '...',
                key: 'development...ico...',
              },
            ],
          },
          {
            title: 'img',
            key: 'development...img',
            description: '打包編譯完成檔 相關 / 從 assets/img 資料夾 編譯。',
            children: [
              {
                title: '...',
                key: 'development...img...',
              },
            ],
          },
          {
            title: 'js',
            key: 'development...js',
            description: '打包編譯完成檔 相關 / 依運行模式 產生 資料夾 / JS檔案',
            children: [
              {
                title: '...',
                key: 'development...js...',
              },
            ],
          },
          {
            title: 'index.html',
            key: 'development_index',
            description: 'development 打包編譯完成檔 index.html',
          },
        ],
      },
    ],
  },
  {
    title: 'node_modules',
    key: 'node_modules',
    description: '套件 資料夾',
    children: [
      {
        title: '...',
        key: 'node_modules...',
      },
    ],
  },
  {
    title: 'public',
    key: 'public',
    description: '不進行打包編譯的檔案，資料夾 (不會壓縮、不會加 hash 值)，',
    children: [
      {
        title: '...',
        key: 'public...',
      },
    ],
  },
  {
    title: 'src',
    key: 'src',
    children: [
      {
        title: 'assets',
        key: 'assets',
        description: '靜態資源 相關。如：圖片、字型、sass 等',
        children: [
          {
            title: 'img',
            key: 'img',
            description: '圖片 相關',
            children: [
              {
                title: '...',
                key: 'img...',
              },
            ],
          },
          {
            title: 'style',
            key: 'style',
            description: '樣式 相關。(sass、less 等)',
            children: [
              {
                title: '...',
                key: 'style...',
              },
            ],
          },
        ],
      },
      {
        title: 'components',
        key: 'components',
        description: 'components 組件 相關。',
        children: [
          {
            title: 'layout',
            key: 'layout',
            description: 'components 相關 / layout 相關',
            children: [
              {
                title: 'sideMenu',
                key: 'sideMenu',
                description: 'components 相關 / layout 相關 / 側邊選單相關',
                children: [
                  {
                    title: 'FblSideMenu.vue',
                    key: 'FblSideMenu.vue',
                    description: 'components 相關 / layout 相關 / 側邊選單相關 / 第一層選單',
                  },
                  {
                    title: 'FblSubMenu.vue',
                    key: 'FblSubMenu.vue',
                    description: 'components 相關 / layout 相關 / 側邊選單相關 / 子選單',
                  },
                ],
              },
              {
                title: 'EmptyRouterView.vue',
                key: 'EmptyRouterView.vue',
                description: 'components 相關 / layout 相關 / router切換用的 空檔案',
              },
              {
                title: 'LayoutBreadcrumb.vue',
                key: 'LayoutBreadcrumb.vue',
                description: 'components 相關 / layout 相關 / 麵包屑',
              },
              {
                title: 'LayoutFooter.vue',
                key: 'LayoutFooter.vue',
                description: 'components 相關 / layout 相關 / Footer component',
              },
              {
                title: 'LayoutHeader.vue',
                key: 'LayoutHeader.vue',
                description: 'components 相關 / layout 相關 / Header component',
              },
              {
                title: 'LayoutResult.vue',
                key: 'LayoutResult.vue',
                description: 'components 相關 / layout 相關 / Result結果頁',
              },
              {
                title: 'Loading.vue',
                key: 'Loading.vue',
                description: 'components 相關 / layout 相關 / Loading component',
              },
            ],
          },
          {
            title: 'shared',
            key: 'shared',
            description: 'components 相關 / 共用 相關',
            children: [
              {
                title: 'data-grid',
                key: 'data-grid',
                description: 'components 相關 / 共用 相關 / 表格 相關',
                children: [
                  {
                    title: 'FblDataGrid.vue',
                    key: 'FblDataGrid.vue',
                    description: 'components 相關 / 共用 相關 / 表格 相關 / FblDataGrid 表格',
                  },
                  {
                    title: 'model.d.ts',
                    key: 'model.d.ts',
                    description: 'components 相關 / 共用 相關 / 表格 相關 / 用於 TypeScript 針對 FblDataGrid 識別',
                  },
                ],
              },
              {
                title: 'modal',
                key: 'sharedmodal',
                description: 'components 相關 / 共用 相關 / 彈窗modal 相關',
                children: [
                  {
                    title: 'ConfirmModal.vue',
                    key: 'ConfirmModal.vue',
                    description: 'components 相關 / 共用 相關 / 彈窗modal 相關 / 有 確認 & 取消按鈕 的 彈窗',
                  },
                  {
                    title: 'CustomModal.vue',
                    key: 'CustomModal.vue',
                    description: 'components 相關 / 共用 相關 / 彈窗modal 相關 / 自定義 彈窗 (可選尺寸)',
                  },
                ],
              },
              {
                title: 'FblPopConfirm.vue',
                key: 'FblPopConfirm.vue',
                description: 'components 相關 / 共用 相關 / popConfirm component',
              },
            ],
          },
        ],
      },
      {
        title: 'pages',
        key: 'pages',
        description: '各功能頁面 相關',
        children: [
          {
            title: 'comp',
            key: 'comp',
            description: '元件介紹頁',
            children: [
              {
                title: 'CompForm.vue',
                key: 'CompForm.vue',
                description: '各功能頁面 相關 / 元件介紹頁 / 表單元件',
              },
              {
                title: 'CompMessage.vue',
                key: 'CompMessage.vue',
                description: '各功能頁面 相關 / 元件介紹頁 / Message_訊息元件',
              },
              {
                title: 'CompModal.vue',
                key: 'CompModal.vue',
                description: '各功能頁面 相關 / 元件介紹頁 / Modal_彈窗元件',
              },
              {
                title: 'CompNotification.vue',
                key: 'CompNotification.vue',
                description: '各功能頁面 相關 / 元件介紹頁 / Notification_通知提醒框',
              },
              {
                title: 'CompResult.vue',
                key: 'CompResult.vue',
                description: '各功能頁面 相關 / 元件介紹頁 / Result_結果 按鈕頁',
              },
              {
                title: 'CompResultType.vue',
                key: 'CompResultType.vue',
                description: '各功能頁面 相關 / 元件介紹頁 / Result_結果頁',
              },
              {
                title: 'CompTable.vue',
                key: 'CompTable.vue',
                description: '各功能頁面 相關 / 元件介紹頁 / Table_表格',
              },
              {
                title: 'CompUpload.ts',
                key: 'CompUpload.ts',
                description: '各功能頁面 相關 / 元件介紹頁 / 用於 TypeScript 針對 Upload_上傳元件 識別',
              },
              {
                title: 'CompUpload.vue',
                key: 'CompUpload.vue',
                description: '各功能頁面 相關 / 元件介紹頁 / Upload_上傳元件',
              },
            ],
          },
          {
            title: 'demo',
            key: 'demo',
            description: 'Demo 功能 範例介紹頁',
            children: [
              {
                title: 'params',
                key: 'params',
                description: '各功能頁面 相關 / Demo 功能介紹頁 / params 頁面傳遞參數 相關',
                children: [
                  {
                    title: 'GetParams.vue',
                    key: 'GetParams.vue',
                    description: '各功能頁面 相關 / Demo 功能介紹頁 / params 頁面傳遞參數 相關 / 接收參數 範例',
                  },
                  {
                    title: 'PassParams.vue',
                    key: 'PassParams.vue',
                    description: '各功能頁面 相關 / Demo 功能介紹頁 / params 頁面傳遞參數 相關 / 傳送參數 範例',
                  },
                ],
              },
              {
                title: 'DateTimeUtilFunc.vue',
                key: 'DateTimeUtilFunc.vue',
                description: '各功能頁面 相關 / Demo 功能 範例介紹頁 / DateTime轉換 範例',
              },
              {
                title: 'NumberUtilFunc.vue',
                key: 'NumberUtilFunc.vue',
                description: '各功能頁面 相關 / Demo 功能 範例介紹頁 / 數字轉換 範例',
              },
              {
                title: 'ValidateUtilFunc.vue',
                key: 'ValidateUtilFunc.vue',
                description: '各功能頁面 相關 / Demo 功能 範例介紹頁 / Validate驗證 範例',
              },
            ],
          },
          {
            title: 'LoginPage',
            key: 'LoginPage',
            description: '登入頁',
          },
          {
            title: 'MainPage',
            key: 'MainPage',
            description: '首頁',
          },
          {
            title: 'NotFound',
            key: 'NotFound',
            description: '404頁面',
          },
        ],
      },
      {
        title: 'plugins',
        key: 'plugins',
        description: 'plugins功能 相關',
        children: [
          {
            title: 'api',
            key: 'api',
            description: 'plugins功能 相關 / api 相關',
            children: [
              {
                title: 'index.ts',
                key: 'api_index.ts',
                description: 'plugins功能 相關 / api 相關 / index',
              },
            ],
          },
          {
            title: 'global',
            key: 'global',
            description: 'plugins功能 相關 / global全域 相關',
            children: [
              {
                title: 'enumData.ts',
                key: 'global_enumData.ts',
                description: 'plugins功能 相關 / global全域 相關 / enumData_存放前端enum資料 及 轉換方式',
              },
              {
                title: 'index.ts',
                key: 'global_index.ts',
                description: 'plugins功能 相關 / global全域 相關 / global全域函式',
              },
            ],
          },
          {
            title: 'message',
            key: 'message',
            description: 'plugins功能 相關 / message 相關',
            children: [
              {
                title: 'index.ts',
                key: 'message_index.ts',
                description: 'plugins功能 相關 / message 相關 / index',
              },
            ],
          },
          {
            title: 'modal',
            key: 'modal',
            description: 'plugins功能 相關 / modal 相關',
            children: [
              {
                title: 'index.ts',
                key: 'index.ts',
                description: 'plugins功能 相關 / modal 相關 / index',
              },
            ],
          },
          {
            title: 'notification',
            key: 'notification',
            description: 'plugins功能 相關 / notification 相關',
            children: [
              {
                title: 'index.ts',
                key: 'notification_index.ts',
                description: 'plugins功能 相關 / notification 相關 / index',
              },
            ],
          },
          {
            title: 'uploadFile',
            key: 'uploadFile',
            description: 'plugins功能 相關 / uploadFile 相關',
            children: [
              {
                title: 'index.ts',
                key: 'upload_index.ts',
                description: 'plugins功能 相關 / uploadFile 相關 / index',
              },
            ],
          },
          {
            title: 'user',
            key: 'user',
            description: 'plugins功能 相關 / user 相關',
            children: [
              {
                title: 'index.ts',
                key: 'user_index.ts',
                description: 'plugins功能 相關 / user 相關 / index',
              },
              {
                title: 'model.ts',
                key: 'user_model.ts',
                description: 'plugins功能 相關 / user 相關 / 用在 TypeScript 針對 user 相關 識別',
              },
            ],
          },
          {
            title: 'util',
            key: 'util',
            description: 'plugins功能 相關 / util 相關',
            children: [
              {
                title: 'blobUtil.ts',
                key: 'blobUtil.ts',
                description: 'plugins功能 相關 / util 相關 / blobUtil_轉換 blob 相關',
              },
              {
                title: 'dateTimeUtil.ts',
                key: 'dateTimeUtil.ts',
                description: 'plugins功能 相關 / util 相關 / dateTime_日期時間 相關',
              },
              {
                title: 'numberUtil.ts',
                key: 'numberUtil.ts',
                description: 'plugins功能 相關 / util 相關 / number 相關',
              },
              {
                title: 'validateUtil.ts',
                key: 'validateUtil.ts',
                description: 'plugins功能 相關 / util 相關 / validate 相關',
              },
            ],
          },
        ],
      },
      {
        title: 'router',
        key: 'router',
        description: 'router 相關',
        children: [
          {
            title: 'importVue.ts',
            key: 'importVue.ts',
            description: 'router 相關 / Component import 的集中處',
          },
          {
            title: 'index.ts',
            key: 'router_index.ts',
            description: 'router 相關 / router 設定',
          },
        ],
      },
      {
        title: 'stores',
        key: 'stores',
        description: 'stores',
        children: [
          {
            title: 'index.ts',
            key: 'stores_index.ts',
            description: 'stores / 全域狀態管理 index',
          },
          {
            title: 'pinia.ts',
            key: 'pinia.ts',
            description: 'stores / pinia 設定檔',
          },
          {
            title: 'useUser.ts',
            key: 'useUser.ts',
            description: 'stores / user 相關',
          },
        ],
      },
      {
        title: 'App.vue',
        key: 'App.vue',
        description: '專案的根元件',
      },
      {
        title: 'auto-components.d.ts',
        key: 'auto-components.d.ts',
        description: '用於 TypeScript 針對 unplugin-auto-component 產生檔識別，用於自動載入component。',
      },
      {
        title: 'main.ts',
        key: 'main.ts',
        description: '專案的程式進入點',
      },
      {
        title: 'shims-tsx.d.ts',
        key: 'shims-tsx.d.ts',
        description: '用於 TypeScript 針對 tsx 語法的識別',
      },
      {
        title: 'shims-vue.d.ts',
        key: 'shims-vue.d.ts',
        description: '用於 TypeScript 針對 .vue 文件的識別',
      },
    ],
  },
  {
    title: '.env',
    key: '.env',
    description: '環境設定檔 (不分模式 設定檔)',
  },
  {
    title: '.env.development',
    key: '.env.development',
    description: '環境設定檔 (development 開發模式 設定檔)',
  },
  {
    title: '.env.uat',
    key: '.env.uat',
    description: '環境設定檔 (uat 開發模式 設定檔)',
  },
  {
    title: '.env.prod',
    key: '.env.prod',
    description: '環境設定檔 (production 開發模式 設定檔)',
  },
  {
    title: '.eslintignore',
    key: '.eslintignore',
    description: 'eslint 忽略名單 設定檔',
  },
  {
    title: '.eslintrc.cjs',
    key: '.eslintrc.cjs',
    description: 'eslint 設定檔 (針對 程式碼規範 設定)',
  },
  {
    title: '.gitignore',
    key: '.gitignore',
    description: 'git 忽略名單 設定檔',
  },
  {
    title: '.prettierrc.json',
    key: '.prettierrc.json',
    description: 'prettier 設定檔 (針對 程式碼格式化 設定)',
  },
  {
    title: 'env.d.ts',
    key: 'env.d.ts',
    description: '用於 TypeScript 針對 .env 文件的識別',
  },
  {
    title: 'favicon.ico',
    key: 'favicon.ico',
    description: '瀏覽器 圖標',
  },
  {
    title: 'index.html',
    key: 'index.html',
    description: '首頁入口檔案',
  },
  {
    title: 'package-lock.json',
    key: 'package-lock.json',
    description: '專案套件的詳細資訊 (自動產生)',
  },
  {
    title: 'package.json',
    key: 'package.json',
    description: '專案相關資訊、Script腳本、套件管理',
  },
  {
    title: 'pom.xml',
    key: 'pom.xml',
    description: 'Maven 的 專案物件模型 相關檔',
  },
  {
    title: 'README.md',
    key: 'README.md',
    description: '專案 說明頁 README 檔',
  },
  {
    title: 'tsconfig.config.json',
    key: 'tsconfig.config.json',
    description: 'typescript 設定檔',
  },
  {
    title: 'tsconfig.json',
    key: 'tsconfig.json',
    description: 'typescript 設定檔',
  },
  {
    title: 'vite.config.ts',
    key: 'vite.config.ts',
    description: 'Vite 的設定檔 (可設定 打包、編譯、套件等功能 )',
  },
  {
    title: 'web.xml',
    key: 'web.xml',
    description: 'Maven 的 專案物件模型 相關檔',
  },
])

function flattenObj(data) {
  const float = []
  data.map(i => flatten(i))

  function flatten(item) {
    if (item.children) {
      float.push(item)
      item.children.map(i => flatten(i))
    } else {
      float.push(item)
    }
  }
  return float
}

const renderItems = computed(() => {
  return flattenObj(treeData.value)
})

// 顯示點擊 內容說明
const description = computed(() => {
  return renderItems.value.find(i => i.key === selectedKeys.value[0])?.description
})
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">結構</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">資料夾結構</h5>
          <div class="d-flex">
            <a-directory-tree
              class="tree__directory"
              :tree-data="treeData"
              v-model:selectedKeys="selectedKeys"
              v-model:expandedKeys="expandedKeys"
            >
              <template #title="{ title }">
                <a-dropdown :trigger="['contextmenu']">
                  <span>{{ title }}</span>
                </a-dropdown>
              </template>
            </a-directory-tree>
            <div class="description col border-start">{{ description }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">Package</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">json 內容說明</h5>
          <PreCode type="json">
            <template #code>
              {{
                `{
  "name": "vue3_create-web",        // 專案名稱
  "version": "1.0.0",               // 專案版號
  "private": true,                  // 防止意外發布
  "scripts": {                      // 所有指令腳本
    "dev": "vite --mode development --port 8200",
    "build": "run-p type-check build-only",
    "build:dev": "vite build --mode development",
    "build:uat": "vite build --mode uat",
    "build:prod": "vite build --mode production",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --noEmit",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  },
  "dependencies": {                      // 依賴套件
    "@ant-design/icons-vue": "6.1.0",
    "@fubonlife/vue3_create-api-axios-sdk": "latest",
    "@fubonlife/vue-datepicker-next": "1.0.6",
    "@popperjs/core": "2.11.6",
    "ant-design-vue": "3.2.14",
    "axios": "0.21.1",
    "bootstrap": "5.2.2",
    "pinia": "2.0.23",
    "vite-svg-loader": "3.6.0",
    "vue": "3.2.41",
    "vue-router": "4.1.5"
  },
  "devDependencies": {                    // 開發依賴
    "@rushstack/eslint-patch": "1.1.4",
    "@types/node": "16.11.68",
    "@vitejs/plugin-vue": "3.1.2",
    "@vue/eslint-config-prettier": "7.0.0",
    "@vue/eslint-config-typescript": "11.0.0",
    "@vue/tsconfig": "0.1.3",
    "eslint": "8.22.0",
    "eslint-plugin-vue": "9.3.0",
    "less": "4.1.3",
    "less-loader": "11.1.0",
    "npm-run-all": "4.1.5",
    "prettier": "2.7.1",
    "sass": "1.56.0",
    "typescript": "4.7.4",
    "unplugin-auto-import": "0.12.1",
    "unplugin-vue-components": "0.22.9",
    "vite": "3.1.8",
    "vite-plugin-html": "3.2.0",
    "vue-jwt-decode": "0.1.0",
    "vue-tsc": "1.0.13"
  }
}`
              }}
            </template>
          </PreCode>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">軟體版號</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">版號說明</h5>
          如：1.3.2
          <a-descriptions bordered size="small" :column="1">
            <a-descriptions-item label="主版號">不相容的 API 修改</a-descriptions-item>
            <a-descriptions-item label="次版號">向下相容的功能性新增</a-descriptions-item>
            <a-descriptions-item label="修訂號">向下相容的問題修正</a-descriptions-item>
          </a-descriptions>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">符號說明</h5>
          <a-descriptions bordered size="small" :column="1">
            <a-descriptions-item label="無符號">鎖定版本安裝，但未輸入的碼，會取得最新版號</a-descriptions-item>
            <a-descriptions-item label="* 、 latest">最新版本</a-descriptions-item>
            <a-descriptions-item label="~"
              >只鎖定 主版號 及 次版號，如：~1.3.2，大於等於 1.3.2 小於 1.4.0</a-descriptions-item
            >
            <a-descriptions-item label="^">只鎖定 主版號，如：^1.3.2，&gt;= 1.3.2 &lt; 2.0.0</a-descriptions-item>
            <a-descriptions-item label="x">不固定的版本號，如：1.3.x</a-descriptions-item>
            <a-descriptions-item label=">">大於某個版本號，如：&gt; 1.3.2</a-descriptions-item>
            <a-descriptions-item label=">=">大於等於某個版本號，如：&gt;= 1.3.2</a-descriptions-item>
            <a-descriptions-item label="<">小於某個版本號，如：&lt; 1.3.2</a-descriptions-item>
            <a-descriptions-item label="<=">小於等於某個版本號，如：&lt;= 1.3.2</a-descriptions-item>
            <a-descriptions-item label="-">介於兩版本號之間，如：1.3.2 - 2.0.0</a-descriptions-item>
          </a-descriptions>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.tree__directory) {
  width: 300px;
  height: 300px;
  overflow: auto;
}
.description {
  padding: 5px 20px;
}
</style>
