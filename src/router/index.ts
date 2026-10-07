import { createRouter, createWebHistory } from "vue-router";
import PantallaInicio from "../views/PantallaInicio.vue";
import RegistroView from "../components/RegistroView.vue";
import PantallaLogin from "../views/PantallaLogin.vue";
import DetalleServicio from "../views/DetalleServicio.vue";
import AgendarServicio from "../views/AgendarServicio.vue";

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
      path: "/login",
      name: "login",
      component: PantallaLogin,
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

export default router;
