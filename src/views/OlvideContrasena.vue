<template>
  <div
    class="d-flex min-vh-100 align-items-center justify-content-center bg-body-secondary p-4"
  >
    <form class="w-100" style="max-width: 420px" @submit.prevent="enviar">
      <h1 class="fs-3 text-center mb-4">Recuperar contraseña</h1>
      <label for="correo" class="form-label small fw-bold"
        >Correo Electronico</label
      >
      <input
        id="correo"
        v-model="correo"
        type="email"
        class="form-control border-dark mb-3"
        required
      />
      <p v-if="mensaje" :class="ok ? 'text-success' : 'text-danger'">
        {{ mensaje }}
      </p>
      <button class="btn btn-light border-dark w-100" :disabled="cargando">
        {{ cargando ? "Enviando..." : "ENVIAR ENLACE" }}
      </button>
      <RouterLink to="/login" class="btn btn-outline-dark btn-sm mt-3"
        >atras</RouterLink
      >
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const correo = ref(""),
  mensaje = ref(""),
  ok = ref(false),
  cargando = ref(false);

async function enviar() {
  cargando.value = true;

  try {
    const r = await fetch(`${API}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: correo.value }),
    });
    ok.value = r.ok;
    mensaje.value = r.ok
      ? "Revisa tu correo para continuar"
      : "no se pudo enviar, intenta denuevo";
  } catch {
    ok.value = false;
    mensaje.value = "Error de conexion.";
  } finally {
    cargando.value = false;
  }
}
</script>
