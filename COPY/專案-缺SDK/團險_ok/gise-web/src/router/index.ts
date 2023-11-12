import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import user from '@/plugins/user'
import message from '@/plugins/message'
import MainPage from '@/pages/MainPage.vue'
import 'vue-router'
import { importCompVue } from './importVue'

// demo

declare module 'vue-router' {
  interface RouteMeta {
    mainTitle: string
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: importCompVue.Login,
    beforeEnter: (to, from, next) => {
      if (user.loginState) {
        router.replace({ path: '/' })
      } else {
        next()
      }
    },
  },
  {
    path: '/forget-password',
    name: 'ForgetPassword',
    component: importCompVue.ForgetPasswordVue,
    redirect: { name: 'ForgetPasswordStep1' },
    children: [
      {
        path: 'step1',
        name: 'ForgetPasswordStep1',
        component: importCompVue.ForgetPasswordStep1Vue,
      },
      {
        path: 'step2',
        name: 'ForgetPasswordStep2',
        component: importCompVue.ForgetPasswordStep2Vue,
        beforeEnter: (to, from, next) => {
          const query = JSON.parse(sessionStorage.getItem('forget-password_memberFormStep1'))
          if (query && query.companyNo) {
            if (sessionStorage.getItem('complete') === 'success') {
              next({ name: 'Login' })
            } else {
              next()
            }
          } else {
            window.history.back()
          }
        },
      },
      {
        path: 'step3',
        name: 'ForgetPasswordStep3',
        component: importCompVue.ForgetPasswordStep3Vue,
        beforeEnter: (to, from, next) => {
          const query = JSON.parse(sessionStorage.getItem('forget-password_memberFormStep2'))
          if (query && query.accountId && query.email && query.newPassword && query.passCodeId) {
            if (sessionStorage.getItem('complete') === 'success') {
              next({ name: 'Login' })
            } else {
              next()
            }
          } else {
            window.history.back()
          }
        },
      },
      {
        path: 'step4',
        name: 'ForgetPasswordStep4',
        component: importCompVue.ForgetPasswordStep4Vue,
        beforeEnter: (to, from, next) => {
          if (sessionStorage.getItem('forget-password_memberFormStep3')) {
            next()
          } else {
            window.history.back()
          }
        },
      },
    ],
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: importCompVue.SignUpVue,
    redirect: { name: 'VerifyQualification' },
    children: [
      {
        path: 'step1',
        name: 'VerifyQualification',
        component: importCompVue.VerifyQualificationVue,
      },
      {
        path: 'step2',
        name: 'FillOutForm',
        component: importCompVue.FillOutFormVue,
        beforeEnter: (to, from, next) => {
          const query = JSON.parse(sessionStorage.getItem('signup_memberFormStep1'))
          if (query && query.companyNo) {
            if (sessionStorage.getItem('complete') === 'success') {
              next({ name: 'Login' })
            } else {
              next()
            }
          } else {
            window.history.back()
          }
        },
      },
      {
        path: 'step3',
        name: 'VerifyEmail',
        component: importCompVue.VerifyEmailVue,
        beforeEnter: (to, from, next) => {
          const query = JSON.parse(sessionStorage.getItem('signup_memberFormStep2'))
          if (query && query.accountId && query.email && query.newPassword && query.passCodeId) {
            if (sessionStorage.getItem('complete') === 'success') {
              next({ name: 'Login' })
            } else {
              next()
            }
          } else {
            window.history.back()
          }
        },
      },
      {
        path: 'step4',
        name: 'SignUpComplete',
        component: importCompVue.SignUpCompleteVue,
        beforeEnter: (to, from, next) => {
          if (sessionStorage.getItem('signup_memberFormStep3')) {
            next()
          } else {
            window.history.back()
          }
        },
      },
      {
        path: 'mid-return',
        name: 'MIDReturn',
        component: importCompVue.MidEmptyRouterViewVue,
        beforeEnter: (to, from, next) => {
          if (sessionStorage.getItem('complete') === 'success') {
            next({ name: 'Login' })
          } else {
            next()
          }
        },
      },
    ],
  },
  {
    path: '/',
    name: 'home',
    component: MainPage,
    redirect: { name: 'Index' },
    children: [
      {
        path: 'index',
        name: 'Index',
        alias: '/',
        component: importCompVue.IndexVue,
      },
      {
        path: 'apply',
        name: 'Apply',
        component: importCompVue.ApplyVue,
        redirect: { name: 'EmployeeData' },
        children: [
          {
            path: 'step1',
            name: 'EmployeeData',
            component: importCompVue.EmployeeDataVue,
            beforeEnter: (to, from, next) => {
              const $param = JSON.parse(sessionStorage.getItem('param'))
              if (!$param || !Object.keys($param).includes(to?.name as string)) {
                window.history.back()
              } else {
                next()
              }
            },
          },
          {
            path: 'step2',
            name: 'InsuredData',
            component: importCompVue.InsuredDataVue,
            beforeEnter: (to, from, next) => {
              const $param = JSON.parse(sessionStorage.getItem('param'))
              if (!$param || !Object.keys($param).includes(to?.name as string)) {
                window.history.back()
              } else {
                next()
              }
            },
          },
          {
            path: 'step3',
            name: 'HealthStatement',
            component: importCompVue.HealthStatementVue,
            beforeEnter: (to, from, next) => {
              const $param = JSON.parse(sessionStorage.getItem('param'))
              if (!$param || !Object.keys($param).includes(to?.name as string)) {
                window.history.back()
              } else {
                next()
              }
            },
          },
          {
            path: 'step4',
            name: 'PaymentApproach',
            component: importCompVue.PaymentApproach,
            beforeEnter: (to, from, next) => {
              const $param = JSON.parse(sessionStorage.getItem('param'))
              if (!$param || !Object.keys($param).includes(to?.name as string)) {
                window.history.back()
              } else {
                next()
              }
            },
          },
          {
            path: 'step5',
            name: 'ConfirmData',
            component: importCompVue.ConfirmDataVue,
            beforeEnter: (to, from, next) => {
              const $param = JSON.parse(sessionStorage.getItem('param'))
              if (!$param || !Object.keys($param).includes(to.name as string)) {
                window.history.back()
              } else {
                next()
              }
            },
          },
          {
            path: 'step6',
            name: 'SubmitApplication',
            component: importCompVue.SubmitApplicationVue,
            beforeEnter: (to, from, next) => {
              const $param = JSON.parse(sessionStorage.getItem('param'))
              if (!$param || !Object.keys($param).includes(to.name as string)) {
                window.history.back()
              } else {
                next()
              }
            },
          },
        ],
        meta: {
          mainTitle: '申請員工自費團險',
        },
      },

      /* ----------------------------------- 查詢專區 ------------------------------------- */
      {
        path: 'fill-out-record',
        name: 'FillOutRecord',
        component: importCompVue.FillOutRecordVue,
        meta: {
          mainTitle: '線上填寫作業紀錄',
        },
      },

      /* ----------------------------------- 下載專區 ------------------------------------- */
      {
        path: 'download-area',
        name: 'DownloadArea',
        component: importCompVue.DownloadAreaVue,
        meta: {
          mainTitle: '下載專區',
        },
      },

      /* ----------------------------------- TEST: ------------------------------------- */
      // {
      //   path: 'demo',
      //   name: 'Demo',
      //   component: importCompVue.DemoComp,
      // },
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
  { path: '/server-error', name: 'ServerError', component: importCompVue.ServerErrorVue },
  { path: '/:pathMatch(.*)*', name: 'PageNotFound', component: importCompVue.PageNotFoundVue },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // const $main = document.querySelector('.main__content')
    // $main.scrollTop = 0
  },
})

export default router
