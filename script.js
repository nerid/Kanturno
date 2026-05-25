// Kanturno - Lógica principal usando LocalStorage (Opción A: Mismo Dispositivo)

// Constantes configurables
const MAX_CANCIONES_POR_MESA = 3;
const ALPHA = 0.1;
const BETA = 0.2;

// Estado Global
let mesas = {}; 
let solicitudes = {};
let cantandoId = null;

// Cargar y guardar datos
function cargarDatos() {
    const data = localStorage.getItem('kanturno_data');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            mesas = parsed.mesas || {};
            solicitudes = parsed.solicitudes || {};
            cantandoId = parsed.cantandoId || null;
        } catch (e) {
            console.error("Error al leer datos locales:", e);
        }
    } else {
        mesas = {};
        solicitudes = {};
        cantandoId = null;
    }
}

function guardarDatos() {
    const data = {
        mesas: mesas,
        solicitudes: solicitudes,
        cantandoId: cantandoId
    };
    localStorage.setItem('kanturno_data', JSON.stringify(data));
}

// Sincronización entre pestañas
function escucharCambios(callbackRender) {
    window.addEventListener('storage', (e) => {
        if (e.key === 'kanturno_data') {
            cargarDatos();
            callbackRender();
        }
    });
}

// ========================
// LOGICA COMPARTIDA
// ========================

function calcularPrioridad(solicitud, mesaObj, historicoCantadas) {
    const ahora = Date.now();
    const esperaMinutos = (ahora - solicitud.timestamp_solicitud) / (1000 * 60);
    const num_personas = mesaObj ? mesaObj.numPersonas : 1;
    const cancionesCantadas = historicoCantadas || 0;
    
    return (esperaMinutos * (1 + ALPHA * num_personas)) / (1 + BETA * cancionesCantadas);
}

function getSolicitudesOrdenadas() {
    const arr = Object.keys(solicitudes).map(key => ({ id: key, ...solicitudes[key] }));
    const enCola = arr.filter(s => s.estado === 'en_cola');
    
    // Recalcular prioridad
    enCola.forEach(s => {
        const mesaObj = mesas[s.id_mesa];
        const cantadas = mesaObj ? (mesaObj.cantadas || 0) : 0;
        s.prioridad = calcularPrioridad(s, mesaObj, cantadas);
    });
    
    enCola.sort((a, b) => {
        if (b.prioridad !== a.prioridad) return b.prioridad - a.prioridad;
        return a.timestamp_solicitud - b.timestamp_solicitud;
    });
    
    return enCola;
}

function getCancionActual() {
    if (!cantandoId || !solicitudes[cantandoId]) return null;
    return { id: cantandoId, ...solicitudes[cantandoId] };
}

