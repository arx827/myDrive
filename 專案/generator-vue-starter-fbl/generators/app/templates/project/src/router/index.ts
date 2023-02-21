import Vue from 'vue'
import VueRouter, { Route } from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import ProductSpecPage from '@/pages/ProductSpecPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import RolePage from '@/pages/RolePage.vue'
import { UserService } from '@/plugins/user'
import { message } from 'ant-design-vue'
import { BehaviorSubject, Subject } from 'rxjs'


Vue.use(VueRouter)
Vue.prototype.beforeEnter$ = new BehaviorSubject<{ to: Route, from: Route }>(null);
const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  {
    path: '/', name: 'Main', component: MainPage,
    children: [
      { path: 'product', name: 'Product', component: ProductPage },
      { path: 'role', name: 'Role', component: RolePage },
      { path: 'product-spec', name: 'ProductSpec', component: ProductSpecPage }
    ],
    beforeEnter(to, from, next) {
      const userService: UserService = Vue.prototype.$user;
      if (!userService.hasValidToken()) {
        message.warn('尚未登入');
        next({ name: "Login" });
      } else {
        next();
      }
    },
  }
];



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
  next();
});

export default router;
