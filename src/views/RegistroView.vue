<template>
  <div class="row g-0 min-vh-100">
    <div
      class="col-12 col-lg-5 bg-body-secondary d-flex flex-column justify-content-center p-4"
    >
      <img src="/logo.png" alt="Book&Cut" class="img-fluid w-50 mx-auto mb-2" />
      <h2 class="text-center fw-semibold mb-4">Registrarse</h2>

      <form novalidate @submit.prevent="register">
        <div v-for="c in campos" :key="c.key" class="mb-3">
          <div class="position-relative">
            <input
              v-model="form[c.key]"
              :type="c.type"
              :placeholder="c.label"
              class="form-control border-dark pe-5"
              :class="{ 'is-invalid': errores[c.key] }"
            />
            <i
              :class="[
                'bi',
                c.icon,
                'position-absolute top-50 end-0 translate-middle-y me-3 text-secondary',
              ]"
            ></i>
          </div>
          <div v-if="errores[c.key]" class="text-danger small">
            {{ errores[c.key] }}
          </div>
        </div>

        <!-- CHECKBOX DE LOS TERMINOS Y CONDICIONES -->
        <div class="mb-3 form-check">
          <input
            type="checkbox"
            class="form-check-input border-dark"
            id="terminosCheck"
            v-model="aceptaTerminos"
          />
          <label class="form-check-label small" for="terminosCheck">
            Acepto los
            <button
              type="button"
              class="btn btn-link p-0 align-baseline small text-decoration-underline"
              @click="verTerminos = true"
            >
              términos y condiciones
            </button>
          </label>
          <div v-if="errorTerminos" class="text-danger small">
            {{ errorTerminos }}
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-outline-dark w-100 fw-bold"
          :disabled="cargando"
        >
          {{ cargando ? "Registrando..." : "Registrarse" }}
        </button>

        <div
          v-if="mensaje"
          class="small mt-2"
          :class="exito ? 'text-success' : 'text-danger'"
        >
          {{ mensaje }}
        </div>
        <button
          type="button"
          class="btn btn-outline-dark btn-sm mt-3"
          @click="router.back()"
        >
          atras
        </button>
      </form>
    </div>

    <div class="col-lg-7 d-none d-lg-block position-relative">
      <img
        src="/barberia.png"
        alt=""
        class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
      />
    </div>
  </div>

  <!-- Modal de Términos y Condiciones -->
  <div
    v-if="verTerminos"
    class="modal d-block bg-dark bg-opacity-75"
    tabindex="-1"
    @click.self="verTerminos = false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Términos y Condiciones</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Cerrar"
            @click="verTerminos = false"
          ></button>
        </div>
        <div class="modal-body small">
          ACEPTA ESTOS TERMINOS Y CONDICIONES O TU ALMA SERA VENDIDA A BELCEBU
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-dark btn-sm"
            @click="verTerminos = false"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { RegistroForm } from "../types/registro";

const router = useRouter();

const campos = [
  {
    key: "nombre",
    label: "Nombre Completo",
    type: "text",
    icon: "bi-person-fill",
  },
  {
    key: "correo",
    label: "Correo Electronico",
    type: "email",
    icon: "bi-envelope-fill",
  },
  {
    key: "telefono",
    label: "Teléfono",
    type: "tel",
    icon: "bi-telephone-fill",
  },
  {
    key: "password",
    label: "Contraseña",
    type: "password",
    icon: "bi-lock-fill",
  },
  {
    key: "confirmar",
    label: "Confirmar Contraseña",
    type: "password",
    icon: "bi-lock-fill",
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
const errorTerminos = ref("");

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

  return Object.keys(errores).length === 0 && aceptaTerminos.value;
}

async function register() {
  mensaje.value = "";
  if (!validar()) return;
  cargando.value = true;

  try {
    const res = await fetch(`api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono,
        password: form.password,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(data.message ?? "No se pudo completar el registro");

    exito.value = true;
    mensaje.value = "Registro exitoso";

    // Guardar el nombre del usuario para mostrarlo en la página de inicio
    localStorage.setItem("userName", form.nombre.trim());

    // Redireccionar a la página de inicio después de un breve momento
    setTimeout(() => {
      router.push("/");
    }, 1000);
  } catch (e) {
    exito.value = false;
    mensaje.value = e instanceof Error ? e.message : "Error de conexión";
  } finally {
    cargando.value = false;
  }
}
</script>
