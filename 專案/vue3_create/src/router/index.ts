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
      /* ----------------------------------- 範例 ------------------------------------- */
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
                subTitle: ['參數傳遞', '傳送'],
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
    ],
    beforeEnter(to, from, next) {
      if (!user.hasValidToken()) {
        message.warning({ content: '尚未登入' })
        next({ name: 'Login' })
      } else {
        next()
      }
    },
  },
  // 無法識別的path => 匹配 notFound
  { path: '/:catchAll(.*)', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
