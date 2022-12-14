import Vue from 'vue'
import VueRouter, { Route } from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import ProductSpecPage from '@/pages/ProductSpecPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import RolePage from '@/pages/RolePage.vue'
import MonitorPage from '@/pages/MonitorPage.vue'
import { UserService } from '@/plugins/user'
import { message } from 'ant-design-vue'
import { BehaviorSubject, Subject } from 'rxjs'
import ReviewAssignmentPage from '@/pages/ReviewAssignmentPage.vue'
import QrySusTransPage from '@/pages/QrySusTransPage.vue'
import QrySusTrans2Page from '@/pages/QrySusTrans2Page.vue'
import StatisticsPage from '@/pages/StatisticsPage.vue'
import AddPage from '@/pages/AddPage.vue'
import AddVerificationPage from '@/pages/AddVerificationPage.vue'
import ReviewDetailPage from '@/pages/ReviewDetailPage.vue'
import ReviewSearchPage from '@/pages/ReviewSearchPage.vue'
import ReviewSearchDetail from '@/pages/ReviewSearchDetailPage.vue'
import ReviewDetailErrorPage from '@/pages/ReviewDetailErrorPage.vue'
import MergeCaseDetailPage from '@/pages/MergeCaseDetailPage.vue'
import PermissionApplicationPage from '@/pages/PermissionApplicationPage.vue'
import PermissionApprovalPage from '@/pages/PermissionApprovalPage.vue'
import CrowdAuthTokenPage from '@/pages/CrowdAuthTokenPage.vue'
import PwdEncodePage from '@/pages/PwdEncodePage.vue'

import store from '../store'

Vue.use(VueRouter)
Vue.prototype.beforeEnter$ = new BehaviorSubject<{ to: Route, from: Route }>(null);

function StoreChangeEnterPathName(to, from, next){
  switch(true){
    case (/review/).test(to.path):
      store.dispatch("ChangeEnterPathName", "review");
      break;
    case (/confirm/).test(to.path):
      store.dispatch("ChangeEnterPathName", "confirm");
      break;
  }
  next();
}
const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/qry-sus-trans2', name: 'QrySusTrans2', component: QrySusTrans2Page},
  {
    path: '/review-detail',
    name: 'ReviewDetail',
    meta: { title: '???????????????' },
    component: ReviewDetailPage,
    beforeEnter: StoreChangeEnterPathName
  },
  {
    path: '/confirm-detail',
    name: 'ReviewConfirmDetail',
    meta: { title: '???????????????' },
    component: ReviewDetailPage,
    beforeEnter: StoreChangeEnterPathName
  },
  { path: '/review-search-detail', name: 'ReviewSearchDetail', component: ReviewSearchDetail },
  { path: '/review-search-full-main', name: 'ReviewSearchFullMain', component: ReviewSearchPage },
  { path: '/review-detail-error-page', name: 'ReviewDetailError', component: ReviewDetailErrorPage },
  { path: '/crowd-auth-token', name: 'CrowdAuthToken', component: CrowdAuthTokenPage },
  { path: '/pwdEncode', name: 'PwdEncodePage', component: PwdEncodePage },
  {
    path: '/merge-case-detail',
    name: 'MergeCaseDetailPage',
    meta: { title: '??????/???????????????' },
    component: MergeCaseDetailPage
  },
  {
    path: '/',
    name: 'Main',
    component: MainPage,
    redirect: to => {
      const userService: UserService = Vue.prototype.$user;
      // ???????????? ??????
      if (!userService.hasValidToken()) {
        return "Login";
      }else{
        if(userService.getMe().roles.length <= 0) {
          return 'review-detail-error-page';
        }
        const roles = userService.getMe().roles;
        const temp: Map<string, string> = new Map<string, string>();
        roles.map((r) => {
          r.menus.map((m) => {
            if (m.route != null) {
              temp.set(m.id, m.route);
            }
          });
        });
        return Array.from(new Map([...temp.entries()].sort()).values())[0];
      }
    },
    children: [
      { path: 'product', name: 'Product', component: ProductPage },
      { path: 'role', name: 'Role', component: RolePage },
      { path: 'product-spec', name: 'ProductSpec', component: ProductSpecPage },
      // ?????????
      { 
        path: 'review-assignment',
        name: 'ReviewAssignmentPage',
        meta: { title: '?????????' },
        component: ReviewAssignmentPage,
        beforeEnter: StoreChangeEnterPathName
      },
      // ?????????
      {
        path: 'confirm-assignment',
        name: 'ReviewConfirmPage',
        meta: { title: '?????????' },
        component: ReviewAssignmentPage,
        beforeEnter: StoreChangeEnterPathName
      },
      { path: 'qry-sus-trans', name: 'QrySusTrans', component: QrySusTransPage},
      { path: 'statistics', name: 'StatisticsPage', component: StatisticsPage},
      { path: 'monitor', name: 'Monitor', component: MonitorPage },
      { path: 'review-search', name: 'ReviewSearch', component: ReviewSearchPage },
      { path: 'add', name: 'AddPage', component: AddPage},
      { path: 'add-verification', name: 'AddVerificationPage', component: AddVerificationPage },
      { path: 'permission-application', name: 'PermissionApplicationPage', component: PermissionApplicationPage },
      { path: 'permission-approval', name: 'PermissionApprovalPage', component: PermissionApprovalPage },
      
    ],
  }
];

// ?????????????????????????????????
const excludeRouterName = ['Login', 'CrowdAuthToken', 'ReviewDetailError'];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  Vue.prototype.beforeEnter$.next({
    to,
    from
  });
  if(!excludeRouterName.includes(to.name)) {
    const userService: UserService = Vue.prototype.$user;
    if (!userService.hasValidToken()) {
      message.warn('????????????');
      next({ name: "ReviewDetailError" });
      //next({ name: "Login" });
    }else{
      // ???????????????
      if(userService.getMe().roles.length <= 0) {
        next({ name: "ReviewDetailError" });
      }else{
        next();
      }
    }
  }else{
    next();
  }
});

export default router;
