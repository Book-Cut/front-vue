<template>
  <nav class="navbar navbar-expand-lg bg-navbar shadow-sm px-3 px-lg-5 py-3">
    <div class="container-fluid">
      <RouterLink class="navbar-brand me-0" :to="esBarbero ? '/barbero' : '/'">
        <img :src="logo" alt="Book&Cut" width="190" class="img-fluid" />
      </RouterLink>

      <button
        class="navbar-toggler border-light"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navegacionBookCut"
        aria-controls="navegacionBookCut"
        aria-expanded="false"
        aria-label="Abrir menú de navegación"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navegacionBookCut" class="collapse navbar-collapse">
        <ul v-if="!isAdmin && !esBarbero" class="navbar-nav me-auto ms-lg-4 mb-2 mb-lg-0 gap-lg-2">
          <li class="nav-item">
            <a class="nav-link text-white fw-medium px-3" href="#servicios">Servicios</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white fw-medium px-3" href="#locales">Locales</a>
          </li>
        </ul>

        <div v-if="!authStore.user" class="d-flex flex-column flex-lg-row align-items-lg-center gap-2 ms-lg-auto">
          <RouterLink to="/login" class="btn btn-outline-light">
            Iniciar Sesión
          </RouterLink>
          <RouterLink class="btn btn-danger rounded-pill px-4 fw-bold" to="/agendar-servicio">
            Reservar cita
          </RouterLink>
          <RouterLink class="btn btn-outline-light" to="/registro">
            Registrarse
          </RouterLink>
        </div>

        <div v-else class="d-flex align-items-center gap-3 gap-md-4 ms-lg-auto">
          <RouterLink
            v-if="!esBarbero"
            to="/agendar-servicio"
            class="btn btn-danger rounded-pill px-4 fw-bold text-nowrap shadow-sm"
          >
            Reservar cita
          </RouterLink>

          <div class="dropdown">
            <a
              class="nav-link dropdown-toggle text-white fw-semibold"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click.prevent
            >
              Hola, {{ primerNombre }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 p-2 mt-2">
              <li v-if="isAdmin">
                <RouterLink to="/admin" class="dropdown-item rounded-3 py-2 fw-medium text-dark">
                  Mi panel
                </RouterLink>
              </li>
              <li v-if="!esBarbero && !isAdmin">
                <RouterLink to="/mis-citas" class="dropdown-item rounded-3 py-2 fw-medium text-dark">
                  Mis citas
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/perfil" class="dropdown-item rounded-3 py-2 fw-medium text-dark">
                  Mi perfil
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider border-secondary-subtle my-2"></li>
              <li>
                <button
                  type="button"
                  class="dropdown-item rounded-3 py-2 fw-medium text-danger"
                  @click="cerrarSesion"
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
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
const primerNombre = computed(() => {
  const nombre = authStore.user?.name || authStore.user?.nombre || authStore.user?.Nombre || "Usuario";
  return nombre.trim().split(/\s+/)[0] || "Usuario";
});

function cerrarSesion() {
  authStore.logout();
  router.push("/login");
}
</script>
