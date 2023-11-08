import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import message from '@plugins/message'
import user from '@plugins/user'

import 'vue-router'

import importCompVue from './importVue'

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb?: {
      mainTitle: string
      subTitle?: string[]
    }
  }
}

const routes: Array<RouteRecordRaw> = [
  /* === 值機端 === */
  {
    path: '/on-duty',
    name: 'OnDuty',
    component: importCompVue.OnDutyVue,
  },
  /* === 後台 === */
  {
    path: '/',
    name: 'home',
    component: importCompVue.MainPageVue,
    redirect: { name: 'SystemSetting' },
    children: [
      /* -------------------------- 系統管理 -------------------------- */
      {
        path: 'system',
        component: importCompVue.SystemVue,
        redirect: { name: 'SystemSetting' },
        children: [
          // 假日查詢
          {
            path: 'holiday',
            name: 'Holiday',
            meta: {
              bg: 'bg-system',
            },
            component: importCompVue.HolidaySettingVue,
          },
          // 系統設定
          {
            path: 'setting',
            name: 'SystemSetting',
            meta: {
              bg: 'bg-system',
            },
            component: importCompVue.SystemSettingVue,
          },
          // 文字客服關閉服務
          {
            path: 'service-closed',
            name: 'ServiceClosed',
            meta: {
              bg: 'bg-system',
            },
            component: importCompVue.ServiceClosedVue,
          },
          // 工作狀態新增/修改
          {
            path: 'working-status',
            name: 'WorkingStatus',
            redirect: { name: 'WorkingStatusTable' },
            children: [
              {
                path: 'index',
                name: 'WorkingStatusTable',
                meta: {
                  bg: 'bg-system',
                },
                component: importCompVue.WorkingStatusIndexVue,
              },
              {
                path: ':type(edit|add)',
                name: 'WorkingStatusAddAndEdit',
                component: importCompVue.WorkingStatusAddAndEditVue,
              },
            ],
          },
          // 客服人員服務時段
          {
            path: 'service-hours',
            name: 'ServiceHours',
            meta: {
              bg: 'bg-system',
            },
            component: importCompVue.ServiceHoursVue,
          },
          // 非服務時段宣告文字訊息
          {
            path: 'non-service-message',
            name: 'NonServiceMessage',
            meta: {
              bg: 'bg-system',
            },
            component: importCompVue.NonServiceMessageVue,
          },
          // 系統維護宣告文字訊息
          {
            path: 'mainten-message',
            name: 'MaintenMessage',
            meta: {
              bg: 'bg-system',
            },
            component: importCompVue.MaintenMessageVue,
          },
        ],
      },

      /* -------------------------- 卡片管理 -------------------------- */
      // 卡片管理
      {
        path: 'card',
        component: importCompVue.CardVue,
        redirect: { name: 'CardManagementIndex' },
        children: [
          {
            path: 'index',
            name: 'CardManagementIndex',
            component: importCompVue.CardManagementIndexVue,
            meta: {
              bg: 'bg-cardType',
            },
          },
          {
            path: 'add',
            name: 'CardManagementAdd',
            component: importCompVue.CardManagementAddAndEditVue,
          },
          {
            path: 'edit/:cardId?',
            name: 'CardManagementEdit',
            component: importCompVue.CardManagementAddAndEditVue,
          },
          // 卡片變更紀錄
          {
            path: 'card-change-log',
            name: 'CardChangeLog',
            component: importCompVue.CardManagementChangeLogVue,
          },
        ],
      },

      // 卡片類型管理
      {
        path: 'cardType',
        component: importCompVue.CardTypeVue,
        redirect: { name: 'CardTypeManagementIndex' },
        children: [
          {
            path: 'index',
            name: 'CardTypeManagementIndex',
            component: importCompVue.CardTypeManagementIndexVue,
            meta: {
              bg: 'bg-cardType',
            },
          },
          {
            path: 'add',
            name: 'CardTypeManagementAdd',
            component: importCompVue.CardTypeManagementAddAndEditVue,
          },
          {
            path: 'edit/:cardCategoryId',
            name: 'CardTypeManagementEdit',
            component: importCompVue.CardTypeManagementAddAndEditVue,
          },
          {
            path: 'card-type-change-log',
            name: 'CardTypeChangeLog',
            component: importCompVue.CardTypeManagementChangeLogVue,
          },
        ],
      },

      /* -------------------------- 覆核功能 -------------------------- */
      {
        path: 'review',
        redirect: { name: 'ReviewIndex' },
        component: importCompVue.ReviewVue,
        children: [
          {
            path: 'index',
            name: 'ReviewIndex',
            component: importCompVue.ReviewIndexVue,
            meta: {
              bg: 'bg-reviewType',
            },
          },
          {
            path: 'review-confirm',
            name: 'ReviewConfirm',
            component: importCompVue.ReviewConfirmVue,
          },
          // 覆核紀錄
          {
            path: 'review-change-log',
            name: 'ReviewChangeLog',
            component: importCompVue.ReviewChangeLogVue,
          },
        ],
      },

      /* -------------------------- 即時交談監控 -------------------------- */
      {
        path: 'chat-monitoring',
        redirect: { name: 'ChatMonitoringIndex' },
        component: importCompVue.ChatMonitoringVue,
        children: [
          {
            path: 'index',
            name: 'ChatMonitoringIndex',
            component: importCompVue.ChatMonitoringIndexVue,
            meta: {
              bg: 'chatMonitoringType',
            },
          },
          {
            path: 'detail/:clientId',
            name: 'ChatMonitoringDetail',
            component: importCompVue.ChatMonitoringPageVue,
          },
        ],
      },

      /* -------------------------- 報表 -------------------------- */
      {
        path: 'report',
        redirect: { name: 'ReportTrendingQuery' },
        component: importCompVue.ReportVue,
        children: [
          {
            path: 'trending-query',
            name: 'ReportTrendingQuery',
            component: importCompVue.ReportTrendingVue,
            meta: {
              bg: 'reportType',
            },
          },
          {
            path: 'chatroom-overview',
            name: 'ReportChatroomOverview',
            component: importCompVue.ReportChatroomVue,
            meta: {
              bg: 'reportType',
            },
          },
          {
            path: 'attendant-chatting-overview',
            name: 'ReportAttendantChattingOverview',
            component: importCompVue.ReportAttendantChattingVue,
            meta: {
              bg: 'reportType',
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
  { path: '/not-found', name: 'NotFound', component: importCompVue.NotFoundVue },
  { path: '/:catchAll(.*)*', component: importCompVue.NotFoundVue },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    const $main = document.querySelector('.main__content')
    if ($main) {
      $main.scrollTop = 0
    }
  },
})

// 網址未匹配處理
router.beforeEach(async (to, from, next) => {
  if (import.meta.env.BASE_URL !== window.location.pathname) {
    window.location.href = `${new URL(import.meta.url).origin}${import.meta.env.BASE_URL}#/not-found`
  } else {
    await next()
  }
})

export default router
