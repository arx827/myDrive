// [參考] https://juejin.cn/post/7008710181769084964
// [參考] https://blog.csdn.net/samscat/article/details/121952444
import type { App } from 'vue'
import axios from 'axios'
import type {
  Configuration,
  AuthApi,
  ServiceSettingsApi,
  CardCategoryManagementApi,
  CardManagementApi,
  ApplyManagementApi,
  FileManagementApi,
  TextTemplateManagementApi,
  RobotApi,
  ServiceAttendantApi,
  ChatroomClientApi,
  ChatroomApi,
  ReportApi,
} from '@fubonlife/fblics-api-axios-sdk'
import {
  AuthApiFactory,
  ServiceSettingsApiFactory,
  CardCategoryManagementApiFactory,
  CardManagementApiFactory,
  ApplyManagementApiFactory,
  FileManagementApiFactory,
  TextTemplateManagementApiFactory,
  RobotApiFactory,
  ServiceAttendantApiFactory,
  ChatroomClientApiFactory,
  ChatroomApiFactory,
  ReportApiFactory,
} from '@fubonlife/fblics-api-axios-sdk'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $authApi: AuthApi
    $serviceSettingsApi: ServiceSettingsApi
    $cardCategoryManagementApi: CardCategoryManagementApi
    $cardManagementApi: CardManagementApi
    $applyManagementApi: ApplyManagementApi
    $fileManagementApi: FileManagementApi
    $textTemplateManagementApi: TextTemplateManagementApi
    $robotApi: RobotApi
    $serviceAttendantApi: ServiceAttendantApi
    $chatroomClientApi: ChatroomClientApi
    $chatroomApi: ChatroomApi
    $reportApi: ReportApi
  }
}

export class Api {
  public install(app: App, options?: Configuration) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$authApi = AuthApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$serviceSettingsApi = ServiceSettingsApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$cardCategoryManagementApi = CardCategoryManagementApiFactory(
      options,
      import.meta.env.VITE_APP_API_BASE_URL,
      axios,
    )
    $appGlobal.$cardManagementApi = CardManagementApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$applyManagementApi = ApplyManagementApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$fileManagementApi = FileManagementApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$textTemplateManagementApi = TextTemplateManagementApiFactory(
      options,
      import.meta.env.VITE_APP_API_BASE_URL,
      axios,
    )
    $appGlobal.$robotApi = RobotApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$serviceAttendantApi = ServiceAttendantApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$chatroomClientApi = ChatroomClientApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$chatroomApi = ChatroomApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
    $appGlobal.$reportApi = ReportApiFactory(options, import.meta.env.VITE_APP_API_BASE_URL, axios)
  }
}

export default new Api()
