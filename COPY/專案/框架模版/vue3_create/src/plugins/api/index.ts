// [參考] https://juejin.cn/post/7008710181769084964
// [參考] https://blog.csdn.net/samscat/article/details/121952444
import type { App } from 'vue'
import axios from 'axios'
import type { Configuration, AuthApi } from '@fubonlife/iams-api-axios-sdk'
import { AuthApiFactory } from '@fubonlife/iams-api-axios-sdk'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $authApi: AuthApi
  }
}

export class Api {
  public install(app: App, options?: Configuration) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$authApi = AuthApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
  }
}

export default new Api()
