import { createRouter, createWebHistory } from 'vue-router'
import PlayerBoard from '../views/PlayerBoard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'player-board',
      component: PlayerBoard
    }
  ]
})

export default router
