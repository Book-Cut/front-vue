<template>
  <main class="container-fluid p-0">
    <div class="row min-vh-100 m-0">
      <section class="col-12 col-lg-5 d-flex flex-column justify-content-center px-4 px-md-5 bg-white">
        <div class="w-100 mx-auto" style="max-width: 450px;">
          <div class="text-center text-lg-start mb-4">
            <RouterLink to="/" class="text-dark text-decoration-none fs-3 fw-bold">
              Book&Cut
            </RouterLink>
            <h1 class="fw-bold display-6 text-dark mt-4 mb-1">Inicio de Sesión</h1>
            <p class="text-muted mb-0">Ingresa a tu cuenta para gestionar tus citas.</p>
          </div>

          <div v-if="route.query.redirect" class="alert alert-info py-2 small">
            Crea una cuenta o inicia sesión para reservar y gestionar tus citas.
          </div>
          <div v-if="falloSocial" class="alert alert-danger py-2 small">
            No se pudo iniciar sesión, intenta de nuevo.
          </div>

          <form @submit.prevent="enviar">
            <div class="mb-3">
              <label for="correo" class="form-label text-muted small text-uppercase fw-bold mb-1">
                Correo electrónico
              </label>
              <input
                id="correo"
                v-model="correo"
                type="email"
                autocomplete="email"
                class="form-control bg-light border-0 px-3 py-2 rounded-3 shadow-none"
                required
              />
            </div>

            <div class="mb-2">
              <label for="password" class="form-label text-muted small text-uppercase fw-bold mb-1">
                Contraseña
              </label>
              <div class="input-group">
                <input
                  id="password"
                  v-model="password"
                  :type="ocultarPassword ? 'password' : 'text'"
                  autocomplete="current-password"
                  class="form-control bg-light border-0 px-3 py-2 rounded-start-3 shadow-none"
                  required
                />
                <button
                  type="button"
                  class="btn text-muted small text-decoration-none bg-light border-0 rounded-end-3"
                  @click="ocultarPassword = !ocultarPassword"
                >
                  {{ ocultarPassword ? "Mostrar" : "Ocultar" }}
                </button>
              </div>
            </div>

            <div class="text-end mb-3">
              <a
                href="#recuperar-contrasenha"
                class="text-decoration-none text-muted small"
                data-bs-toggle="modal"
                data-bs-target="#modal-recuperar-contrasenha"
                @click="correoRecuperacion = correo.trim()"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <p v-if="mensajeError" class="text-danger small mt-3 mb-0" role="alert">
              {{ mensajeError }}
            </p>

            <button
              type="submit"
              class="btn btn-dark btn-lg w-100 rounded-pill mt-3"
              :disabled="cargando"
            >
              {{ cargando ? "Cargando..." : "Iniciar sesión" }}
            </button>
          </form>

          <div class="d-flex align-items-center text-muted small my-3">
            <hr class="flex-grow-1" />
            <span class="mx-3">o</span>
            <hr class="flex-grow-1" />
          </div>

          <button
            type="button"
            class="btn btn-light border text-dark w-100 rounded-pill mb-2 shadow-sm fw-semibold"
            @click="loginSocial('google', destino)"
          >
            Continuar con Google
          </button>
          <button
            type="button"
            class="btn btn-light border text-dark w-100 rounded-pill mb-2 shadow-sm fw-semibold"
            @click="loginSocial('facebook', destino)"
          >
            Continuar con Facebook
          </button>

          <p class="text-center small mt-4 mb-3">
            <span class="text-muted">¿No tienes una cuenta?</span>
            <RouterLink
              to="/registro"
              class="d-inline-block p-2 text-dark text-decoration-none fw-bold border-bottom border-dark"
            >
              Registrarse ahora
            </RouterLink>
          </p>

          <div class="text-center">
            <RouterLink to="/" class="text-decoration-none text-muted small">
              Atrás
            </RouterLink>
          </div>
        </div>
      </section>

      <section
        class="col-12 col-lg-7 d-none d-lg-flex flex-column justify-content-center align-items-center"
        style="background-color: #0F172A;"
      >
        <img src="/logo_blanca.png" alt="Book&Cut" style="max-width: 250px;" class="mb-4 img-fluid" />
        <p class="fs-4 text-white-50 fw-light mb-0">Tu estilo, tu momento.</p>
      </section>
    </div>

    <div
      id="modal-recuperar-contrasenha"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="titulo-recuperar-contrasenha"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-white border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h2 id="titulo-recuperar-contrasenha" class="modal-title fw-bold text-dark fs-5">
              Recuperar contraseña
            </h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>

          <form @submit.prevent="enviarRecuperacion">
            <div class="modal-body">
              <p class="text-muted small mb-4">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              <label for="correo-recuperacion" class="form-label text-muted small text-uppercase fw-bold mb-1">
                Correo electrónico
              </label>
              <input
                id="correo-recuperacion"
                v-model.trim="correoRecuperacion"
                type="email"
                autocomplete="email"
                class="form-control bg-light border-0 px-3 py-2 rounded-3 shadow-none"
                required
              />
              <p v-if="mensajeRecuperacion" class="small mt-3 mb-0"
                :class="recuperacionExitosa ? 'text-success' : 'text-danger'"
                role="status"
              >
                {{ mensajeRecuperacion }}
              </p>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="submit"
                class="btn btn-dark btn-lg w-100 rounded-pill"
                :disabled="enviandoRecuperacion"
              >
                {{ enviandoRecuperacion ? "Enviando..." : "Enviar enlace de recuperación" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { login, solicitarRecuperacionContrasenha } from "../services/auth.service";
import { guardarSesion, loginSocial } from "../auth";

const router = useRouter();
const authStore = useAuthStore();
const route = useRoute();

const destino = route.query.redirect || "/agendar";
const falloSocial = route.hash.includes("error");

const correo = ref("");
const password = ref("");
const ocultarPassword = ref(true);
const cargando = ref(false);
const mensajeError = ref("");
const correoRecuperacion = ref("");
const enviandoRecuperacion = ref(false);
const recuperacionExitosa = ref(false);
const mensajeRecuperacion = ref("");

async function enviar() {
  const correoLimpio = correo.value.trim();

  if (correoLimpio === "" || password.value === "") {
    mensajeError.value = "Completa todos los campos";
    return;
  }
  if (!correoLimpio.includes("@")) {
    mensajeError.value = "Escribe un correo válido";
    return;
  }

  cargando.value = true;
  mensajeError.value = "";

  try {
    const data = await login(correoLimpio, password.value);
    authStore.login(data.user, data.token);
    guardarSesion(data.token, data.user.Nombre);

    localStorage.setItem("user", JSON.stringify(data.user));

    if (route.query.redirect) {
      router.push(destino);
    } else {
      const idRol = Number(data.user?.Roles_IDRol);

      if (idRol === 1) {
        router.push("/admin"); // Administrador
      } else if (idRol === 2) {
        router.push("/barbero"); // Barbero (Ajusta el 2 según el ID de tu BD)
      } else {
        router.push("/"); // Cliente normal
      }
    }
  } catch (error) {
    mensajeError.value = "El correo o la contraseña son incorrectos";
    console.error(error);
  } finally {
    cargando.value = false;
  }
}

async function enviarRecuperacion() {
  enviandoRecuperacion.value = true;
  mensajeRecuperacion.value = "";
  recuperacionExitosa.value = false;

  try {
    const respuesta = await solicitarRecuperacionContrasenha(correoRecuperacion.value);
    recuperacionExitosa.value = true;
    mensajeRecuperacion.value = respuesta.message;
  } catch (error) {
    mensajeRecuperacion.value = error instanceof Error
      ? error.message
      : "No se pudo enviar el enlace. Intenta de nuevo.";
  } finally {
    enviandoRecuperacion.value = false;
  }
}
</script>
