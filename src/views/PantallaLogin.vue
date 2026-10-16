<template>
  <div class="d-flex min-vh-100">
    <div class="panel-formulario bg-body-secondary d-flex align-items-center justify-content-center p-4">

      <!-- Modo contraseña (el tuyo) -->
      <form class="w-100" style="max-width: 420px" @submit.prevent="enviar">
        <img :src="logo" alt="Book&Cut" height="48" class="mb-2" />

        <h1 class="fs-2 fw-normal text-center mb-4">Inicio de Sesión</h1>

        <!-- NUEVO: aviso al venir de "agendar" sin sesión -->
        <div v-if="route.query.redirect" class="alert alert-info py-2 small">
          Crea una cuenta o inicia sesión para reservar y gestionar tus citas.
        </div>
        <div v-if="falloSocial" class="alert alert-danger py-2 small">No se pudo iniciar sesión, intenta de nuevo.</div>

        <label for="correo" class="form-label small fw-bold">Correo Electronico</label>
        <input id="correo" v-model="correo" type="email" autocomplete="email" class="form-control border-dark mb-3" />

        <label for="password" class="form-label small fw-bold">Contraseña</label>
        <div class="input-group mb-1">
          <input id="password" v-model="password" :type="ocultarPassword ? 'password' : 'text'"
            autocomplete="current-password" class="form-control border-dark" />
          <button type="button" class="btn btn-outline-dark btn-sm" @click="ocultarPassword = !ocultarPassword">
            {{ ocultarPassword ? "Mostrar" : "Ocultar" }}
          </button>
        </div>

        <a href="#" class="small link-primary" @click.prevent>¿Olvidaste tu contraseña?</a>

        <p v-if="mensajeError" class="text-danger mt-3 mb-0">
          {{ mensajeError }}
        </p>

        <button type="submit" class="btn btn-light border-dark w-100 mt-4" :disabled="cargando">
          {{ cargando ? "Cargando..." : "INICIAR SESION" }}
        </button>

        <!-- NUEVO: otras formas de entrar -->
        <div class="d-flex align-items-center my-3">
          <hr class="flex-grow-1" />
          <span class="mx-2 text-secondary small">o</span>
          <hr class="flex-grow-1" />
        </div>
        <button type="button" class="btn btn-outline-dark w-100 mb-2" @click="loginSocial('google', destino)">
          <i class="bi bi-google text-danger me-2"></i>Continuar con Google
        </button>
        <button type="button" class="btn btn-outline-dark w-100 mb-2" @click="loginSocial('facebook', destino)">
          <i class="bi bi-facebook text-primary me-2"></i>Continuar con Facebook
        </button>

        <p class="small mt-3 mb-3">
          ¿No tienes una cuenta?
          <a href="#" class="link-primary" @click.prevent>Registrarse ahora</a>
        </p>

        <RouterLink to="/" class="btn btn-outline-dark btn-sm">atras</RouterLink>
      </form>

      <div class="foto d-none d-md-block flex-grow-1" :style="{ backgroundImage: `url(${logo})` }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { login } from "../services/auth.service";
import logo from "../assets/logo sin fondo.png";
import { guardarSesion, loginSocial } from '../auth'

const router = useRouter();
const authStore = useAuthStore();
const route = useRoute();

const destino = route.query.redirect || '/agendar-servicio'
const falloSocial = route.hash.includes('error');

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

  cargando.value = true;
  mensajeError.value = "";

  try {
    const data = await login(correoLimpio, password.value);
    authStore.login(data.user, data.token);
    guardarSesion(data.token, data.user.Nombre);

    localStorage.setItem('user', JSON.stringify(data.user)); 

    if (route.query.redirect) {
      router.push(destino);
    } else {
      const idRol = Number(data.user?.Roles_IDRol);

      if (idRol === 1) {
        router.push("/admin");      // Administrador
      } else if (idRol === 2) {
        router.push("/barbero");    // Barbero (Ajusta el 2 según el ID de tu BD)
      } else {
        router.push("/");           // Cliente normal
      }
    }
  } catch (error) {
    mensajeError.value = "Ocurrió un error al iniciar sesión";
    console.error(error);
  } finally {
    cargando.value = false;
  }
}
</script>
