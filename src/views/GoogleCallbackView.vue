<template>
  <main class="container min-vh-100 d-flex align-items-center justify-content-center py-5">
    <section v-if="signupToken" class="w-100" style="max-width: 520px">
      <h1 class="h3 fw-bold mb-2">Completa tu registro en Book&Cut</h1>
      <p class="text-muted mb-4">
        No encontramos una cuenta con este correo. Acepta las condiciones para crearla; el teléfono es opcional por ahora.
      </p>
      <form @submit.prevent="crearCuenta">
        <label for="google-signup-phone" class="form-label">Teléfono (opcional)</label>
        <input
          id="google-signup-phone"
          v-model.trim="telefono"
          class="form-control mb-3"
          type="tel"
          autocomplete="tel"
          maxlength="45"
        />
        <div class="form-check mb-3">
          <input id="google-signup-terms" v-model="terminosAceptados" class="form-check-input" type="checkbox" />
          <label class="form-check-label" for="google-signup-terms">
            Acepto las
            <a href="./condiciones-servicio.html" target="_blank" rel="noopener">condiciones del servicio</a>
            y la
            <a href="./politica-privacidad.html" target="_blank" rel="noopener">política de privacidad</a>.
          </label>
        </div>
        <p v-if="errorRegistro" class="alert alert-danger py-2" role="alert">{{ errorRegistro }}</p>
        <button class="btn btn-dark w-100" type="submit" :disabled="enviando || !terminosAceptados">
          {{ enviando ? "Creando cuenta..." : "Aceptar y crear cuenta" }}
        </button>
      </form>
    </section>
    <div v-else class="text-center" role="status" aria-live="polite">
      <h1 class="h4 mb-2">{{ mensaje }}</h1>
      <p class="text-muted mb-0">Espera un momento.</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { guardarSesion } from "../auth";
import { canjearCodigoSocial, completarRegistroGoogle } from "../services/auth.service";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const mensaje = ref("Conectando con Google...");
const signupToken = ref("");
const telefono = ref("");
const terminosAceptados = ref(false);
const enviando = ref(false);
const errorRegistro = ref("");

async function finalizarInicioSesion(code: string) {
  const data = await canjearCodigoSocial(code);
  authStore.login(data.user, data.token);
  guardarSesion(data.token, data.user.Nombre);
  localStorage.setItem("user", JSON.stringify(data.user));

  if (!data.user.telefono) {
    sessionStorage.removeItem("social_destino");
    await router.replace({ path: "/perfil", query: { completar: "telefono" } });
    return;
  }

  const destino = sessionStorage.getItem("social_destino") ?? "";
  sessionStorage.removeItem("social_destino");
  if (destino.startsWith("/") && !destino.startsWith("//")) {
    await router.replace(destino);
    return;
  }

  const idRol = Number(data.user.Roles_IDRol);
  await router.replace(idRol === 1 ? "/admin" : idRol === 2 ? "/barbero" : "/");
}

async function crearCuenta() {
  if (!signupToken.value || !terminosAceptados.value || enviando.value) return;

  const phone = telefono.value.trim();
  if (phone && !/^\d{7,15}$/.test(phone)) {
    errorRegistro.value = "Ingresa un teléfono válido o deja el campo vacío para añadirlo luego en tu perfil.";
    return;
  }

  enviando.value = true;
  errorRegistro.value = "";
  try {
    const respuesta = await completarRegistroGoogle(signupToken.value, phone || null);
    await finalizarInicioSesion(respuesta.code);
  } catch (error) {
    errorRegistro.value = error instanceof Error
      ? error.message
      : "No se pudo crear la cuenta. Inténtalo otra vez.";
  } finally {
    enviando.value = false;
  }
}

onMounted(async () => {
  const pendingSignup = route.query.signup_token;
  if (typeof pendingSignup === "string" && pendingSignup) {
    signupToken.value = pendingSignup;
    await router.replace({ path: "/auth/google/callback" });
    return;
  }

  const error = route.query.error;
  if (typeof error === "string") {
    await router.replace({ name: "login", query: { oauth_error: error } });
    return;
  }

  const code = route.query.code;
  if (typeof code !== "string" || !code) {
    await router.replace({ name: "login", query: { oauth_error: "exchange_failed" } });
    return;
  }

  try {
    await finalizarInicioSesion(code);
  } catch {
    mensaje.value = "No se pudo completar el inicio de sesión.";
    await router.replace({ name: "login", query: { oauth_error: "exchange_failed" } });
  }
});
</script>