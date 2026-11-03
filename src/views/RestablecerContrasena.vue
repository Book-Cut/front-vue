<template>
  <main class="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light p-4">
    <RouterLink to="/" class="text-dark text-decoration-none fw-bold fs-3 mb-4">
      Book&Cut
    </RouterLink>

    <section class="row justify-content-center w-100">
      <div class="col-12 col-sm-9 col-md-7 col-lg-5 col-xl-4">
        <div class="card bg-white border-0 shadow-sm rounded-4">
          <form class="card-body p-4 p-md-5" @submit.prevent="cambiar">
            <h1 class="fs-4 fw-bold text-dark mb-2">Nueva contraseña</h1>
            <p class="text-muted small mb-4">
              Elige una contraseña nueva para volver a ingresar a tu cuenta.
            </p>

            <div v-if="!enlaceValido" class="alert alert-danger" role="alert">
              El enlace de recuperación no es válido. Solicita uno nuevo desde Inicio de Sesión.
            </div>
            <template v-else>
              <div class="mb-3">
                <label for="nueva-contrasenha" class="form-label text-muted small text-uppercase fw-bold mb-1">
                  Nueva contraseña
                </label>
                <input
                  id="nueva-contrasenha"
                  v-model="pass"
                  type="password"
                  minlength="6"
                  autocomplete="new-password"
                  class="form-control bg-light border-0 px-3 py-2 rounded-3 shadow-none"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="confirmar-contrasenha" class="form-label text-muted small text-uppercase fw-bold mb-1">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmar-contrasenha"
                  v-model="pass2"
                  type="password"
                  minlength="6"
                  autocomplete="new-password"
                  class="form-control bg-light border-0 px-3 py-2 rounded-3 shadow-none"
                  required
                />
              </div>
            </template>

            <p v-if="mensaje" :class="ok ? 'text-success' : 'text-danger'" role="status">
              {{ mensaje }}
            </p>
            <button
              v-if="enlaceValido"
              class="btn btn-dark btn-lg w-100 mt-2 rounded-pill"
              :disabled="cargando"
            >
              {{ cargando ? "Guardando..." : "Cambiar contraseña" }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { cambiarContrasenha } from "../services/auth.service";
const route = useRoute(),
  router = useRouter();
const pass = ref(""),
  pass2 = ref(""),
  mensaje = ref(""),
  ok = ref(false),
  cargando = ref(false);
const enlaceValido = computed(() =>
  typeof route.query.correo === "string"
  && typeof route.query.token === "string"
  && Boolean(route.query.correo)
  && Boolean(route.query.token),
);

async function cambiar() {
  if (pass.value !== pass2.value) {
    ok.value = false;
    mensaje.value = "Las contraseñas no coinciden";
    return;
  }
  cargando.value = true;
  try {
    const respuesta = await cambiarContrasenha(
      route.query.correo,
      route.query.token,
      pass.value,
      pass2.value,
    );
    ok.value = true;
    mensaje.value = respuesta.message || "Contraseña actualizada correctamente.";
    setTimeout(() => router.push("/login"), 2000);
  } catch (error) {
    ok.value = false;
    mensaje.value = error instanceof Error ? error.message : "No se pudo cambiar la contraseña.";
  } finally {
    cargando.value = false;
  }
}
</script>
