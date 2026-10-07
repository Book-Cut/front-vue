import { createRouter, createWebHistory } from 'vue-router'
import PantallaInicio from '../views/PantallaInicio.vue'
import PantallaLogin from '../views/PantallaLogin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: PantallaInicio,
    },
    {
      path: '/login',
      name: 'login',
      component: PantallaLogin,
    },
  ],
})

export default router
