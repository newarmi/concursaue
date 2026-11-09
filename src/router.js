import { createRouter, createWebHashHistory } from 'vue-router';
import { hasToken } from './api.js';

const routes = [
  { path: '/', name: 'welcome', component: () => import('./pages/WelcomePage.vue'), meta: { title: 'Главная' } },
  { path: '/leadAdded', name: 'leadAdded', component: () => import('./pages/LeadAdded.vue'), meta: { title: 'Заявка на вступление' } },
  { path: '/couponAdded', name: 'couponAdded', component: () => import('./pages/CouponAdded.vue'), meta: { title: 'Заявка на вступление' } },
  { path: '/success', name: 'success', component: () => import('./pages/Success.vue'), meta: { title: 'Заявка создана' } },
  { path: '/admin', name: 'adminLogin', component: () => import('./pages/AdminLogin.vue'), meta: { title: 'Вход' } },
  { path: '/raffleConfig', name: 'raffleConfig', component: () => import('./pages/ConfigRaffle.vue'), meta: { title: 'Конфигурация розыгрыша', admin: true } },
  { path: '/organizer', name: 'organizer', component: () => import('./pages/PageOrganizer.vue'), meta: { title: 'Информация о розыгрыше', admin: true } },
  { path: '/winners', name: 'winners', component: () => import('./pages/PageWinners.vue'), meta: { title: 'Победители', admin: true } },
  { path: '/raffleAdmin', name: 'raffleAdmin', component: () => import('./pages/RaffleAdmin.vue'), meta: { title: 'Панель управления розыгрышем', admin: true } },
  { path: '/raffle', name: 'raffle', component: () => import('./pages/Raffle.vue'), meta: { title: 'Розыгрыш' } },
  { path: '/raffleDemo', name: 'raffleDemo', component: () => import('./pages/RaffleDemo.vue'), meta: { title: 'Demo розыгрыша' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.admin && !hasToken()) {
    return { name: 'adminLogin', query: { redirect: to.fullPath } };
  }
  return true;
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} — VkusWill` : 'VkusWill';
});
