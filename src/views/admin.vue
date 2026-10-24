<template>
  <HeaderNav admin-page />

  <main class="bg-light min-vh-100">
    <div class="container py-4 py-md-5">
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <ConfirmacionCitaModal :mostrar="Boolean(citaPorConfirmar)" :accion="accionCita" :procesando="saving"
      @confirmar="confirmarAccionCita" @cerrar="citaPorConfirmar = null" />
    <RegistrarPagoModal :mostrar="Boolean(citaPorPagar)" :procesando="saving" :total="citaPorPagar?.total"
      :cantidad-citas="citaPorPagar?.cantidad" @registrar="registrarPago" @cerrar="citaPorPagar = null" />

    <ul class="nav nav-underline mb-4 d-flex flex-wrap gap-3 gap-md-4">
      <li class="nav-item">
        <button class="nav-link text-muted px-2 py-2" :class="{ active: activeTab === 'servicios', 'text-dark fw-bold border-bottom border-dark border-2': activeTab === 'servicios' }" type="button"
          @click="activeTab = 'servicios'">
          Servicios
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link text-muted px-2 py-2" :class="{ active: activeTab === 'citas', 'text-dark fw-bold border-bottom border-dark border-2': activeTab === 'citas' }" type="button" @click="openCitas">
          Citas
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link text-muted px-2 py-2" :class="{ active: activeTab === 'facturas', 'text-dark fw-bold border-bottom border-dark border-2': activeTab === 'facturas' }" type="button" @click="openFacturas">
          Facturas
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link text-muted px-2 py-2" :class="{ active: activeTab === 'estadisticas', 'text-dark fw-bold border-bottom border-dark border-2': activeTab === 'estadisticas' }" type="button"
          @click="openEstadisticas">
          Estadísticas
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link text-muted px-2 py-2" :class="{ active: activeTab === 'beneficios', 'text-dark fw-bold border-bottom border-dark border-2': activeTab === 'beneficios' }" type="button" @click="openBeneficios">
          Beneficios
        </button>
      </li>
    </ul>

    <!-- SECCIÓN DE SERVICIOS -->
    <section v-if="activeTab === 'servicios'">
      <div class="d-flex justify-content-between align-items-center mb-4 mt-4">
        <h1 class="fs-3 fw-bold text-dark mb-0">Servicios</h1>
        <button class="btn btn-dark rounded-pill px-4" type="button" @click="newService">
          Agregar servicio
        </button>
      </div>

      <div v-if="showServiceForm" class="modal d-block bg-dark bg-opacity-50" tabindex="-1" role="dialog"
        aria-modal="true" aria-labelledby="titulo-formulario-servicio"
        @click.self="!saving && (showServiceForm = false)">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <form class="modal-content bg-white border-0 shadow-lg rounded-4" @submit.prevent="saveService">
            <div class="modal-header border-bottom-0 px-4 pt-4">
              <h2 id="titulo-formulario-servicio" class="modal-title fw-bold fs-5 text-dark">
                {{ serviceForm.idServicio ? "Editar servicio" : "Agregar servicio" }}
              </h2>
              <button type="button" class="btn-close" aria-label="Cerrar" :disabled="saving"
                @click="showServiceForm = false"></button>
            </div>
            <div class="modal-body px-4 py-3">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="service-name">
                    Nombre
                  </label>
                  <input id="service-name" v-model="serviceForm.Nombre"
                    class="form-control bg-light border-0 py-2 shadow-none" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="service-duration">
                    Duración (minutos)
                  </label>
                  <input id="service-duration" v-model.number="serviceForm.Duracion"
                    class="form-control bg-light border-0 py-2 shadow-none" type="number" min="1" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="service-price">
                    Precio
                  </label>
                  <input id="service-price" v-model="serviceForm.Precio"
                    class="form-control bg-light border-0 py-2 shadow-none" type="text" inputmode="numeric"
                    pattern="[0-9]*" @input="serviceForm.Precio = serviceForm.Precio.replace(/[^0-9]/g, '')"
                    required />
                </div>
              </div>
            </div>
            <div class="modal-footer border-top-0 px-4 pb-4 pt-0 d-flex justify-content-end gap-2">
              <button class="btn btn-light text-dark fw-semibold rounded-pill px-4" type="button"
                :disabled="saving" @click="showServiceForm = false">
                Cancelar
              </button>
              <button class="btn btn-dark rounded-pill px-4" type="submit" :disabled="saving">
                {{ saving ? "Guardando..." : "Guardar" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <p v-if="loading" class="text-secondary">Cargando servicios...</p>

      <div v-else class="d-flex flex-column gap-3">
        <article
          v-for="service in services"
          :key="service.idServicio"
          class="bg-white border-0 rounded-4 shadow-sm p-3 p-md-4"
        >
          <div class="row align-items-center g-3">
            <div class="col-12 col-md-5">
              <h2 class="fw-semibold fs-5 text-dark mb-0">{{ service.Nombre }}</h2>
            </div>
            <div class="col-6 col-md-2">
              <p class="small text-muted text-uppercase fw-semibold mb-1">Duración</p>
              <p class="text-dark mb-0">{{ service.Duracion }} min</p>
            </div>
            <div class="col-6 col-md-2">
              <p class="small text-muted text-uppercase fw-semibold mb-1">Precio</p>
              <p class="text-dark mb-0">{{ formatCurrency(service.Precio) }}</p>
            </div>
            <div class="col-12 col-md-3 d-flex justify-content-md-end gap-2">
              <button
                class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                type="button"
                @click="editService(service)"
              >
                Editar
              </button>
              <button
                class="btn btn-sm text-danger text-decoration-none fw-semibold"
                type="button"
                @click="deleteService(service)"
              >
                Eliminar
              </button>
            </div>
          </div>
        </article>
        <div v-if="services.length === 0" class="bg-white rounded-4 shadow-sm p-4 text-center text-muted">
          No hay servicios.
        </div>
      </div>
    </section>

    <!-- SECCIÓN DE CITAS -->
    <section v-else-if="activeTab === 'citas'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="fs-3 fw-bold text-dark mb-0">Citas</h1>
        <button class="btn btn-outline-dark rounded-pill px-4" type="button" :disabled="loadingCitas" @click="loadCitas">
          Actualizar
        </button>
      </div>

      <div class="bg-white border-0 shadow-sm rounded-4 p-3 p-md-4 mb-4">
        <div class="row g-3 align-items-end">
          <div class="col-md-6">
            <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="filtro-cita-cliente">
              Buscar cliente
            </label>
            <input id="filtro-cita-cliente" v-model="filtroCitaCliente" type="search"
              class="form-control bg-light border-0 py-2 shadow-none"
              placeholder="Nombre o teléfono" />
          </div>
          <div class="col-md-4">
            <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="filtro-cita-estado">
              Estado
            </label>
            <select id="filtro-cita-estado" v-model="filtroCitaEstado"
              class="form-select bg-light border-0 py-2 shadow-none">
              <option value="">Todos los estados</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
          <div class="col-md-2 d-grid">
            <button class="btn btn-outline-dark rounded-pill px-4" type="button"
              :disabled="!filtroCitaCliente && !filtroCitaEstado"
              @click="limpiarFiltrosCitas">
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <div v-if="citasError" class="alert alert-danger" role="alert">
        {{ citasError }}
      </div>

      <p v-if="loadingCitas" class="text-secondary">Cargando citas...</p>

      <div v-else class="d-flex flex-column gap-3">
        <article v-for="cita in citasFiltradas" :key="cita.idCita"
          class="bg-white border-0 shadow-sm rounded-4 p-3 p-md-4">
          <div class="row align-items-center w-100 m-0 g-3">
            <div class="col-6 col-md-2">
              <p class="fw-bold text-dark mb-1">{{ cita.Fecha || "—" }}</p>
              <p class="text-muted small mb-0">{{ cita.Hora || "—" }}</p>
            </div>
            <div class="col-6 col-md-2">
              <p class="fw-semibold text-dark mb-1">{{ cita.Cliente || "—" }}</p>
              <p class="text-muted small mb-0">{{ cita.Telefono || "—" }}</p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-muted small mb-1">
                {{ cita.CantidadServicios }} {{ cita.CantidadServicios === 1 ? "servicio" : "servicios" }}
                · {{ cita.HorarioServicios }}
              </p>
              <ul v-if="cita.ServiciosDetalle.length" class="text-dark small mb-1 ps-3">
                <li v-for="(servicio, indice) in cita.ServiciosDetalle" :key="indice">
                  {{ servicio.nombre || "Servicio" }} · {{ servicio.hora }}
                </li>
              </ul>
              <p v-else class="text-dark mb-1">Sin servicios</p>
              <p class="text-muted small mb-0">Barbero: {{ cita.Barbero || "—" }}</p>
            </div>
            <div class="col-6 col-md-3">
              <div class="d-flex flex-wrap gap-2 mb-2">
                <span v-if="cita.Estado" class="badge rounded-pill" :class="estadoClass(cita.Estado)">
                  {{ cita.Estado }}
                </span>
                <span class="badge rounded-pill text-bg-light">
                  {{ cita.EstadoPago || "Pago sin registrar" }}
                </span>
              </div>
              <p class="text-dark mb-1">Pago presencial</p>
              <p class="text-dark mb-0">
                Total: {{ cita.Total === null ? "—" : formatCurrency(cita.Total) }}
              </p>
            </div>
            <div class="col-auto ms-auto d-grid gap-2" style="min-width: 130px; text-align: center;">
              <button v-if="
                puedeRegistrarPago(cita)
              " class="btn btn-sm btn-dark rounded-pill w-100" type="button" :disabled="saving"
                @click="abrirRegistroPago(cita)">
                Registrar pago{{ grupoPagoDeCita(cita).length > 1 ? ' conjunto' : '' }}
              </button>
              <button v-if="cita.Estado === 'Confirmado'" class="btn btn-sm btn-success fw-semibold rounded-pill w-100"
                type="button" :disabled="saving" @click="abrirConfirmacion(cita.idCita, 'finalizar')">
                Finalizar
              </button>
              <button v-if="cita.Estado !== 'Cancelado' && cita.Estado !== 'Finalizado'"
                class="btn btn-sm btn-outline-danger fw-semibold rounded-pill w-100" type="button" :disabled="saving"
                @click="abrirConfirmacion(cita.idCita, 'cancelar')">
                Cancelar
              </button>
              <span v-if="cita.Estado === 'Cancelado'" class="text-muted small">Cancelada</span>
              <span v-else-if="cita.Estado === 'Finalizado'" class="text-muted small">Finalizada</span>
            </div>
          </div>
        </article>
        <div v-if="citasFiltradas.length === 0 && !citasError"
          class="bg-white rounded-4 shadow-sm p-4 text-center text-muted">
          {{ citas.length === 0 ? "No hay citas." : "No se encontraron citas con esos filtros." }}
        </div>
      </div>
    </section>

    <!-- SECCIÓN DE FACTURAS (MEJORADA CON FILTROS E IMPRESIÓN) -->
    <section v-else-if="activeTab === 'facturas'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="fs-3 fw-bold text-dark mb-0">Facturas</h1>
        <button class="btn btn-outline-dark rounded-pill px-4" type="button" :disabled="loadingFacturas" @click="cargarFacturas">
          Actualizar
        </button>
      </div>

      <!-- Filtros de Facturas -->
      <div class="bg-white border-0 shadow-sm rounded-4 p-3 p-md-4 mb-4">
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="filtro-factura-cliente">Cliente</label>
            <input id="filtro-factura-cliente" type="text" class="form-control bg-light border-0 py-2 shadow-none"
              v-model="filtroFacturaCliente"
              placeholder="Buscar por cliente..." />
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="filtro-factura-desde">Desde</label>
            <input id="filtro-factura-desde" type="date" class="form-control bg-light border-0 py-2 shadow-none"
              v-model="filtroFacturaDesde" />
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="filtro-factura-hasta">Hasta</label>
            <input id="filtro-factura-hasta" type="date" class="form-control bg-light border-0 py-2 shadow-none"
              v-model="filtroFacturaHasta" />
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="filtro-factura-metodo">Método de pago</label>
            <select id="filtro-factura-metodo" class="form-select bg-light border-0 py-2 shadow-none"
              v-model="filtroFacturaMetodo">
              <option value="">Todos</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Nequi">Nequi</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="facturasError" class="alert alert-danger" role="alert">
        {{ facturasError }}
      </div>

      <p v-if="loadingFacturas" class="text-secondary">Cargando facturas...</p>

      <div v-else class="d-flex flex-column gap-3">
        <article v-for="factura in facturasFiltradas" :key="factura.idfactura"
          class="bg-white border-0 shadow-sm rounded-4 p-3 p-md-4">
          <div class="row align-items-center w-100 m-0 g-3">
            <div class="col-6 col-xl-1">
              <p class="small text-muted text-uppercase fw-semibold mb-1">Factura</p>
              <p class="fw-semibold text-dark mb-0">{{ factura.numero_factura }}</p>
            </div>
            <div class="col-6 col-xl-2">
              <p class="small text-muted text-uppercase fw-semibold mb-1">Fecha</p>
              <p class="text-dark mb-0">{{ factura.fecha_emision?.replace("T", " ").slice(0, 16) || "—" }}</p>
            </div>
            <div class="col-6 col-xl-2">
              <p class="small text-muted text-uppercase fw-semibold mb-1">Cliente</p>
              <p class="text-dark mb-0">{{ factura.cita?.cliente?.Nombre || "—" }}</p>
            </div>
            <div class="col-6 col-xl-2">
              <p class="small text-muted text-uppercase fw-semibold mb-1">Barbero</p>
              <p class="text-dark mb-0">{{ barberosFactura(factura) }}</p>
            </div>
            <div class="col-12 col-xl-2">
              <p class="small text-muted text-uppercase fw-semibold mb-1">Servicios</p>
              <ul v-if="serviciosFactura(factura).length" class="text-dark small mb-1 ps-3">
                <li v-for="(servicio, indice) in serviciosFactura(factura)" :key="indice">
                  {{ servicio.nombre }} · {{ servicio.hora || "—" }}
                </li>
              </ul>
              <p class="text-muted small mb-1">{{ resumenServiciosFactura(factura) }}</p>
              <p class="text-muted small mb-0">{{ factura.metodo_pago }}</p>
            </div>
            <div class="col-6 col-xl-2">
              <span class="badge rounded-pill text-white" :class="estadoFacturaClass(factura.estado_factura)">
                {{ factura.estado_factura }}
              </span>
              <p class="fw-semibold text-dark mt-2 mb-0">{{ formatCurrency(factura.total_pagar) }}</p>
            </div>
            <div class="col-6 col-xl-1 d-grid">
              <button class="btn btn-sm btn-light text-dark fw-semibold rounded-pill px-3" type="button"
                @click="abrirImprimirModal(factura)">
                Imprimir
              </button>
            </div>
          </div>
        </article>
        <div v-if="facturasFiltradas.length === 0 && !facturasError"
          class="bg-white rounded-4 shadow-sm p-4 text-center text-muted">
          No hay facturas registradas.
        </div>
      </div>

      <!-- Modal para Ver / Imprimir Factura -->
      <div v-if="facturaSeleccionada" class="modal fade show d-block tab-modal-backdrop" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-white border-0 shadow-lg rounded-4" id="facturaPrintContent">
            <div class="modal-header border-bottom-0 px-4 pt-4 d-print-none">
              <h5 class="modal-title fw-bold text-dark">Factura {{ facturaSeleccionada.numero_factura }}</h5>
              <button type="button" class="btn-close d-print-none" aria-label="Cerrar"
                @click="facturaSeleccionada = null"></button>
            </div>
            <div class="modal-body p-4 p-md-5">
              <div id="factura-print-area">
                <h1 class="fs-4 fw-bold text-dark text-center mb-1">Book&Cut Barbería</h1>
                <p class="text-muted small text-center mb-4">NIT: 900.123.456-7</p>

                <div class="row mb-4">
                  <div class="col-6 mb-2">
                    <span class="fw-semibold">Cliente:</span>
                    <span class="ms-1">{{ facturaSeleccionada.cita?.cliente?.Nombre || '—' }}</span>
                  </div>
                  <div class="col-6 mb-2">
                    <span class="fw-semibold">Barbero:</span>
                    <span class="ms-1">{{ barberosFactura(facturaSeleccionada) }}</span>
                  </div>
                  <div class="col-6">
                    <span class="fw-semibold">Fecha:</span>
                    <span class="ms-1">{{ facturaSeleccionada.fecha_emision?.replace("T", " ").slice(0, 16) || '—' }}</span>
                  </div>
                  <div class="col-6">
                    <span class="fw-semibold">Método de pago:</span>
                    <span class="ms-1">{{ facturaSeleccionada.metodo_pago || '—' }}</span>
                  </div>
                </div>

                <div class="py-3 border-top border-bottom border-light">
                  <p class="text-muted small mb-2">{{ resumenServiciosFactura(facturaSeleccionada) }}</p>
                  <ul v-if="serviciosFactura(facturaSeleccionada).length" class="text-dark mb-0 ps-3">
                    <li v-for="(servicio, indice) in serviciosFactura(facturaSeleccionada)" :key="indice">
                      <span class="d-flex justify-content-between gap-3">
                        <span>{{ servicio.nombre }} · {{ servicio.hora || "—" }}</span>
                        <span v-if="servicio.precio !== null" class="text-nowrap">
                          {{ formatCurrency(servicio.precio) }}
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
                <div class="fs-4 fw-bold mt-3 d-flex justify-content-between">
                  <span>Total:</span>
                  <span>{{ formatCurrency(facturaSeleccionada.total_pagar) }}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer border-top-0 px-4 pb-4 pt-0 d-flex justify-content-end gap-2 d-print-none">
              <button type="button" class="btn btn-light text-dark fw-semibold rounded-pill px-4 d-print-none"
                @click="facturaSeleccionada = null">Cerrar</button>
              <button type="button" class="btn btn-dark rounded-pill px-4 d-print-none"
                @click="imprimirVentana">Imprimir / PDF</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN DE BENEFICIOS -->
    <section v-else-if="activeTab === 'beneficios'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="fs-3 fw-bold text-dark mb-0">Beneficios</h1>
        <button class="btn btn-dark rounded-pill px-4" type="button" @click="nuevoBeneficio">
          Agregar beneficio
        </button>
      </div>

      <div v-if="beneficiosError && !beneficioPorEliminar" class="alert alert-danger">
        {{ beneficiosError }}
      </div>

      <div v-if="showBeneficioForm" class="modal d-block bg-dark bg-opacity-50" tabindex="-1" role="dialog"
        aria-modal="true" aria-labelledby="titulo-formulario-beneficio"
        @click.self="!saving && (showBeneficioForm = false)">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <form class="modal-content bg-white border-0 shadow-lg rounded-4" @submit.prevent="guardarBeneficio">
            <div class="modal-header border-bottom-0 px-4 pt-4">
              <h2 id="titulo-formulario-beneficio" class="modal-title fw-bold fs-5 text-dark">
                {{ beneficioForm.ID_publicacion ? "Editar beneficio" : "Agregar beneficio" }}
              </h2>
              <button type="button" class="btn-close" aria-label="Cerrar" :disabled="saving"
                @click="showBeneficioForm = false"></button>
            </div>
            <div class="modal-body px-4 py-3">
              <div v-if="beneficiosError" class="alert alert-danger" role="alert">
                {{ beneficiosError }}
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="ben-titulo">Título</label>
                  <input id="ben-titulo" v-model="beneficioForm.titulo"
                    class="form-control bg-light border-0 py-2 shadow-none" maxlength="100" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="ben-tipo">Tipo</label>
                  <input id="ben-tipo" v-model="beneficioForm.Tipo_beneficio"
                    class="form-control bg-light border-0 py-2 shadow-none" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="ben-inicio">Inicio</label>
                  <input id="ben-inicio" v-model="beneficioForm.Fecha_inicio" type="date"
                    class="form-control bg-light border-0 py-2 shadow-none" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="ben-fin">Fin</label>
                  <input id="ben-fin" v-model="beneficioForm.Fecha_fin" type="date"
                    class="form-control bg-light border-0 py-2 shadow-none"
                    :min="beneficioForm.Fecha_inicio" required />
                </div>
                <div class="col-12">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="ben-imagen">
                    Imagen (se muestra en el carrusel)
                  </label>
                  <input id="ben-imagen" type="file" accept=".jpg,.jpeg,.png,.webp,.gif"
                    class="form-control bg-light border-0 py-2 shadow-none"
                    @change="imagenBeneficio = $event.target.files[0]" />
                  <div class="form-text">
                    Formatos permitidos: JPG, JPEG, PNG, WEBP y GIF. Tamaño máximo: 2 MB.
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer border-top-0 px-4 pb-4 pt-0 d-flex justify-content-end gap-2">
              <button class="btn btn-light text-dark fw-semibold rounded-pill px-4" type="button"
                :disabled="saving" @click="showBeneficioForm = false">
                Cancelar
              </button>
              <button class="btn btn-dark rounded-pill px-4" type="submit" :disabled="saving">
                {{ saving ? "Guardando..." : "Guardar" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="beneficioPorEliminar" class="modal d-block bg-dark bg-opacity-50" tabindex="-1" role="dialog"
        aria-modal="true" aria-labelledby="titulo-eliminar-beneficio"
        @click.self="!saving && (beneficioPorEliminar = null)">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content bg-white border-0 shadow-lg rounded-4">
            <div class="modal-header border-bottom-0 px-4 pt-4">
              <h2 id="titulo-eliminar-beneficio" class="modal-title fw-bold fs-5 text-dark">
                Eliminar beneficio
              </h2>
              <button type="button" class="btn-close" aria-label="Cerrar" :disabled="saving"
                @click="beneficioPorEliminar = null"></button>
            </div>
            <div class="modal-body px-4 py-3">
              <div v-if="beneficiosError" class="alert alert-danger" role="alert">
                {{ beneficiosError }}
              </div>
              <p class="text-muted fs-6 mb-0">
                ¿Seguro que deseas eliminar el beneficio
                <strong class="text-dark">{{ beneficioPorEliminar.titulo }}</strong>?
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div class="modal-footer border-top-0 px-4 pb-4 pt-0 d-flex justify-content-end gap-2">
              <button class="btn btn-light text-dark fw-semibold rounded-pill px-4" type="button"
                :disabled="saving" @click="beneficioPorEliminar = null">
                Volver
              </button>
              <button class="btn btn-danger rounded-pill px-4" type="button" :disabled="saving"
                @click="confirmarEliminarBeneficio">
                {{ saving ? "Eliminando..." : "Eliminar beneficio" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="loadingBeneficios" class="text-secondary">
        Cargando beneficios...
      </p>
      <div v-else class="d-flex flex-column gap-3">
        <article v-for="b in beneficios" :key="b.ID_publicacion"
          class="bg-white border-0 shadow-sm rounded-4 p-3 p-md-4">
          <div class="row align-items-center w-100 m-0 g-3">
            <div class="col-auto" v-if="b.imagen_url">
              <img :src="b.imagen_url" :alt="b.titulo" class="rounded-3 object-fit-cover" width="72" height="72" />
            </div>
            <div class="col-12 col-md">
              <h2 class="fw-semibold fs-5 text-dark mb-1">{{ b.titulo }}</h2>
              <p class="text-muted mb-0">{{ b.Tipo_beneficio }}</p>
            </div>
            <div class="col-6 col-md-auto">
              <p class="text-muted small text-uppercase fw-semibold mb-1">Inicio</p>
              <p class="text-dark mb-0">{{ b.Fecha_inicio }}</p>
            </div>
            <div class="col-6 col-md-auto">
              <p class="text-muted small text-uppercase fw-semibold mb-1">Fin</p>
              <p class="text-dark mb-0">{{ b.Fecha_fin }}</p>
            </div>
            <div class="col-12 col-md-auto ms-auto d-grid gap-2">
              <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" type="button" @click="editarBeneficio(b)">
                Editar
              </button>
              <button class="btn btn-sm text-danger fw-semibold rounded-pill" type="button" @click="borrarBeneficio(b)">
                Eliminar
              </button>
            </div>
          </div>
        </article>
        <div v-if="beneficios.length === 0" class="bg-white rounded-4 shadow-sm p-4 text-center text-muted">
          No hay beneficios.
        </div>
      </div>
    </section>

    <!-- SECCIÓN DE ESTADÍSTICAS -->
    <section v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="fs-3 fw-bold text-dark mb-0">Estadísticas</h1>
        <button class="btn btn-outline-dark rounded-pill px-4" type="button" :disabled="loadingEstadisticas"
          @click="cargarEstadisticas">
          Actualizar
        </button>
      </div>

      <form class="bg-white border-0 shadow-sm rounded-4 p-3 p-md-4 mb-4"
        @submit.prevent="cargarEstadisticas">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="filtro-mes">Filtrar por mes</label>
            <input id="filtro-mes" v-model="filtroMes"
              class="form-control bg-light border-0 py-2 shadow-none" type="month" @input="
              filtroDesde = '';
            filtroHasta = '';
            " />
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="filtro-desde">Desde</label>
            <input id="filtro-desde" v-model="filtroDesde"
              class="form-control bg-light border-0 py-2 shadow-none" type="date"
              :disabled="Boolean(filtroMes)" @input="filtroMes = ''" />
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="filtro-hasta">Hasta</label>
            <input id="filtro-hasta" v-model="filtroHasta"
              class="form-control bg-light border-0 py-2 shadow-none" type="date"
              :min="filtroDesde || undefined" :disabled="Boolean(filtroMes)" @input="filtroMes = ''" />
          </div>
          <div class="col-md-2 d-flex flex-wrap gap-2">
            <button class="btn btn-dark rounded-pill px-4" type="submit" :disabled="loadingEstadisticas">
              Filtrar
            </button>
            <button class="btn btn-outline-dark rounded-pill px-4" type="button" :disabled="loadingEstadisticas"
              @click="limpiarFiltros">
              Limpiar
            </button>
          </div>
        </div>
      </form>

      <div v-if="estadisticasError" class="alert alert-danger" role="alert">
        {{ estadisticasError }}
      </div>
      <p v-if="loadingEstadisticas" class="text-secondary">
        Cargando estadísticas...
      </p>

      <div v-else-if="estadisticas" class="row g-3">
        <div class="col-12 col-md-6 col-xl">
          <div class="bg-white border-0 shadow-sm rounded-4 p-4 h-100">
            <h2 class="text-muted small text-uppercase fw-semibold mb-2">Ganancia total</h2>
            <p class="display-6 fw-bold text-dark mb-1">
                {{ formatCurrency(estadisticas.gananciaTotal) }}
            </p>
            <small class="text-muted">Facturas pagadas</small>
          </div>
        </div>
        <div v-for="estado in estadosEstadisticas" :key="estado.clave" class="col-6 col-md-3 col-xl">
          <div class="bg-white border-0 shadow-sm rounded-4 p-4 h-100">
            <h2 class="text-muted small text-uppercase fw-semibold mb-2">{{ estado.nombre }}</h2>
            <p class="display-6 fw-bold text-dark mb-1">{{ estadisticas.citas[estado.clave] }}</p>
            <small class="text-muted">Citas</small>
          </div>
        </div>
      </div>
    </section>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import HeaderNav from "../components/HeaderNav.vue";
import ConfirmacionCitaModal from "../components/ConfirmacionCitaModal.vue";
import RegistrarPagoModal from "../components/RegistrarPagoModal.vue";
import {
  consultarEstadisticas,
  listarFacturas,
} from "../services/facturas.service";
import {
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  listarServicios,
} from "../services/servicios.service";
import {
  listarCitas,
  cancelarCita,
  finalizarCita,
  pagarCita,
} from "../services/citas.service";
import { useAuthStore } from "../stores/auth";
import {
  listarBeneficios,
  crearBeneficio,
  actualizarBeneficio,
  eliminarBeneficio,
} from "../services/beneficios.service";

const activeTab = ref("servicios");
const citas = ref([]);
const loadingCitas = ref(false);
const citasError = ref("");
const filtroCitaCliente = ref("");
const filtroCitaEstado = ref("");
const services = ref([]);
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const showServiceForm = ref(false);
const serviceForm = ref({
  idServicio: null,
  Nombre: "",
  Duracion: 30,
  Precio: 0,
});
const citaPorConfirmar = ref(null);
const citaPorPagar = ref(null);
const accionCita = ref("cancelar");
const facturas = ref([]);
const loadingFacturas = ref(false);
const facturasError = ref("");

// Variables de Filtros de Facturas
const filtroFacturaCliente = ref("");
const filtroFacturaDesde = ref("");
const filtroFacturaHasta = ref("");
const filtroFacturaMetodo = ref("");
const facturaSeleccionada = ref(null);

const estadisticas = ref(null);
const loadingEstadisticas = ref(false);
const estadisticasError = ref("");
const filtroMes = ref("");
const filtroDesde = ref("");
const filtroHasta = ref("");
const estadosEstadisticas = [
  { clave: "Finalizado", nombre: "Finalizadas" },
  { clave: "Cancelado", nombre: "Canceladas" },
  { clave: "Pendiente", nombre: "Pendientes" },
  { clave: "Confirmado", nombre: "Confirmadas" },
];
const authStore = useAuthStore();
const beneficios = ref([]);
const loadingBeneficios = ref(false);
const beneficiosError = ref("");
const showBeneficioForm = ref(false);
const beneficioForm = ref({});
const imagenBeneficio = ref(null);
const beneficioPorEliminar = ref(null);

onMounted(loadServices);

const citasFiltradas = computed(() => {
  const busqueda = filtroCitaCliente.value.trim().toLowerCase();

  return [...citas.value]
    .filter((cita) => {
      const coincideCliente =
        !busqueda ||
        cita.Cliente.toLowerCase().includes(busqueda) ||
        cita.Telefono.includes(busqueda);
      const coincideEstado =
        !filtroCitaEstado.value || cita.Estado === filtroCitaEstado.value;

      return coincideCliente && coincideEstado;
    })
    .sort((a, b) =>
      `${b.Fecha} ${b.Hora}`.localeCompare(`${a.Fecha} ${a.Hora}`),
    );
});

function limpiarFiltrosCitas() {
  filtroCitaCliente.value = "";
  filtroCitaEstado.value = "";
}

async function loadServices() {
  loading.value = true;
  errorMessage.value = "";

  try {
    services.value = await listarServicios();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}

function estadoClass(estado) {
  return (
    {
      Confirmado: "bg-success",
      Pendiente: "bg-warning text-dark",
      Cancelado: "bg-danger",
      Finalizado: "bg-secondary",
    }[estado] ?? "bg-secondary"
  );
}

function openCitas() {
  activeTab.value = "citas";
  loadCitas();
}

function grupoPagoDeCita(cita) {
  const mismoCliente = (otraCita) => cita.ClienteId
    ? otraCita.ClienteId === cita.ClienteId
    : !otraCita.ClienteId && otraCita.Cliente === cita.Cliente && otraCita.Telefono === cita.Telefono;
  const candidatas = citas.value
    .filter((otraCita) =>
      otraCita.Fecha === cita.Fecha &&
      otraCita.ModalidadPago === cita.ModalidadPago &&
      otraCita.MetodoPago === cita.MetodoPago &&
      otraCita.EstadoPago === "Pendiente" &&
      ["Pendiente", "Confirmado", "Finalizado"].includes(otraCita.Estado) &&
      mismoCliente(otraCita),
    )
    .sort((a, b) => a.Hora.localeCompare(b.Hora));
  const indice = candidatas.findIndex((otraCita) => otraCita.idCita === cita.idCita);
  if (indice < 0) return [cita];

  const minutos = (hora) => {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos;
  };
  let inicio = indice;
  let fin = indice;
  while (inicio > 0 && minutos(candidatas[inicio - 1].HoraFin) === minutos(candidatas[inicio].Hora)) {
    inicio--;
  }
  while (fin + 1 < candidatas.length && minutos(candidatas[fin].HoraFin) === minutos(candidatas[fin + 1].Hora)) {
    fin++;
  }

  return candidatas.slice(inicio, fin + 1);
}

function puedeRegistrarPago(cita) {
  return cita.ModalidadPago === "Presencial" &&
    cita.EstadoPago === "Pendiente" &&
    cita.Estado === "Finalizado" &&
    grupoPagoDeCita(cita).every((citaGrupo) => citaGrupo.Estado === "Finalizado");
}

function abrirRegistroPago(cita) {
  const grupo = grupoPagoDeCita(cita);
  citaPorPagar.value = {
    id: cita.idCita,
    total: grupo.reduce((suma, citaGrupo) => suma + (citaGrupo.Total ?? 0), 0),
    cantidad: grupo.length,
  };
}

async function registrarPago(metodoPago) {
  if (!citaPorPagar.value) return;
  saving.value = true;
  citasError.value = "";

  try {
    await pagarCita(citaPorPagar.value.id, metodoPago);
    citaPorPagar.value = null;
    await loadCitas();
  } catch (error) {
    citasError.value = error.message || "No se pudo registrar el pago.";
  } finally {
    saving.value = false;
  }
}

function openFacturas() {
  activeTab.value = "facturas";
  cargarFacturas();
}

function openEstadisticas() {
  activeTab.value = "estadisticas";
  cargarEstadisticas();
}

async function loadCitas() {
  loadingCitas.value = true;
  citasError.value = "";

  try {
    citas.value = await listarCitas();
  } catch (error) {
    citas.value = [];
    citasError.value = error.message;
  } finally {
    loadingCitas.value = false;
  }
}

async function cargarFacturas() {
  loadingFacturas.value = true;
  facturasError.value = "";

  try {
    facturas.value = await listarFacturas();
  } catch (error) {
    facturas.value = [];
    facturasError.value =
      error.message || "No se pudieron cargar las facturas.";
  } finally {
    loadingFacturas.value = false;
  }
}

// Lógica de Filtros para Facturas
const facturasFiltradas = computed(() => {
  return facturas.value.filter((factura) => {
    const clienteNombre = factura.cita?.cliente?.Nombre || "";
    if (
      filtroFacturaCliente.value &&
      !clienteNombre
        .toLowerCase()
        .includes(filtroFacturaCliente.value.toLowerCase())
    ) {
      return false;
    }

    if (
      filtroFacturaMetodo.value &&
      factura.metodo_pago !== filtroFacturaMetodo.value
    ) {
      return false;
    }

    const fechaFactura = factura.fecha_emision?.slice(0, 10);
    if (filtroFacturaDesde.value && fechaFactura < filtroFacturaDesde.value) {
      return false;
    }
    if (filtroFacturaHasta.value && fechaFactura > filtroFacturaHasta.value) {
      return false;
    }

    return true;
  });
});

function abrirImprimirModal(factura) {
  facturaSeleccionada.value = factura;
}

function citasDeFactura(factura) {
  return factura.citas?.length ? factura.citas : factura.cita ? [factura.cita] : [];
}

function serviciosFactura(factura) {
  return citasDeFactura(factura)
    .flatMap((cita) => cita.servicios?.map((servicio) => {
      const inicio = servicio.pivot?.fecha_hora_servicio ?? cita.Fecha_hora ?? "";
      const hora = inicio.split(/[T ]/)[1]?.slice(0, 5) ?? "";
      const duracion = Number(servicio.pivot?.duracion_servicio ?? servicio.Duracion ?? 0);
      const fechaInicio = inicio ? new Date(inicio.replace(" ", "T")) : null;
      const fechaFin = fechaInicio && duracion
        ? new Date(fechaInicio.getTime() + duracion * 60_000)
        : fechaInicio;

      return {
        nombre: servicio.pivot?.nombre_servicio || servicio.Nombre || "Servicio",
        inicio,
        hora,
        fin: fechaFin
          ? `${String(fechaFin.getHours()).padStart(2, "0")}:${String(fechaFin.getMinutes()).padStart(2, "0")}`
          : hora,
        precio: servicio.pivot?.precio_servicio === undefined && servicio.Precio === undefined
          ? null
          : Number(servicio.pivot?.precio_servicio ?? servicio.Precio),
      };
    }) ?? [])
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
}

function resumenServiciosFactura(factura) {
  const servicios = serviciosFactura(factura);
  if (!servicios.length) return "0 servicios";

  const inicio = servicios[0].hora || "—";
  const fin = servicios[servicios.length - 1].fin || servicios[servicios.length - 1].hora || "—";
  return `${servicios.length} ${servicios.length === 1 ? "servicio" : "servicios"} · ${inicio}–${fin}`;
}

function barberosFactura(factura) {
  return [...new Set(citasDeFactura(factura)
    .map((cita) => cita.barbero?.Nombre)
    .filter(Boolean))]
    .join(", ") || "—";
}

function imprimirVentana() {
  window.print();
}

async function cargarEstadisticas() {
  loadingEstadisticas.value = true;
  estadisticasError.value = "";

  try {
    estadisticas.value = await consultarEstadisticas({
      mes: filtroMes.value,
      desde: filtroDesde.value,
      hasta: filtroHasta.value,
    });
  } catch (error) {
    estadisticasError.value =
      error.message || "No se pudieron cargar las estadísticas.";
  } finally {
    loadingEstadisticas.value = false;
  }
}

function limpiarFiltros() {
  filtroMes.value = "";
  filtroDesde.value = "";
  filtroHasta.value = "";
  cargarEstadisticas();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function estadoFacturaClass(estado) {
  return (
    {
      Anulada: "text-bg-danger",
      Pagada: "text-bg-success",
    }[estado] ?? "text-bg-secondary"
  );
}

function newService() {
  serviceForm.value = { idServicio: null, Nombre: "", Duracion: 30, Precio: 0 };
  showServiceForm.value = true;
}

function editService(service) {
  serviceForm.value = { ...service };
  showServiceForm.value = true;
}

async function saveService() {
  saving.value = true;
  errorMessage.value = "";

  try {
    const editing = Boolean(serviceForm.value.idServicio);
    const payload = {
      Nombre: serviceForm.value.Nombre,
      Duracion: serviceForm.value.Duracion,
      Precio: serviceForm.value.Precio,
    };

    if (editing) {
      await actualizarServicio(serviceForm.value.idServicio, payload);
    } else {
      await crearServicio(payload);
    }
    showServiceForm.value = false;
    await loadServices();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    saving.value = false;
  }
}

async function deleteService(service) {
  if (!window.confirm(`¿Eliminar el servicio "${service.Nombre}"?`)) return;
  errorMessage.value = "";

  try {
    await eliminarServicio(service.idServicio);
    await loadServices();
  } catch (error) {
    errorMessage.value = error.message;
  }
}

function abrirConfirmacion(idCita, accion) {
  citaPorConfirmar.value = idCita;
  accionCita.value = accion;
}

async function confirmarAccionCita() {
  if (!citaPorConfirmar.value) return;

  saving.value = true;
  errorMessage.value = "";

  try {
    if (accionCita.value === "finalizar") {
      await finalizarCita(citaPorConfirmar.value);
    } else {
      await cancelarCita(citaPorConfirmar.value);
    }
    citaPorConfirmar.value = null;
    await loadCitas();
  } catch (error) {
    citaPorConfirmar.value = null;
    errorMessage.value = error.message;
  } finally {
    saving.value = false;
  }
}

function openBeneficios() {
  activeTab.value = "beneficios";
  cargarBeneficios();
}

async function cargarBeneficios() {
  loadingBeneficios.value = true;
  beneficiosError.value = "";
  try {
    beneficios.value = await listarBeneficios();
  } catch (e) {
    beneficiosError.value = e.message;
  } finally {
    loadingBeneficios.value = false;
  }
}

function nuevoBeneficio() {
  beneficioForm.value = {
    ID_publicacion: null,
    titulo: "",
    Tipo_beneficio: "",
    Fecha_inicio: "",
    Fecha_fin: "",
  };
  imagenBeneficio.value = null;
  showBeneficioForm.value = true;
}

function editarBeneficio(b) {
  beneficioForm.value = { ...b };
  imagenBeneficio.value = null;
  showBeneficioForm.value = true;
}

async function guardarBeneficio() {
  saving.value = true;
  beneficiosError.value = "";
  try {
    const f = beneficioForm.value;
    const fd = new FormData();
    fd.append("titulo", f.titulo);
    fd.append("Tipo_beneficio", f.Tipo_beneficio);
    fd.append("Fecha_inicio", f.Fecha_inicio);
    fd.append("Fecha_fin", f.Fecha_fin);
    fd.append("Usuario_idUsuario", authStore.user.idUsuario);
    if (imagenBeneficio.value) fd.append("imagen", imagenBeneficio.value);

    if (f.ID_publicacion) await actualizarBeneficio(f.ID_publicacion, fd);
    else await crearBeneficio(fd);

    showBeneficioForm.value = false;
    await cargarBeneficios();
  } catch (e) {
    beneficiosError.value = e.message;
  } finally {
    saving.value = false;
  }
}

function borrarBeneficio(b) {
  beneficiosError.value = "";
  beneficioPorEliminar.value = b;
}

async function confirmarEliminarBeneficio() {
  if (!beneficioPorEliminar.value || saving.value) return;
  saving.value = true;
  beneficiosError.value = "";

  try {
    await eliminarBeneficio(beneficioPorEliminar.value.ID_publicacion);
    beneficioPorEliminar.value = null;
    await cargarBeneficios();
  } catch (e) {
    beneficiosError.value = e.message;
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.tab-modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

@media print {
  @page {
    margin: 0.5cm;
  }

  :global(html),
  :global(body) {
    height: 100% !important;
    overflow: hidden !important;
  }

  :global(body > #app) {
    position: fixed !important;
    inset: 0;
    overflow: hidden !important;
  }

  :global(body *) {
    visibility: hidden;
  }

  :global(#factura-print-area),
  :global(#factura-print-area *) {
    visibility: visible;
  }

  :global(#factura-print-area) {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    background: #fff;
  }

  :global(#facturaPrintContent) {
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
  }

  .d-print-none {
    display: none !important;
  }
}
</style>