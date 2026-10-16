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
                    </table>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import HeaderNav from '../components/HeaderNav.vue'
</script>