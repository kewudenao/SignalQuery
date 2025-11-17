import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: '首页',
      breadcrumb: ['首页']
    }
  },
  {
    path: '/data-list',
    name: 'DataList',
    component: () => import('@/views/DataList/index.vue'),
    meta: {
      title: '数据管理',
      breadcrumb: ['数据管理']
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

