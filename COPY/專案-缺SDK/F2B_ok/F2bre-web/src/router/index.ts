import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '@pages/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@pages/MainPage.vue'),
      children: [
        {
          path: '/audit',
          name: 'AuditPage',
          component: () => import('@pages/AuditPage.vue'),
        },
      ]
    },
    
  ],
});

export default router;
