<template>
  <nav class="navbar bg-dark p-4">
    <div class="container-fluid">
      <div class="d-flex align-items-center gap-3">
        <RouterLink to="/">
          <img
            src="../assets/output-onlinepngtools.png"
            alt="Book&Cut"
            width="150"
          />
        </RouterLink>
        <a class="btn btn-outline-light" href="#servicios">Servicios</a>
        <a class="btn btn-outline-light" href="#locales">Locales</a>
      </div>

      <!-- Si NO hay usuario logueado, muestra Login/Registro -->
      <div v-if="!authStore.user" class="d-flex gap-3">
        <RouterLink to="/login" class="btn btn-outline-light"
          >Iniciar Sesión</RouterLink
        >
        <a class="btn btn-outline-light" href="#registrarse">Registrarse</a>
      </div>

      <!-- Si SÍ hay usuario logueado, muestra opciones de usuario (Ej. Cerrar sesión) -->
      <div v-else class="d-flex gap-3 align-items-center">
        <span class="text-light fw-bold"
          >Hola, {{ authStore.user.name || "Usuario" }}</span
        >
        <button @click="cerrarSesion" class="btn btn-danger">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

// Opcional: Función para cerrar sesión si tu store tiene una acción logout()
function cerrarSesion() {
  authStore.logout(); // Asegúrate de tener este método en tu archivo auth.js
  router.push("/login");
}
</script>
