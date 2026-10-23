<template>
  <nav class="navbar bg-navbar shadow-sm px-3 px-lg-5 py-3">
    <div class="container-fluid flex-wrap gap-3">
      <div class="d-flex align-items-center gap-3 flex-wrap">
        <RouterLink :to="esBarbero ? '/barbero' : '/'">
          <img :src="logo" alt="Book&Cut" width="190" class="img-fluid" />
        </RouterLink>
        <div v-if="!isAdmin && !esBarbero" class="d-flex align-items-center gap-3">
          <a class="link-light link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold" href="#servicios">Servicios</a>
          <a class="link-light link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold" href="#locales">Locales</a>
        </div>
      </div>

      <div v-if="isAdmin" class="d-flex gap-3">
        <RouterLink to="/admin" class="btn btn-outline-light">
          Mi panel
        </RouterLink>
        <RouterLink to="/perfil" class="btn btn-outline-light">
          Mi perfil
        </RouterLink>
        <button @click="cerrarSesion" class="btn btn-outline-light">
          Cerrar Sesión
        </button>
      </div>
      <!-- nuevo if para condicion para validar si estiene una sesion abierta -->
      <div v-else-if="!authStore.user" class="d-flex flex-wrap gap-2">
        <RouterLink to="/login" class="btn btn-outline-light">
          Iniciar Sesión
        </RouterLink>
        <RouterLink class="btn btn-carmine rounded-pill shadow-sm fw-semibold" to="/agendar-servicio">
          Reservar cita
        </RouterLink>
        <RouterLink class="btn btn-outline-light" to="/registro">
          Registrarse
        </RouterLink>
      </div>

      <div v-else class="d-flex flex-wrap gap-2 align-items-center">
        <span class="text-light fw-bold">
          Hola,
          {{
            authStore.user?.name ||
            authStore.user?.nombre ||
            authStore.user?.Nombre ||
            "Usuario"
          }}
        </span>
        <RouterLink v-if="!esBarbero" to="/agendar-servicio" class="btn btn-carmine rounded-pill shadow-sm fw-semibold">
          Reservar cita
        </RouterLink>
        <RouterLink v-if="!esBarbero" to="/mis-citas" class="btn btn-outline-light">
          Mis citas
        </RouterLink>
        <RouterLink to="/perfil" class="btn btn-outline-light">
          Mi perfil
        </RouterLink>
        <button @click="cerrarSesion" class="btn btn-outline-light">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
const logo = "/logo_blanca.png";

const props = defineProps({
  adminPage: {
    type: Boolean,
    default: false,
  },
});

const authStore = useAuthStore();
const router = useRouter();
const isAdmin = computed(
  () => props.adminPage || Number(authStore.user?.Roles_IDRol) === 1,
);
const esBarbero = computed(() => Number(authStore.user?.Roles_IDRol) === 2);

function cerrarSesion() {
  authStore.logout();
  router.push("/login");
}
</script>
