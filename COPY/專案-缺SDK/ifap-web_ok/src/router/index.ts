import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import MainPage from "@/pages/MainPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import RolePage from "@/pages/RolePage.vue";
import MailListPage from "@/pages/MailListPage.vue";
import KaptchaPage from "@/pages/KaptchaPage.vue";
import EmailEffectiveCheckPage from "@/pages/emailEffective/EmailEffectiveCheckPage.vue"
import ValidationSuccessfulPage from "@/pages/emailEffective/ValidationSuccessfulPage.vue"
import EmailEffectiveMainPage from "@/pages/emailEffective/EmailEffectiveMainPage.vue"
import EmailCheckResultPage from "@/pages/emailEffective/EmailCheckResultPage.vue"

import Index from "@/pages/Index.vue";
import RouterPage from '@shared/layout/RouterPageLayout.vue';
import QueryEmailRecordPage from '@pages/letterManagement/queryEmailRecord/QueryEmailRecordPage.vue';
import ValidDomainSettingPage from '@pages/letterManagement/validDomainSetting/ValidDomainSettingPage.vue';
import UserMaintainPage from '@pages/maintaince/userMaintain/UserMaintainPage.vue';
import RoleMaintainPage from '@pages/maintaince/roleMaintain/RoleMaintainPage.vue';
import MailAccountMaintainPage from '@pages/maintaince/mailAccountMaintain/MailAccountMaintainPage.vue';

import { UserService } from "@/plugins/user";
import { message } from "ant-design-vue";
import { BehaviorSubject, Subject } from "rxjs";

Vue.use(VueRouter);
// 把beforeEnter這個變數丟進Vue的全域
Vue.prototype.beforeEnter$ = new BehaviorSubject<{ to: Route; from: Route }>(
  null,
);
const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  {
    path: '/',
    component: MainPage,
    redirect: { name: 'Index' },
    alias: '/index',
    children: [
      {
        path: '/',
        name: 'Index',
        component: Index,
      },
      {
        path: 'role',
        name: 'Role',
        component: RolePage,
        meta: { title: '權限頁' },
      },
      {
        path: 'group-setting',
        name: 'GROUP_SETTING',
        component: RolePage,
        meta: { title: '群組設定頁' },
      },
      {
        path: 'mail-list',
        name: 'MAIL_LIST',
        component: MailListPage,
        meta: { title: '異常郵件報表' },
      },
      {
        path: 'kaptcha',
        name: 'KAPTCHA',
        component: KaptchaPage,
        meta: {
          title: 'Kaptcha驗證碼參考頁',
          breadcrumb: ['參考頁', 'Kaptcha驗證碼'],
        },
      },

      // ------------------- 信件管理 ------------------- //
      {
        path: '/letter-management',
        name: 'LetterManagement',
        component: RouterPage,
        children: [
          // 人壽郵件紀錄
          {
            path: "query-email-record-page",
            name: "QueryEmailRecordPage",
            component: QueryEmailRecordPage,
            meta: {
              title: '人壽郵件紀錄',
              breadcrumb: ['信件管理', '人壽郵件紀錄'],
            },
          },
          // 有效郵件清單設定
          {
            path: "valid-domain-setting-page",
            name: "ValidDomainSettingPage",
            component: ValidDomainSettingPage,
            meta: {
              title: '有效郵件清單設定',
              breadcrumb: ['信件管理', '有效郵件清單設定'],
            },
          },
        ],
      },
      // ------------------- 系統維護 ------------------- //
      {
        path: 'maintaince',
        name: 'Maintaince',
        component: RouterPage,
        children: [
          // 使用者維護
          {
            path: "user-maintain-page",
            name: "UserMaintainPage",
            component: UserMaintainPage,
            meta: {
              title: '使用者維護',
              breadcrumb: ['系統維護', '使用者維護'],
            },
          },
          // 角色維護
          {
            path: "role-maintain-page",
            name: "RoleMaintainPage",
            component: RoleMaintainPage,
            meta: {
              title: '角色維護',
              breadcrumb: ['系統維護', '角色維護'],
            },
          },
          // 發信帳號維護
          {
            path: "mail-account-maintain-page",
            name: "MailAccountMaintainPage",
            component: MailAccountMaintainPage,
            meta: {
              title: '發信帳號維護',
              breadcrumb: ['系統維護', '發信帳號維護'],
            },
          },
        ],
      },
    ],

    // 進入router之前要驗證token
    beforeEnter(to, from, next) {
      const userService: UserService = Vue.prototype.$user;
      if (!userService.hasValidToken()) {
        // message.warn('尚未登入');
        next({ name: 'Login' });
      } else {
        next();
      }
    },
  },
  // ------------------- Email有效性驗證 ------------------- //
  {
    path: "/emailEffectiveMain",
    name: "EmailEffectiveMain",
    component: EmailEffectiveMainPage,
    children: [
      {
        path: "emailEffectiveCheck",
        name: "EmailEffectiveCheck",
        component: EmailEffectiveCheckPage,
      },
      {
        path: "validationSuccessful",
        name: "ValidationSuccessful",
        component: ValidationSuccessfulPage,
      },
      {
        path: "emailCheckResult",
        name: "EmailCheckResult",
        component: EmailCheckResultPage,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    window.document.title = to.meta.title;
    console.log(`window.document.title：${window.document.title}`);
  }
  Vue.prototype.beforeEnter$.next({
    to,
    from,
  });
  next();
});

export default router;
