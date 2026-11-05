<template>
  <div class="position-relative d-inline-block">
    <button class="btn btn-outline-light position-relative" @click="abierto = !abierto">
      🔔
      <span v-if="noLeidas" class="badge bg-danger position-absolute top-0 start-100 translate-middle">{{ noLeidas }}</span>
    </button>

    <ul v-if="abierto" class="list-group position-absolute end-0 mt-1 shadow" style="width: 300px; z-index: 1050">
      <li v-if="!lista.length" class="list-group-item">Sin notificaciones</li>
      <li
        v-for="n in lista"
        :key="n.idNotificacionWeb"
        class="list-group-item list-group-item-action"
        :class="{ 'fw-bold': !n.leida }"
        style="cursor: pointer"
        @click="abrirNoti(n)"
      >
        {{ n.titulo }}
      </li>
    </ul>
  </div>

  <div v-if="sel" class="modal d-block bg-dark bg-opacity-75">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ sel.titulo }}</h5>
          <button class="btn-close" @click="sel = null"></button>
        </div>

        <div class="modal-body">
          <p>{{ sel.mensaje }}</p>

          <template v-if="sel.CitaAfectada_id && sel.respuesta === 'Pendiente'">
            <div v-if="!modo" class="d-grid gap-2">
              <button class="btn btn-danger" @click="ejecutar(() => s.cancelarAfectada(sel!.CitaAfectada_id!))">Cancelar cita</button>
              <button class="btn btn-primary" @click="modo = 'reagendar'">Reagendar con el mismo barbero</button>
              <button class="btn btn-secondary" @click="verBarberos">Aceptar otro barbero a la misma hora</button>
            </div>

            <div v-if="modo === 'reagendar'">
              <input v-model="fecha" type="date" class="form-control mb-2" @change="verHoras" />
              <select v-model="hora" class="form-select mb-2">
                <option value="" disabled>Hora</option>
                <option v-for="h in horas" :key="h" :value="h">{{ h }}</option>
              </select>
              <button class="btn btn-primary" :disabled="!hora" @click="ejecutar(() => s.reagendarAfectada(sel!.CitaAfectada_id!, fecha, hora))">Confirmar</button>
            </div>

            <div v-if="modo === 'otro'">
              <p v-if="!barberos.length">No hay otros barberos disponibles a esa hora.</p>
              <button
                v-for="b in barberos"
                :key="b.idUsuario"
                class="btn btn-outline-dark me-2 mb-2"
                @click="ejecutar(() => s.aceptarOtroBarbero(sel!.CitaAfectada_id!, b.idUsuario))"
              >
                {{ b.Nombre }}
              </button>
            </div>
          </template>
          <p v-else-if="sel.respuesta && sel.respuesta !== 'Pendiente'" class="text-muted">Ya respondiste: {{ sel.respuesta }}</p>

          <p v-if="msg" class="text-danger mt-2 mb-0">{{ msg }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import * as s from "@/services/notificaciones.service";

const lista = ref<s.Notificacion[]>([]);
const abierto = ref(false);
const sel = ref<s.Notificacion | null>(null);
const modo = ref<"" | "reagendar" | "otro">("");
const fecha = ref("");
const horas = ref<string[]>([]);
const hora = ref("");
const barberos = ref<{ idUsuario: number; Nombre: string }[]>([]);
const msg = ref("");
let timer = 0;

const noLeidas = computed(() => lista.value.filter((n) => !n.leida).length);

async function cargar() {
    try {
        lista.value = (await s.listarNotificaciones()).data;
    } catch (e) {}
}

onMounted(() => {
    cargar();
    timer = window.setInterval(cargar, 60000);
});
onUnmounted(() => clearInterval(timer));

async function abrirNoti(n: s.Notificacion) {
    sel.value = n;
    modo.value = "";
    msg.value = "";
    abierto.value = false;
    if (!n.leida) {
            await s.marcarLeida(n.idNotificacionWeb);
            n.leida = true;
    }
}

async function ejecutar(fn: () => Promise<unknown>) {
    try {
        await fn();
        sel.value = null;
        await cargar();
    } catch (e: any) {
        msg.value = e.message;
    }
}

async function verHoras() {
    hora.value = "";
    horas.value = fecha.value ? (await s.horariosAfectada (sel.value!.CitaAfectada_id!, fecha.value)).data : [];
}

async function verBarberos() {
  modo.value = "otro";
  barberos.value = (await s.barberosAlternativos(sel.value!.CitaAfectada_id!)).data;
}

</script>