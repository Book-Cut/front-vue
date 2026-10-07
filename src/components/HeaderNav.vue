<template>
  <nav class="navbar bg-dark p-4">
    <div class="container-fluid">
      <div class="d-flex align-items-center gap-3">
        <RouterLink to="/">
          <img src="../assets/output-onlinepngtools.png" alt="Book&Cut" width="150" />
        </RouterLink>
        <div v-if="!isAdmin" class="d-flex align-items-center gap-3">
          <a class="btn btn-outline-light" href="#servicios">Servicios</a>
          <a class="btn btn-outline-light" href="#locales">Locales</a>
        </div>
      </div>

      <div v-if="isAdmin" class="d-flex gap-3">
        <button @click="cerrarSesion" class="btn btn-danger">
          Cerrar Sesión
        </button>
      </div>

      <div v-else-if="!authStore.user" class="d-flex gap-3">
        <RouterLink to="/login" class="btn btn-outline-light">
          Iniciar Sesión
        </RouterLink>
        <RouterLink class="btn btn-outline-light" to="/registro">
          Registrarse
        </RouterLink>
      </div>

      <div v-else class="d-flex gap-3 align-items-center">
        <span class="text-light fw-bold">
          Hola, {{ authStore.user.name || "Usuario" }}
        </span>
        <button @click="cerrarSesion" class="btn btn-danger">
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


function cerrarSesion() {
  authStore.logout();
  router.push("/login");
}
</script>