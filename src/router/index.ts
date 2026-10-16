import { createRouter, createWebHistory } from "vue-router";
import PantallaInicio from "../views/PantallaInicio.vue";
import RegistroView from "../views/RegistroView.vue";
import PantallaLogin from "../views/PantallaLogin.vue";
import AdminView from "../views/admin.vue";
import DetalleServicio from "../views/DetalleServicio.vue";
import PerfilView from "../views/PerfilView.vue";
import Verificar from "../views/Verificar.vue";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "inicio",
      component: PantallaInicio,
    },
    {
      path: "/registro",
      name: "register",
      component: RegistroView,
    },
    {
      path: '/login',
      name: 'login',
      component: PantallaLogin,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiereSesion: true, rolRequerido: 1 },
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilView,
      meta: { requiereSesion: true },
    },
    {
      path: '/mis-citas',
      name: 'mis-citas',
      component: () => import('../views/MisCitasView.vue'),
      meta: { requiereSesion: true },
    },
    {
      path: "/servicios/:id",
      name: "DetalleServicio",
      component: DetalleServicio,
      props: true,
    },
    {
      path: "/agendar-servicio",
      name: "AgendarServicio",
      component: () => import("../views/AgendarServicio.vue"),
      meta: { requiereSesion: true },
    },
    {
      path: '/auth/verificar',
      component: Verificar,
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiereSesion && !authStore.token) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (
    to.meta.rolRequerido &&
    Number(authStore.user?.Roles_IDRol) !== Number(to.meta.rolRequerido)
  ) {
    return { name: "inicio" };
  }
});

export default router
