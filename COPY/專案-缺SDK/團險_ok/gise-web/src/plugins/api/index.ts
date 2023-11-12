// [參考] https://juejin.cn/post/7008710181769084964
// [參考] https://blog.csdn.net/samscat/article/details/121952444
import type { App } from 'vue'

import axios from 'axios'
import type {
  Configuration,
  EMPAuthApi,
  EMPCommonApi,
  EMPSelfPayEFormApi,
  UtilityApi,
} from '@fubonlife/gise-api-axios-sdk'
import {
  EMPAuthApiFactory,
  EMPCommonApiFactory,
  EMPSelfPayEFormApiFactory,
  UtilityApiFactory,
} from '@fubonlife/gise-api-axios-sdk'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $authApi: EMPAuthApi
    $commonApi: EMPCommonApi
    $selfPayEFormApi: EMPSelfPayEFormApi
    $utilityApi: UtilityApi
  }
}

export class Api {
  public install(app: App, options?: Configuration) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$authApi = EMPAuthApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$commonApi = EMPCommonApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$selfPayEFormApi = EMPSelfPayEFormApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$utilityApi = UtilityApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
  }
}

export default new Api()
