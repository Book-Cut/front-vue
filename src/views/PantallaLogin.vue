<template>
  <div class="d-flex min-vh-100">
    <div
      class="panel-formulario bg-body-secondary d-flex align-items-center justify-content-center p-4"
    >
      <form class="w-100" style="max-width: 420px" @submit.prevent="enviar">
        <img :src="logo" alt="Book&Cut" height="48" class="mb-2" />

        <h1 class="fs-2 fw-normal text-center mb-4">Inicio de Sesión</h1>

        <label for="correo" class="form-label small fw-bold"
          >Correo Electronico</label
        >
        <input
          id="correo"
          v-model="correo"
          type="email"
          autocomplete="email"
          class="form-control border-dark mb-3"
        />

        <label for="password" class="form-label small fw-bold"
          >Contraseña</label
        >
        <div class="input-group mb-1">
          <input
            id="password"
            v-model="password"
            :type="ocultarPassword ? 'password' : 'text'"
            autocomplete="current-password"
            class="form-control border-dark"
          />
          <button
            type="button"
            class="btn btn-outline-dark btn-sm"
            @click="ocultarPassword = !ocultarPassword"
          >
            {{ ocultarPassword ? "Mostrar" : "Ocultar" }}
          </button>
        </div>

        <a href="#" class="small link-primary" @click.prevent
          >¿Olvidaste tu contraseña?</a
        >

        <p v-if="mensajeError" class="text-danger mt-3 mb-0">
          {{ mensajeError }}
        </p>

        <button
          type="submit"
          class="btn btn-light border-dark w-100 mt-4"
          :disabled="cargando"
        >
          {{ cargando ? "Cargando..." : "INICIAR SESION" }}
        </button>

        <p class="small mt-3 mb-3">
          ¿No tienes una cuenta?
          <a href="#" class="link-primary" @click.prevent>Registrarse ahora</a>
        </p>

        <RouterLink to="/" class="btn btn-outline-dark btn-sm"
          >atras</RouterLink
        >
      </form>
    </div>

    <div
      class="foto d-none d-md-block flex-grow-1"
      :style="{ backgroundImage: `url(${fotoBarberia})` }"
    ></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import logo from "../assets/logo sin fondo.png";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const correo = ref("");
const password = ref("");
const ocultarPassword = ref(true);  
const cargando = ref(false);
const mensajeError = ref("");

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

  try {
    const url = `${import.meta.env.VITE_API_URL}/login`;
    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: correoLimpio,
        password: password.value,
      }),
    });

    if (!respuesta.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await respuesta.json();
    const rol = data.rol;

    cargando.value = false;

    if (!rol) {
      mensajeError.value = "Correo o contraseña incorrectos";
      return;
    }

    authStore.setRol(rol);
    alert("Bienvenido (" + rol + ")");
    router.push("/");
  } catch (error) {
    cargando.value = false;
    mensajeError.value = "Ocurrió un error al iniciar sesión";
    console.error(error);
  }

  cargando.value = true;
  mensajeError.value = "";

  const rol = await iniciarSesion(correoLimpio, password.value);

  cargando.value = false;

  if (rol === null) {
    mensajeError.value = "Correo o contraseña incorrectos";
    return;
  }

  alert("Bienvenido (" + rol + ")");
  router.push("/");
}
</script>
