import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import user from '@/plugins/user'
import message from '@/plugins/message'

import LoginPage from '@/pages/LoginPage.vue'
import NotFound from '@/pages/NotFound.vue'

import MainPage from '@/pages/MainPage.vue'
import EmptyRouterView from '@/components/layout/EmptyRouterView.vue'

import 'vue-router'

import { importCompVue } from './importVue'

// demo
declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb?: {
      mainTitle: String
      subTitle?: String[]
    }
  }
}

const routes: Array<RouteRecordRaw> = [
  { path: '/login', name: 'Login', component: LoginPage },
  {
    path: '/',
    name: 'home',
    component: MainPage,
    redirect: {
      name: 'Form',
    },
    children: [
      /* ----------------------------------- component ------------------------------------- */
      {
        path: 'comp',
        component: EmptyRouterView,
        children: [
          {
            path: 'form',
            name: 'Form',
            component: importCompVue.CompFormVue,
            meta: {
              breadcrumb: {
                mainTitle: '元件',
                subTitle: ['表單'],
              },
            },
          },
          {
            path: 'table',
            name: 'Table',
            component: importCompVue.CompTableVue,
            meta: {
              breadcrumb: {
                mainTitle: '元件',
                subTitle: ['Table'],
              },
            },
          },
          {
            path: 'message',
            name: 'Message',
            component: importCompVue.CompMessageVue,
            meta: {
              breadcrumb: {
                mainTitle: '元件',
                subTitle: ['Message_訊息'],
              },
            },
          },
          {
            path: 'notification',
            name: 'Notification',
            component: importCompVue.CompNotificationVue,
            meta: {
              breadcrumb: {
                mainTitle: '元件',
                subTitle: ['Notification_通知提醒框'],
              },
            },
          },
          {
            path: 'modal',
            name: 'Modal',
            component: importCompVue.CompModalVue,
            meta: {
              breadcrumb: {
                mainTitle: '元件',
                subTitle: ['Modal_彈窗'],
              },
            },
          },
          {
            path: 'result',
            name: 'Result',
            component: importCompVue.CompResultVue,
            meta: {
              breadcrumb: {
                mainTitle: '元件',
                subTitle: ['Result_結果頁'],
              },
            },
          },
          {
            path: 'result/:type',
            name: 'ResultType',
            component: importCompVue.CompResultTypeVue,
            meta: {
              breadcrumb: {
                mainTitle: '元件',
                subTitle: ['Result_結果頁'],
              },
            },
          },
          {
            path: 'upload',
            name: 'Upload',
            component: importCompVue.CompUploadVue,
            meta: {
              breadcrumb: {
                mainTitle: '上傳',
              },
            },
          },
        ],
      },
      /* ----------------------------------- 常用範例 ------------------------------------- */
      {
        path: 'demo',
        component: EmptyRouterView,
        children: [
          {
            path: 'passParams',
            name: 'PassParams',
            component: importCompVue.PassParamsVue,
            meta: {
              breadcrumb: {
                mainTitle: '功能範例',
                subTitle: ['參數傳遞', '傳送'],
              },
            },
          },
          {
            path: 'getParams/:policyNo?',
            name: 'GetParams',
            component: importCompVue.GetParamsVue,
            meta: {
              breadcrumb: {
                mainTitle: '功能範例',
                subTitle: ['參數傳遞', '接收'],
              },
            },
          },
          {
            path: 'numberUtilFunc',
            name: 'NumberUtilFunc',
            component: importCompVue.NumberUtilFuncVue,
            meta: {
              breadcrumb: {
                mainTitle: '數字轉換',
              },
            },
          },
          {
            path: 'dateTimeUtilFunc',
            name: 'DateTimeUtilFunc',
            component: importCompVue.DateTimeUtilFuncVue,
            meta: {
              breadcrumb: {
                mainTitle: 'DateTime轉換',
              },
            },
          },
          {
            path: 'validateUtilFunc',
            name: 'ValidateUtilFunc',
            component: importCompVue.ValidateUtilFuncVue,
            meta: {
              breadcrumb: {
                mainTitle: 'Validate驗證',
              },
            },
          },
        ],
      },
      /* ----------------------------------- 使用手冊 ------------------------------------- */
      {
        path: 'doc',
        component: EmptyRouterView,
        children: [
          {
            path: 'doc-create',
            name: 'DocCreate',
            component: importCompVue.DocCreateVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['建置專案'],
              },
            },
          },
          {
            path: 'doc-architecture',
            name: 'DocArchitecture',
            component: importCompVue.DocArchitectureVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['架構說明'],
              },
            },
          },
          {
            path: 'doc-unplugin-vue-components',
            name: 'DocUnpluginVueVomponents',
            component: importCompVue.DocUnpluginVueVomponentsVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['Unplugin-vue-components'],
              },
            },
          },
          {
            path: 'doc-style',
            name: 'DocStyle',
            component: importCompVue.DocStyleVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['樣式客製說明'],
              },
            },
          },
          {
            path: 'doc-table',
            name: 'DocTable',
            component: importCompVue.DocTableVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['表格元件'],
              },
            },
          },
          {
            path: 'doc-form-validate',
            name: 'DocFormValidate',
            component: importCompVue.DocFormValidateVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['欄位檢核'],
              },
            },
          },
          {
            path: 'doc-modal-and-notification',
            name: 'DocModalAndNotification',
            component: importCompVue.DocModalAndNotificationVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['彈窗功能、confirm視窗'],
              },
            },
          },
          {
            path: 'doc-add-global',
            name: 'DocAddGlobal',
            component: importCompVue.DocAddGlobalVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['共用元件處理 (共用、Loading)'],
              },
            },
          },
          {
            path: 'doc-api',
            name: 'DocApi',
            component: importCompVue.DocApiVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['宣告及呼叫API'],
              },
            },
          },
          {
            path: 'doc-user',
            name: 'DocUser',
            component: importCompVue.DocUserVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['會員機制'],
              },
            },
          },
        ],
      },

      /* ----------------------------------- Vue3 實作練習 ------------------------------------- */
      {
        path: 'vue3',
        component: EmptyRouterView,
        children: [
          {
            path: 'doc-vue3',
            name: 'DocVue3',
            component: importCompVue.DocVue3Vue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['Vue3基礎知識'],
              },
            },
          },
          {
            path: 'doc-vue3-answer',
            name: 'DocVue3Answer',
            component: importCompVue.DocVue3AnswerVue,
            meta: {
              breadcrumb: {
                mainTitle: '使用手冊',
                subTitle: ['[解]_ToDoList 小作業'],
              },
            },
          },
        ],
      },
    ],
    // beforeEnter(to, from, next) {
    //   if (!user.hasValidToken()) {
    //     message.warning({ content: '尚未登入' })
    //     next({ name: 'Login' })
    //   } else {
    //     next()
    //   }
    // },
  },
  // 無法識別的path => 匹配 notFound
  { path: '/:catchAll(.*)', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    const $main = document.querySelector('.main__content')
    $main.scrollTop = 0
  },
})

export default router
