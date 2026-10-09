import { createRouter, createWebHistory } from "vue-router";
import PantallaInicio from "../views/PantallaInicio.vue";
import RegistroView from "../components/RegistroView.vue";
import PantallaLogin from "../views/PantallaLogin.vue";
import AdminView from "../views/admin.vue";
import DetalleServicio from "../views/DetalleServicio.vue";
<<<<<<< HEAD
=======
import AgendarServicio from "../views/AgendarServicio.vue";
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141

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
      name: "registro",
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
    },
  ],
});

export default router
