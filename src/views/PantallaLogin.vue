<template>
  <main class="container-fluid p-0">
    <div class="row min-vh-100 m-0">
      <section class="col-12 col-lg-5 d-flex flex-column justify-content-center px-4 px-md-5 bg-white">
        <div class="w-100 mx-auto" style="max-width: 450px;">
          <div class="text-center text-lg-start mb-4">
            <RouterLink to="/" class="bc-brand text-decoration-none fs-3">
              Book<span>&amp;</span>Cut
            </RouterLink>
            <h1 class="display-6 text-dark mt-4 mb-1">Inicia sesión</h1>
            <p class="text-muted mb-0">Ingresa a tu cuenta para gestionar tus citas.</p>
          </div>

          <div v-if="route.query.redirect" class="alert alert-info py-2 small">
            Crea una cuenta o inicia sesión para reservar y gestionar tus citas.
          </div>
          <div
            v-if="route.query.sesion === 'expirada'"
            class="alert alert-warning py-2 small"
            role="alert"
          >
            Tu sesión se cerró porque iniciaste sesión en otro dispositivo. Inicia sesión de nuevo para continuar.
          </div>
          <div v-if="falloSocial" class="alert alert-danger py-2 small" role="alert">
            <template v-if="route.query.oauth_error === 'account_not_found'">
              No encontramos una cuenta con ese correo de Google.
              <RouterLink to="/registro">Regístrate con Google</RouterLink> para crearla.
            </template>
            <template v-else>{{ falloSocial }}</template>
          </div>

          <form @submit.prevent="enviar">
            <div class="mb-3">
              <label for="correo" class="form-label mb-1">
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
              <label for="password" class="form-label mb-1">
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
              class="btn btn-danger btn-lg w-100 mt-3"
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
            class="btn btn-light border text-dark w-100 mb-2"
            @click="loginSocial('google', destino)"
          >
            Continuar con Google
          </button>
          <p class="text-center small mt-4 mb-3">
            <span class="text-muted">¿No tienes una cuenta?</span>
            <RouterLink
              to="/registro"
              class="d-inline-block p-2 text-danger text-decoration-none fw-bold"
            >
              Registrarse ahora
            </RouterLink>
          </p>

          <div class="text-center">
            <RouterLink to="/" class="text-decoration-none text-muted small">
              Atrás
            </RouterLink>
            <p class="small mt-3 mb-0">
              <a href="./politica-privacidad.html">Privacidad</a>
              <span class="mx-2">·</span>
              <a href="./condiciones-servicio.html">Condiciones</a>
            </p>
          </div>
        </div>
      </section>

      <AuthAside />
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
              <label for="correo-recuperacion" class="form-label mb-1">
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
                class="btn btn-danger btn-lg w-100"
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
import { computed, ref } from "vue";
import AuthAside from "../components/AuthAside.vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { login, solicitarRecuperacionContrasenha } from "../services/auth.service";
import { guardarSesion, loginSocial } from "../auth";

const router = useRouter();
const authStore = useAuthStore();
const route = useRoute();
const logoUrl = `${import.meta.env.BASE_URL}logo_blanca.png`;

const destino = route.query.redirect || "";
const falloSocial = computed(() => {
  const error = route.query.oauth_error;
  if (typeof error !== "string") return "";

  const mensajes = {
    provider_not_configured: "El acceso con Google no está configurado en el servidor.",
    invalid_state: "La solicitud de Google expiró. Inténtalo de nuevo.",
    cancelled: "Cancelaste el inicio de sesión con Google.",
    provider_error: "Google no pudo completar la autenticación. Inténtalo de nuevo.",
    account_not_found: "No encontramos una cuenta con ese correo de Google.",
    registration_expired: "El registro expiró. Vuelve a registrarte con Google.",
    email_domain_not_allowed: "Usa una cuenta Gmail, Hotmail, Outlook o sena.edu.co.",
    email_unverified: "Verifica tu correo de Google antes de continuar.",
    email_unavailable: "Google no compartió un correo válido.",
    exchange_failed: "No se pudo completar el inicio de sesión. Inténtalo otra vez.",
  };

  return mensajes[error] ?? "No se pudo iniciar sesión con Google. Inténtalo de nuevo.";
});

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
