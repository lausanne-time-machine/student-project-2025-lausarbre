/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import GenealogyTree from '@/pages/GenealogyTree.vue'
import Presentation from '@/pages/Presentation.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '/Presentation',
    component: Presentation,
  },
  {
    path: '/HomePage',
    name: '/HomePage',
    component: HomePage,
  },
  {
    path: '/genealogy-tree/:id',
    name: '/GenealogyTree',
    component: GenealogyTree,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
