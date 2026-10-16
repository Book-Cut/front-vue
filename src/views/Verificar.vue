<script setup lang="ts">
import { useRouter } from 'vue-router'
import AccesoPanel from '../components/AccesoPanel.vue'

const router = useRouter()
const correo = new URLSearchParams(location.hash.slice(1)).get('correo')
if (!correo) router.replace('/login')

const destino = sessionStorage.getItem('destino') || '/agendar-servicio'
function listo() {
    sessionStorage.removeItem('destino')
    router.push(destino)
}
</script>

<template>
    <div v-if="correo" class="bg-body-secondary min-vh-100 py-4">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-sm-10 col-md-6 col-lg-4">
                    <div class="card shadow-sm">
                        <div class="card-body p-4">
                            <h2 class="text-center fw-semibold mb-4">Verificar correo</h2>
                            <AccesoPanel :destino="destino" :correo-inicial="correo" @okay="listo"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>