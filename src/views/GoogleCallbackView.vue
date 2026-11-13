<template>
  <main class="container min-vh-100 d-flex align-items-center justify-content-center py-5">
    <div class="text-center" role="status" aria-live="polite">
      <h1 class="h4 mb-2">{{ mensaje }}</h1>
      <p class="text-muted mb-0">Espera un momento.</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { guardarSesion } from "../auth";
import { canjearCodigoSocial } from "../services/auth.service";
import { useAuthStore } from "../stores/auth";


const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const mensaje = ref("Conectando con Google...");

onMounted(async () => {
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
  } catch {
    mensaje.value = "No se pudo completar el inicio de sesión.";
    await router.replace({ name: "login", query: { oauth_error: "exchange_failed" } });
  }
});
</script>