
<template>
  <main class="container-fluid p-0">
    <div class="row min-vh-100 m-0">
      <section class="col-12 col-lg-5 d-flex flex-column justify-content-center px-4 px-md-5 bg-white">
        <div class="w-100 mx-auto" style="max-width: 450px;">
            <div class="mb-4">
              <RouterLink to="/" class="text-dark text-decoration-none fs-3 fw-bold">
                Book&Cut
              </RouterLink>
              <h1 class="fw-bold display-6 text-dark mt-4 mb-2">Crear una cuenta</h1>
              <p class="text-muted mb-0">Únete a Book&Cut y reserva tus citas fácilmente.</p>
            </div>

            <form novalidate @submit.prevent="register">
              <div class="row g-3">
                <div v-for="campo in campos" :key="campo.key" :class="campo.columna">
                  <label
                    :for="`registro-${campo.key}`"
                    class="form-label text-muted small text-uppercase fw-bold mb-1"
                  >
                    {{ campo.label }}
                  </label>
                  <input
                    :id="`registro-${campo.key}`"
                    v-model="form[campo.key]"
                    :type="campo.type"
                    :autocomplete="campo.autocomplete"
                    :class="[
                      'form-control bg-light border-0 px-3 py-2 rounded-3 shadow-none',
                      { 'is-invalid': errores[campo.key] },
                    ]"
                    :aria-describedby="errores[campo.key] ? `error-${campo.key}` : undefined"
                  />
                  <div
                    v-if="errores[campo.key]"
                    :id="`error-${campo.key}`"
                    class="invalid-feedback"
                  >
                    {{ errores[campo.key] }}
                  </div>
                </div>
              </div>

              <div class="form-check mt-3">
                <input
                  id="terminosCheck"
                  v-model="aceptaTerminos"
                  type="checkbox"
                  class="form-check-input"
                  :class="{ 'is-invalid': errorTerminos }"
                />
                <label class="form-check-label small" for="terminosCheck">
                  Acepto los
                  <button
                    type="button"
                    class="btn btn-link p-0 align-baseline small text-decoration-none"
                    @click="verTerminos = true"
                  >
                    términos y condiciones
                  </button>
                </label>
                <div v-if="errorTerminos" class="text-danger small">
                  {{ errorTerminos }}
                </div>
              </div>

              <p v-if="mensaje" class="small mt-3 mb-0" :class="exito ? 'text-success' : 'text-danger'">
                {{ mensaje }}
              </p>

              <button
                type="submit"
                class="btn btn-dark btn-lg w-100 mt-4 rounded-pill"
                :disabled="cargando"
              >
                {{ cargando ? "Enviando código..." : "Registrarse" }}
              </button>

              <div class="d-flex align-items-center text-muted small my-3">
                <hr class="flex-grow-1" />
                <span class="mx-3">o</span>
                <hr class="flex-grow-1" />
              </div>

              <button
                type="button"
                class="btn btn-light border text-dark w-100 rounded-pill mb-2 shadow-sm"
                @click="loginSocial('google', '/')"
              >
                Registrarse con Google
              </button>
              <button
                type="button"
                class="btn btn-light border text-dark w-100 rounded-pill mb-2 shadow-sm"
                @click="loginSocial('facebook', '/')"
              >
                Registrarse con Facebook
              </button>
            </form>

            <p class="text-center small mt-4 mb-0">
              <span class="text-muted">¿Ya tienes una cuenta?</span>
              <RouterLink
                to="/login"
                class="d-inline-block p-2 text-dark fw-bold text-decoration-none border-bottom border-dark"
              >
                Iniciar sesión
              </RouterLink>
            </p>
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
      v-if="verTerminos"
      class="modal d-block bg-dark bg-opacity-75"
      tabindex="-1"
      @click.self="verTerminos = false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h2 class="modal-title fs-5 fw-bold">Términos y condiciones</h2>
            <button type="button" class="btn btn-sm btn-link text-dark text-decoration-none" @click="verTerminos = false">
              Cerrar
            </button>
          </div>
          <div class="modal-body small">
            Al crear una cuenta aceptas usar Book&Cut para gestionar tus citas y mantener tus datos actualizados.
          </div>
          <div class="modal-footer border-top-0">
            <button type="button" class="btn btn-dark rounded-pill px-4" @click="verTerminos = false">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarCodigo" class="modal d-block bg-dark bg-opacity-75" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h2 class="modal-title fs-5 fw-bold">Verifica tu correo</h2>
            <button type="button" class="btn btn-sm btn-link text-dark text-decoration-none" @click="mostrarCodigo = false">
              Cerrar
            </button>
          </div>
          <div class="modal-body">
            <p class="text-muted small mb-3">
              Ingresa el código de 6 dígitos enviado a <strong>{{ form.correo }}</strong>. Vence en 10 minutos.
            </p>
            <label for="codigo-registro" class="form-label text-muted small text-uppercase fw-bold mb-1">
              Código de verificación
            </label>
            <input
              id="codigo-registro"
              v-model="codigo"
              class="form-control bg-light border-0 px-3 py-2 rounded-3 shadow-none text-center fs-4"
              inputmode="numeric"
              maxlength="6"
              autocomplete="one-time-code"
              required
              @input="codigo = codigo.replace(/\D/g, '')"
            />
            <div v-if="mensajeCodigo" class="text-success small mt-2">{{ mensajeCodigo }}</div>
            <div v-if="errorCodigo" class="text-danger small mt-2">{{ errorCodigo }}</div>
          </div>
          <div class="modal-footer border-top-0">
            <button
              type="button"
              class="btn btn-outline-secondary rounded-pill"
              :disabled="cargando"
              @click="register"
            >
              Reenviar código
            </button>
            <button type="button" class="btn btn-dark rounded-pill px-4" :disabled="cargando" @click="verificar">
              {{ verificando ? "Verificando..." : "Verificar" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import type { RegistroForm } from "../types/registro";
import { enviarCodigoRegistro, verificarCodigoRegistro } from "../services/registro.service";
import { useAuthStore } from "../stores/auth";
import { loginSocial } from "../auth";

interface AuthResponse {
  token: string;
  user: { idUsuario: number; Nombre: string; correo: string };
}

const router = useRouter();
const authStore = useAuthStore();

const campos = [
  {
    key: "nombre",
    label: "Nombre completo",
    type: "text",
    autocomplete: "name",
    columna: "col-12",
  },
  {
    key: "correo",
    label: "Correo electrónico",
    type: "email",
    autocomplete: "email",
    columna: "col-12 col-md-6",
  },
  {
    key: "telefono",
    label: "Teléfono",
    type: "tel",
    autocomplete: "tel",
    columna: "col-12 col-md-6",
  },
  {
    key: "password",
    label: "Contraseña",
    type: "password",
    autocomplete: "new-password",
    columna: "col-12 col-md-6",
  },
  {
    key: "confirmar",
    label: "Confirmar contraseña",
    type: "password",
    autocomplete: "new-password",
    columna: "col-12 col-md-6",
  },
] as const;

const form = reactive<RegistroForm>({
  nombre: "",
  correo: "",
  telefono: "",
  password: "",
  confirmar: "",
});
const errores = reactive<Partial<Record<keyof RegistroForm, string>>>({});
const cargando = ref(false);
const mensaje = ref("");
const exito = ref(false);
const verTerminos = ref(false);
const aceptaTerminos = ref(false);
const mostrarCodigo = ref(false);
const codigo = ref("");
const mensajeCodigo = ref("");
const errorCodigo = ref("");
const verificando = ref(false);
const errorTerminos = ref("");
const DOMINIOS_PERMITIDOS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "sena.edu.co",
]; //dominions requeridos para registrarse

function correoValido(correo: string) {
  const m = correo
    .trim()
    .toLowerCase()
    .match(/^[^\s@]+@([^\s@]+\.[^\s@]+)$/);
  return !!m && !!m[1] && DOMINIOS_PERMITIDOS.includes(m[1]);
}

function validar() {
  (Object.keys(errores) as (keyof RegistroForm)[]).forEach(
    (k) => delete errores[k],
  );
  errorTerminos.value = "";

  if (!form.nombre.trim()) errores.nombre = "Ingresa tu nombre";
  if (!/^\S+@\S+\.\S+$/.test(form.correo)) errores.correo = "Correo inválido";
  if (!/^\d{7,15}$/.test(form.telefono))
    errores.telefono = "Teléfono inválido (solo números)";
  if (form.password.length < 8) errores.password = "Mínimo 8 caracteres";
  if (form.confirmar !== form.password)
    errores.confirmar = "Las contraseñas no coinciden";

  if (!aceptaTerminos.value) {
    errorTerminos.value = "Debes aceptar los términos y condiciones";
  }

  if (!correoValido(form.correo)) {
    errores.correo = `Solo se permiten correos de los siguientes dominios: ${DOMINIOS_PERMITIDOS.map((d) => `@${d}`).join(", ")}`;
  }

  return Object.keys(errores).length === 0 && aceptaTerminos.value;
}

async function register() {
  mensaje.value = "";
  mensajeCodigo.value = "";
  errorCodigo.value = "";
  if (!validar()) return;
  cargando.value = true;

  try {
    await enviarCodigoRegistro({
      Nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      telefono: form.telefono,
      contrasenha: form.password,
      terminos_aceptados: aceptaTerminos.value,
    });

    codigo.value = "";
    mensajeCodigo.value = "Solicitud de envío realizada. Revisa tu bandeja de entrada y la carpeta de spam.";
    mostrarCodigo.value = true;
    
  } catch (e) {
    const error = e instanceof Error ? e.message : "Error de conexión";
    if (mostrarCodigo.value) {
      errorCodigo.value = error;
    } else {
      exito.value = false;
      mensaje.value = error;
    }
  } finally {
    cargando.value = false;
  }
}

async function verificar() {
  if (verificando.value) return;
  errorCodigo.value = "";
  verificando.value = true;

  try {
    const data = await verificarCodigoRegistro(form.correo.trim(), codigo.value);
    authStore.login(data.user, data.token);
    mostrarCodigo.value = false;
    exito.value = true;
    mensaje.value = "Registro exitoso";
    setTimeout(() => router.push("/"), 1000);
  } catch (e) {
    errorCodigo.value = e instanceof Error ? e.message : "Error de conexión";
  } finally {
    verificando.value = false;
  }
}
</script>
