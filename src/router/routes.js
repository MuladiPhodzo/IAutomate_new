import RobotDetailsPage from 'pages/RobotDetailsPage.vue'
import NewRobotPage from 'pages/NewRobotPage.vue'
import LoginPage from 'pages/LoginPage.vue'
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },

  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Homepage.vue') }
    ]
  },
  {
    path: '/market',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MarketPlacePage.vue') }
    ]
  },
  {
    path: '/charts',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ChartsPage.vue') }
    ]
  },
  {
    path: '/warehouse',
     component: () => import('pages/WarehousePage.vue') 
  },
  {
    path: '/hubs',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HubsPage.vue') }
    ]
  },
  {
    path: '/settings',
     component: () => import('pages/SettingsPage.vue') 
  },
  {
    path: '/warehouse/robot/new',
     component: NewRobotPage 
  },
  {
    path: '/warehouse/robot/:id',
     component: RobotDetailsPage 
  },
  {
    path: '/warehouse/robotsettings',
     component: () => import('pages/RobotSearchPage.vue') 
  },
  {
    path: '/warehouse/robot/edit/:id',
     component:() => import('pages/editRobotPage.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default routes