// Renders
function renderizarTurnoActual() {
    const container = document.getElementById('turnoActualContainer');
    if (!container) return;
    const cancion = getCancionActual();
    
    if (!cancion) {
        container.innerHTML = `
            <div class="empty-turno-message">
                <p>No hay ninguna canción en curso</p>
                <p class="small">El administrador seleccionará el siguiente turno.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="ticket-actual">
            <div class="ticket-artista">🎤 Cantando ahora</div>
            <div class="ticket-cancion">${escapeHtml(cancion.cancion)}</div>
            <div class="ticket-interprete">${escapeHtml(cancion.interprete)}</div>
            <div class="ticket-mesa">Mesa ${escapeHtml(cancion.id_mesa)}</div>
            <div style="margin-top: 16px; font-size: 14px; color: var(--text-secondary);">
                Por: <strong>${escapeHtml(cancion.nombre_cantante)}</strong>
            </div>
        </div>
    `;
}

function renderizarCola() {
    const container = document.getElementById('colaContainer');
    if (!container) return;
    
    const enCola = getSolicitudesOrdenadas();
    
    if (enCola.length === 0) {
        container.innerHTML = `
            <div class="empty-cola-message">
                <p>📭 Cola vacía</p>
            </div>
        `;
        return;
    }
    
    const isAdmin = window.location.pathname.includes('admin.html');
    
    container.innerHTML = enCola.map((s, index) => `
        <div class="cola-item">
            <div class="cola-info">
                <div class="cola-cantante">
                    ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎵'} 
                    ${escapeHtml(s.nombre_cantante)}
                </div>
                <div class="cola-cancion">${escapeHtml(s.cancion)} - ${escapeHtml(s.interprete)}</div>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
                <div class="cola-mesa">Mesa ${escapeHtml(s.id_mesa)}</div>
                ${isAdmin ? `<button class="btn-danger" style="padding:4px 8px" onclick="window.eliminarSolicitud('${s.id}')">❌</button>` : ''}
            </div>
        </div>
    `).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function mostrarMensaje(elementId, texto, tipo) {
    const msgDiv = document.getElementById(elementId);
    if (!msgDiv) return;
    msgDiv.innerText = texto;
    msgDiv.className = `mensaje-flotante mensaje-${tipo}`;
    setTimeout(() => {
        msgDiv.innerText = '';
        msgDiv.className = 'mensaje-flotante';
    }, 3000);
}

// ========================
// LÓGICA DE USUARIO
// ========================
export function initUser() {
    cargarDatos();
    renderizarTurnoActual();
    renderizarCola();
    
    const ts = document.getElementById('timestampActualizacion');
    if(ts) ts.innerText = `Sincronizado localmente: ${new Date().toLocaleTimeString()}`;

    escucharCambios(() => {
        renderizarTurnoActual();
        renderizarCola();
        if(ts) ts.innerText = `Sincronizado localmente: ${new Date().toLocaleTimeString()}`;
    });

    const form = document.getElementById('solicitudForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombreCantante = document.getElementById('nombreCantante').value.trim();
            const mesa = document.getElementById('mesa').value.trim();
            const cancion = document.getElementById('cancion').value.trim();
            const interprete = document.getElementById('interprete').value.trim();
            
            // Refrescar datos locales por si hay cambios
            cargarDatos();
            
            // Validaciones
            if (!mesas[mesa]) {
                mostrarMensaje('mensajeFormulario', 'Mesa no registrada. Por favor pide al administrador que registre tu mesa.', 'error');
                return;
            }
            
            // Validar max canciones
            const enColaMesa = Object.values(solicitudes).filter(s => s.id_mesa === mesa && s.estado === 'en_cola').length;
            if (enColaMesa >= MAX_CANCIONES_POR_MESA) {
                mostrarMensaje('mensajeFormulario', `Esta mesa ya tiene ${MAX_CANCIONES_POR_MESA} canciones en espera.`, 'error');
                return;
            }
            
            // Agregar
            const id = 'sol_' + Date.now();
            solicitudes[id] = {
                nombre_cantante: nombreCantante,
                id_mesa: mesa,
                cancion: cancion,
                interprete: interprete,
                timestamp_solicitud: Date.now(),
                estado: 'en_cola'
            };
            
            guardarDatos();
            renderizarCola(); // Update local screen immediately
            
            mostrarMensaje('mensajeFormulario', '¡Canción enviada!', 'exito');
            form.reset();
        });
    }
}

