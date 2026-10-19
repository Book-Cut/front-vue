<template>
  <div
    class="d-flex min-vh-100 align-items-center justify-content-center bg-body-secondary p-4"
  >
    <form class="w-100" style="max-width: 420px" @submit.prevent="cambiar">
      <h1 class="fs-3 text-center mb-4">Nueva contraseña</h1>
      <label class="form-label small fw-bold">Nueva contraseña</label>
      <input
        v-model="pass"
        type="password"
        minlength="6"
        class="form-control border-dark mb-3"
        required
      />
      <label class="form-label small fw-bold">Confirmar contraseña</label>
      <input
        v-model="pass2"
        type="password"
        minlength="6"
        class="form-control border-dark mb-3"
        required
      />
      <p v-if="mensaje" :class="ok ? 'text-success' : 'text-danger'">
        {{ mensaje }}
      </p>
      <button class="btn btn-light border-dark w-100" :disabled="cargando">
        {{ cargando ? "Guardando..." : "CAMBIAR CONTRASEÑA" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const route = useRoute(),
  router = useRouter();
const pass = ref(""),
  pass2 = ref(""),
  mensaje = ref(""),
  ok = ref(false),
  cargando = ref(false);

async function cambiar() {
  if (pass.value !== pass2.value) {
    ok.value = false;
    mensaje.value = "Las contraseñas no coinciden";
    return;
  }
  cargando.value = true;
  try {
    const r = await fetch(`${API}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        correo: route.query.correo,
        token: route.query.token,
        contrasenha: pass.value,
        contrasenha_confirmation: pass2.value,
      }),
    });
    const data = await r.json();
    ok.value = r.ok;
    mensaje.value = data.message || "Error";
    if (r.ok) setTimeout(() => router.push("/login"), 1500);
  } catch {
    ok.value = false;
    mensaje.value = "Error de conexion";
  } finally {
    cargando.value = false;
  }
}
</script>
