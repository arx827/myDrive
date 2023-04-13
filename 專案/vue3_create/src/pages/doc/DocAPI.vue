<script setup lang="ts"></script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">SDK 安裝 或 變更</h5>
      <ul>
        <li>
          <p>情境一：運行生成器時，選擇了 SDK : 'N'，(未安裝任何SDK)</p>
          <p>
            <small>指令中 {{ `<% Project SDK Name %>` }} 請替換為 專案SDK 名稱</small>
          </p>
          <PreCode type="bash" class="mt-3">
            <template #code>
              {{ `npm install --save @fubonlife/<% Project Name %>@latest` }}
            </template>
          </PreCode>
        </li>
        <li>
          <p>情境二：運行生成器時，選擇了 SDK : 'Y'，(已安裝了SDK)</p>
          <p>請查找`package.json`檔案，若SDK不同名，請將原始SDK移除，再安裝新的SDK</p>
          <p>若SDK同名，可直接執行 install 最新 SDK</p>
          <p>
            <small
              >指令中 {{ `<% old Project SDK Name %>` }}、{{ `<% new Project SDK Name %>` }} 請替換為 原SDK、新SDK
              名稱</small
            >
          </p>
          <PreCode type="bash" class="mt-3">
            <template #code>
              {{ `npm uninstall --save @fubonlife/<% old Project Name %>` }}
            </template>
          </PreCode>
          <PreCode type="bash" class="mt-3">
            <template #code>
              {{ `npm install --save @fubonlife/<% new Project Name %>@latest` }}
            </template>
          </PreCode>
        </li>
      </ul>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">宣告與註冊全域</h5>
      宣告並註冊SDK內的API Function
      <PreCode type="ts" class="mt-3">
        <template #code>
          {{
            `/* src/plugins/api/index.ts */

import type { App } from 'vue'
import axios from 'axios'
import type { Configuration, AuthApi } from '@fubonlife/iams-api-axios-sdk'
import { AuthApiFactory } from '@fubonlife/iams-api-axios-sdk'

// 在App 全域 增加 自定義變數 型態
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $authApi: AuthApi,
    ...
  }
}

export class Api {
  public install(app: App, options?: Configuration) {
    const $appGlobal = app.config.globalProperties

    $appGlobal.$authApi = AuthApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    ...
  }
}

export default new Api()`
          }}
        </template>
      </PreCode>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">掛載於 use</h5>
      將前面宣告與註冊的SDK，掛載於APP物件上，增加自定義變數
      <PreCode type="ts" class="mt-3">
        <template #code>
          {{
            `/* src/main.ts */

import { createApp } from 'vue'
import Api from '@plugins/api'
const app = createApp(App)
...
app.use(Api)
...
app.mount('#app')
`
          }}
        </template>
      </PreCode>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">呼叫API</h5>
      使用先前宣告的 API功能群組名稱，及對應的 Function名稱
      <PreCode type="js" class="mt-3">
        <template #code>
          {{
            `/* pages/LoginPage.vue */

import { getCurrentInstance } from 'vue'
const {
  proxy: { $authApi },
} = getCurrentInstance()                // 從 getCurrentInstance 解構出 $authApi
...

/**
 * API
 */
function login(submitData: formType) {
  store.SET_LOADING(true)               // loading 開啟
  $authApi
    .crowdLoginUsingPOST(submitData)    // 呼叫 API
    .then(resp => {                     // 成功
      if (resp.status === 200) {
        ...
      }
    })
    .catch(error => {                   // 失敗
      ...
    })
    .finally(() => {                    // 成功或失敗 都會觸發
      store.SET_LOADING(false)          // loading 關閉
    })
}`
          }}
        </template>
      </PreCode>
    </div>
  </div>
</template>

<style scoped></style>
