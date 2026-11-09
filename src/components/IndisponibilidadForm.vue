<template>
  <form class="card card-body" @submit.prevent="guardar">
    <h5>Registrar indisponibilidad</h5>

    <select v-if="esAdmin" v-model="barbero" class="form-select mb-2" required>
      <option :value="null" disabled>Barbero</option>
      <option v-for="b in barberos" :key="b.idUsuario" :value="b.idUsuario">{{ b.Nombre }}</option>
    </select>

    <input v-model="fecha" type="date" class="form-control mb-2" required />

    <div class="form-check mb-2">
      <input id="dc" v-model="diaCompleto" type="checkbox" class="form-check-input" />
      <label for="dc" class="form-check-label">Día completo</label>
    </div>

    <div v-if="!diaCompleto" class="d-flex gap-2 mb-2">
      <input v-model="horaInicio" type="time" class="form-control" required />
      <input v-model="horaFin" type="time" class="form-control" required />
    </div>

    <input v-model="motivo" class="form-control mb-2" placeholder="Motivo (opcional)" />
    <button class="btn btn-dark">Guardar</button>

    <p v-if="msg" class="text-success mt-2 mb-0">{{ msg }}</p>
    <p v-if="error" class="text-danger mt-2 mb-0">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { apiRequest } from "@/services/api";
import { registrarIndisponibilidad } from "@/services/indisponibilidad.service";

const props = defineProps<{ esAdmin: boolean }>();

interface Barbero {
  idUsuario: number;
  Nombre: string;
}

const barberos = ref<Barbero[]>([]);
const barbero = ref<number | null>(null);
const fecha = ref("");
const diaCompleto = ref(false);
const horaInicio = ref("");
const horaFin = ref("");
const motivo = ref("");
const msg = ref("");
const error = ref("");

onMounted(async () => {
    if (!props.esAdmin) return;
    const r = await apiRequest<Barbero[] | { data: Barbero[] }>(
        "/barberos",
        {},
        { authenticated: false },
    );
    barberos.value = "data" in r ? r.data : r;
});

async function guardar() {
    msg.value = error.value = "";
    try {
        const r = await registrarIndisponibilidad({
            Usuario_idUsuarioBar: props.esAdmin ? barbero.value ?? undefined : undefined,
            fecha: fecha.value,
            hora_inicio: diaCompleto.value ? undefined : horaInicio.value,
            hora_fin: diaCompleto.value ? undefined : horaFin.value,
            motivo: motivo.value || undefined,
        });

        msg.value = `${r.message}. Clientes avisados: ${r.citas_afectadas}`;
    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : "No se pudo registrar la indisponibilidad.";
    }
}
</script>