// ========================
// LÓGICA DE ADMINISTRADOR
// ========================
export function initAdmin() {
    cargarDatos();
    renderizarTurnoActual();
    renderizarCola();
    renderizarMesas();
    actualizarEstadisticasAdmin();

    const ts = document.getElementById('timestampActualizacion');
    if(ts) ts.innerText = `Sincronizado localmente: ${new Date().toLocaleTimeString()}`;

    escucharCambios(() => {
        renderizarTurnoActual();
        renderizarCola();
        renderizarMesas();
        actualizarEstadisticasAdmin();
        if(ts) ts.innerText = `Sincronizado localmente: ${new Date().toLocaleTimeString()}`;
    });

    const formMesa = document.getElementById('formMesa');
    if (formMesa) {
        formMesa.addEventListener('submit', (e) => {
            e.preventDefault();
            const numeroMesa = document.getElementById('numeroMesa').value.trim();
            const numPersonas = parseInt(document.getElementById('numPersonas').value);
            
            cargarDatos();
            let cantadas = 0;
            if (mesas[numeroMesa]) {
                cantadas = mesas[numeroMesa].cantadas || 0;
            }
            
            mesas[numeroMesa] = {
                numPersonas: numPersonas,
                cantadas: cantadas
            };
            
            guardarDatos();
            renderizarMesas();
            
            mostrarMensaje('mensajeMesa', `Mesa ${numeroMesa} registrada con ${numPersonas} personas.`, 'exito');
            formMesa.reset();
        });
    }

    document.getElementById('btnSiguiente').addEventListener('click', () => {
        avanzarTurno();
    });

    document.getElementById('btnResetear').addEventListener('click', () => {
        if (confirm('¿Seguro que quieres resetear toda la noche? Se borrarán todas las mesas y canciones.')) {
            mesas = {};
            solicitudes = {};
            cantandoId = null;
            guardarDatos();
            renderizarTurnoActual();
            renderizarCola();
            renderizarMesas();
            actualizarEstadisticasAdmin();
            mostrarMensaje('mensajeMesa', 'Sistema reseteado', 'exito');
        }
    });
    
    // Función global para eliminar de cola
    window.eliminarSolicitud = (id) => {
        if(confirm('¿Eliminar esta solicitud?')) {
            cargarDatos();
            if (solicitudes[id]) {
                delete solicitudes[id];
                guardarDatos();
                renderizarCola();
            }
        }
    };
}

function avanzarTurno() {
    cargarDatos();
    
    // 1. Terminar cancion actual
    if (cantandoId && solicitudes[cantandoId]) {
        const cancionVieja = solicitudes[cantandoId];
        cancionVieja.estado = 'completada';
        
        // Sumar cantadas a la mesa
        if (mesas[cancionVieja.id_mesa]) {
            mesas[cancionVieja.id_mesa].cantadas = (mesas[cancionVieja.id_mesa].cantadas || 0) + 1;
        }
    }
    
    // 2. Asignar siguiente
    const enCola = getSolicitudesOrdenadas();
    if (enCola.length > 0) {
        const siguiente = enCola[0];
        siguiente.estado = 'cantando';
        cantandoId = siguiente.id;
    } else {
        cantandoId = null;
    }
    
    guardarDatos();
    renderizarTurnoActual();
    renderizarCola();
    renderizarMesas();
    actualizarEstadisticasAdmin();
}

function renderizarMesas() {
    const container = document.getElementById('listaMesas');
    if (!container) return;
    
    const mKeys = Object.keys(mesas);
    if (mKeys.length === 0) {
        container.innerHTML = '<p class="small" style="color:var(--text-secondary)">No hay mesas registradas</p>';
        return;
    }
    
    container.innerHTML = mKeys.map(k => `
        <div style="background:var(--bg-secondary); padding:10px; border-radius:8px; border:1px solid var(--border); margin-bottom:8px; display:flex; justify-content:space-between;">
            <div><strong>Mesa ${k}</strong> (${mesas[k].numPersonas} personas)</div>
            <div style="color:var(--text-secondary)">${mesas[k].cantadas || 0} cantadas</div>
        </div>
    `).join('');
}

function actualizarEstadisticasAdmin() {
    let cantadas = 0;
    Object.values(solicitudes).forEach(s => {
        if (s.estado === 'completada') cantadas++;
    });
    const tC = document.getElementById('totalCanciones');
    const mA = document.getElementById('mesasActivas');
    if (tC) tC.innerText = cantadas;
    if (mA) mA.innerText = Object.keys(mesas).length;
}