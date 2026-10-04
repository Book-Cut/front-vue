<template>
  <nav class="navbar bg-dark p-4">
    <div class="container-fluid">
      <div class="d-flex align-items-center gap-3">
        <RouterLink to="/">
          <img src="../assets/output-onlinepngtools.png" alt="Book&Cut" width="150">
        </RouterLink>
        <a class="btn btn-outline-light " href="#servicios">Servicios</a>
        <a class="btn btn-outline-light " href="#locales">Locales</a>
      </div>

      <div class="d-flex gap-3">
        <a class="btn btn-outline-light " href="#iniciar-sesion">Iniciar Sesión</a>
        <a class="btn btn-outline-light" href="#registrarse">Registrarse</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
