<template>
    <div class="bg-body-secondary min-vh-100">
        <HeaderNav />

        <main class="container py-4 py-lg-5">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
                <div>
                    <h1 class="h2 mb-0">Mis citas</h1>
                </div>
            </div>

            <section class="mb-5" aria-labelledby="citas-proximas">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <h2 id="citas-proximas" class="h5 mb-0">Próximas citas</h2>
                </div>

                <p v-if="cargando" class="text-secondary">Cargando tus citas...</p>
                <div v-else-if="error" class="alert alert-danger" role="alert">
                    {{ error }}
                </div>

                <div class="table-responsive bg-white border rounded-3 shadow-sm">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">Fecha</th>
                                <th scope="col">Hora</th>
                                <th scope="col">Barbero</th>
                                <th scope="col">Servicios</th>
                                <th scope="col">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="cita in citasProximas" :key="cita.idCita">
                                <td>{{ cita.Fecha || '—' }}</td>
                                <td>{{ cita.Hora || '—' }}</td>
                                <td>{{ cita.Barbero || '—' }}</td>
                                <td>{{ cita.Servicios || '—' }}</td>
                                <td>{{ cita.Estado || '—' }}</td>
                            </tr>
                            <tr v-if="!cargando && !error && citasProximas.length === 0">
                                <td colspan="5" class="text-center text-secondary">
                                    No tienes citas próximas.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section aria-labelledby="historial-citas">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <h2 id="historial-citas" class="h5 mb-0">Citas anteriores</h2>
                </div>

                <div class="table-responsive bg-white border rounded-3 shadow-sm">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">Fecha</th>
                                <th scope="col">Hora</th>
                                <th scope="col">Barbero</th>
                                <th scope="col">Servicios</th>
                                <th scope="col">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="cita in citasAnteriores" :key="cita.idCita">
                                <td>{{ cita.Fecha || '—' }}</td>
                                <td>{{ cita.Hora || '—' }}</td>
                                <td>{{ cita.Barbero || '—' }}</td>
                                <td>{{ cita.Servicios || '—' }}</td>
                                <td>{{ cita.Estado || '—' }}</td>
                            </tr>
                            <tr v-if="!cargando && !error && citasAnteriores.length === 0">
                                <td colspan="5" class="text-center text-secondary">
                                    No tienes citas anteriores.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import { listarCitas } from '../services/citas.service'
import type { Cita } from '../services/citas.service'

const citas = ref<Cita[]>([])
const cargando = ref(true)
const error = ref('')

const citasProximas = computed(() =>
    citas.value.filter((cita) => new Date(`${cita.Fecha}T${cita.Hora || '00:00'}`) >= new Date()),
)

const citasAnteriores = computed(() =>
    citas.value.filter((cita) => new Date(`${cita.Fecha}T${cita.Hora || '00:00'}`) < new Date()),
)

onMounted(async () => {
    try {
        citas.value = await listarCitas()
    } catch (errorCargando) {
        error.value = errorCargando instanceof Error
            ? errorCargando.message
            : 'No se pudieron cargar tus citas.'
    } finally {
        cargando.value = false
    }
})
</script>