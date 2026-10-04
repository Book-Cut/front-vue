import { createRouter, createWebHistory } from 'vue-router'
import PantallaInicio from '../views/PantallaInicio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: PantallaInicio,
    },
  ],
})

export default router
