import { createRouter, createWebHistory } from 'vue-router'
import { useHandshakerStore } from '@/stores/useHandshakerStore'
import WelcomeView from '@/views/WelcomeView.vue'
import IndexView from '@/views/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: WelcomeView
    },
    {
      path: '/',
      name: 'Index',
      component: IndexView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const handshakerStore = useHandshakerStore()

  if (!handshakerStore.connectionInfo.isConnected) {
    if (to.name !== 'Welcome') {
      next({ name: 'Welcome' })
      return
    }
  }

  next()
})

export default router
