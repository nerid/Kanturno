// Kanturno - Lógica principal del sistema de turnos justos para karaoke

// Constantes configurables
const MAX_CANCIONES_POR_MESA = 3;
const ALPHA = 0.1;
const BETA = 0.2;
const DURACION_SIMULADA_CANCION_SEGUNDOS = 5;
const EFECTO_SWOOSH_DURACION_MS = 300;

// Estado global
let solicitudes = []; // Array de solicitudes activas (en_cola + cantando)
let currentSongId = null;
let temporizadorCancion = null;
let contadorGlobalId = 0;

// Cargar datos guardados o inicializar vacío
function cargarDatos() {
    const guardado = localStorage.getItem('kanturno_data');
    if (guardado) {
        try {
            const data = JSON.parse(guardado);
            solicitudes = data.solicitudes || [];
            currentSongId = data.currentSongId || null;
            contadorGlobalId = data.contadorGlobalId || 0;
            renderizarTodo();
        } catch(e) {
            console.error('Error al cargar datos:', e);
            inicializarVacio();
        }
    } else {
        inicializarVacio();
    }
}

function inicializarVacio() {
    solicitudes = [];
    currentSongId = null;
    contadorGlobalId = 0;
    renderizarTodo();
}

function guardarDatos() {
    const data = {
        solicitudes: solicitudes,
        currentSongId: currentSongId,
        contadorGlobalId: contadorGlobalId
    };
    localStorage.setItem('kanturno_data', JSON.stringify(data));
}

// Obtener o crear mesa en el objeto auxiliar (para stats)
function obtenerMesasMap() {
    const map = new Map();
    solicitudes.forEach(s => {
        if (!map.has(s.id_mesa)) {
            map.set(s.id_mesa, {
                id: s.id_mesa,
                num_personas: s.num_personas,
                canciones_cantadas_hoy: 0
            });
        }
        if (s.estado === 'completada') {
            const mesa = map.get(s.id_mesa);
            mesa.canciones_cantadas_hoy++;
        }
    });
    // Para las solicitudes activas, también necesitamos contar las cantadas hoy de las completadas persistentes
    // Además necesitamos historial: simplificamos con un objeto extra de estadísticas
    return map;
}

// Contar canciones cantadas hoy por mesa desde historial
let historialCompletadas = []; // almacenar ids de completadas para stats

function registrarCancionCompletada(id_mesa, num_personas) {
    historialCompletadas.push({
        id_mesa: id_mesa,
        timestamp: Date.now(),
        num_personas: num_personas
    });
    // Limitar historial a 1000 registros
    if (historialCompletadas.length > 1000) historialCompletadas.shift();
}

function getCancionesCantadasPorMesa(id_mesa) {
    return historialCompletadas.filter(h => h.id_mesa === id_mesa).length;
}

function getMesasActivas() {
    const mesasSet = new Set();
    solicitudes.forEach(s => {
        if (s.estado !== 'completada') {
            mesasSet.add(s.id_mesa);
        }
    });
    historialCompletadas.forEach(h => {
        mesasSet.add(h.id_mesa);
    });
    return mesasSet.size;
}

function getTotalCancionesHoy() {
    return historialCompletadas.length;
}

// Calcular prioridad según fórmula
function calcularPrioridad(solicitud) {
    const ahora = Date.now();
    const esperaMinutos = (ahora - solicitud.timestamp_solicitud) / (1000 * 60);
    const num_personas = solicitud.num_personas;
    const cancionesCantadas = getCancionesCantadasPorMesa(solicitud.id_mesa);
    
    const prioridad = (esperaMinutos * (1 + ALPHA * num_personas)) / (1 + BETA * cancionesCantadas);
    return prioridad;
}

// Recalcular prioridad de todas las solicitudes en cola y ordenarlas
function recalcularYOrdenarCola() {
    const enCola = solicitudes.filter(s => s.estado === 'en_cola');
    enCola.forEach(s => {
        s.prioridad = calcularPrioridad(s);
    });
    enCola.sort((a, b) => {
        if (b.prioridad !== a.prioridad) return b.prioridad - a.prioridad;
        return a.timestamp_solicitud - b.timestamp_solicitud;
    });
    // Actualizar el orden en el array global manteniendo la canción actual
    const cantando = solicitudes.find(s => s.estado === 'cantando');
    const completadas = solicitudes.filter(s => s.estado === 'completada');
    const nuevasSolicitudes = [];
    if (cantando) nuevasSolicitudes.push(cantando);
    nuevasSolicitudes.push(...enCola);
    nuevasSolicitudes.push(...completadas);
    solicitudes = nuevasSolicitudes;
}

// Asignar nuevo turno si no hay canción actual y hay cola
function asignarNuevoTurno() {
    const currentSong = solicitudes.find(s => s.estado === 'cantando');
    if (currentSong) return; // Ya hay canción en curso
    
    const enCola = solicitudes.filter(s => s.estado === 'en_cola');
    if (enCola.length === 0) return;
    
    // Recalcular prioridades
    recalcularYOrdenarCola();
    const siguiente = solicitudes.find(s => s.estado === 'en_cola');
    if (siguiente) {
        siguiente.estado = 'cantando';
        currentSongId = siguiente.id;
        guardarDatos();
        renderizarTodo();
        iniciarTemporizadorCancion();
    }
}

function finalizarCancionActual() {
    const cancionActual = solicitudes.find(s => s.estado === 'cantando');
    if (!cancionActual) return;
    
    // Marcar como completada
    cancionActual.estado = 'completada';
    registrarCancionCompletada(cancionActual.id_mesa, cancionActual.num_personas);
    currentSongId = null;
    
    // Detener temporizador
    if (temporizadorCancion) {
        clearTimeout(temporizadorCancion);
        temporizadorCancion = null;
    }
    
    guardarDatos();
    
    // Asignar siguiente turno
    asignarNuevoTurno();
    renderizarTodo();
}

function iniciarTemporizadorCancion() {
    if (temporizadorCancion) clearTimeout(temporizadorCancion);
    temporizadorCancion = setTimeout(() => {
        finalizarCancionActual();
    }, DURACION_SIMULADA_CANCION_SEGUNDOS * 1000);
}

// Agregar nueva solicitud
function agregarSolicitud(nombre_cantante, id_mesa, num_personas, cancion, interprete) {
    const mesaKey = String(id_mesa);
    const pendientesMesa = solicitudes.filter(s => s.id_mesa === mesaKey && (s.estado === 'en_cola' || s.estado === 'cantando')).length;
    
    if (pendientesMesa >= MAX_CANCIONES_POR_MESA) {
        return { exito: false, mensaje: `Esta mesa ya tiene ${MAX_CANCIONES_POR_MESA} canciones en espera. Espera a que se libere turno.` };
    }
    
    const nuevaSolicitud = {
        id: `s_${Date.now()}_${contadorGlobalId++}`,
        nombre_cantante: nombre_cantante,
        id_mesa: mesaKey,
        num_personas: num_personas,
        cancion: cancion,
        interprete: interprete,
        timestamp_solicitud: Date.now(),
        duracion_estimada: DURACION_SIMULADA_CANCION_SEGUNDOS,
        estado: 'en_cola'
    };
    
    solicitudes.push(nuevaSolicitud);
    guardarDatos();
    
    // Si no hay canción actual, asignar ahora
    const hayCancionActual = solicitudes.some(s => s.estado === 'cantando');
    if (!hayCancionActual) {
        asignarNuevoTurno();
    } else {
        recalcularYOrdenarCola();
        renderizarTodo();
    }
    
    return { exito: true, mensaje: '¡Canción agregada a la cola!' };
}

// Resetear todo
function resetearSistema() {
    if (temporizadorCancion) {
        clearTimeout(temporizadorCancion);
        temporizadorCancion = null;
    }
    inicializarVacio();
    historialCompletadas = [];
    contadorGlobalId = 0;
    currentSongId = null;
    solicitudes = [];
    guardarDatos();
    renderizarTodo();
}

// Renderizar con efecto swoosh
function renderizarTodo() {
    aplicarEfectoSwoosh('turnoActualContainer', () => {
        renderizarTurnoActual();
    });
    aplicarEfectoSwoosh('colaContainer', () => {
        renderizarCola();
    });
    actualizarEstadisticas();
    document.getElementById('timestampActualizacion').innerText = `Actualizado: ${new Date().toLocaleTimeString()}`;
}

function aplicarEfectoSwoosh(elementId, renderCallback) {
    const elemento = document.getElementById(elementId);
    if (!elemento) {
        renderCallback();
        return;
    }
    elemento.style.animation = 'swooshOut 0.15s ease-out forwards';
    setTimeout(() => {
        renderCallback();
        elemento.style.animation = 'swooshIn 0.3s ease-out';
        setTimeout(() => {
            if (elemento) elemento.style.animation = '';
        }, 300);
    }, 150);
}

function renderizarTurnoActual() {
    const container = document.getElementById('turnoActualContainer');
    const cancionActual = solicitudes.find(s => s.estado === 'cantando');
    
    if (!cancionActual) {
        container.innerHTML = `
            <div class="empty-turno-message">
                <p>No hay ninguna canción en curso</p>
                <p class="small">Agrega una solicitud para comenzar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="ticket-actual">
            <div class="ticket-artista">🎤 Cantando ahora</div>
            <div class="ticket-cancion">${escapeHtml(cancionActual.cancion)}</div>
            <div class="ticket-interprete">${escapeHtml(cancionActual.interprete)}</div>
            <div class="ticket-mesa">Mesa ${escapeHtml(cancionActual.id_mesa)}</div>
            <div style="margin-top: 16px; font-size: 14px; color: var(--text-secondary);">
                Por: <strong>${escapeHtml(cancionActual.nombre_cantante)}</strong>
            </div>
        </div>
    `;
}

function renderizarCola() {
    const container = document.getElementById('colaContainer');
    const enCola = solicitudes.filter(s => s.estado === 'en_cola');
    
    if (enCola.length === 0) {
        container.innerHTML = `
            <div class="empty-cola-message">
                <p>📭 Cola vacía</p>
                <p class="small">Solicita una canción para aparecer aquí</p>
            </div>
        `;
        return;
    }
    
    const mostrar = enCola.slice(0, 5);
    container.innerHTML = mostrar.map(solicitud => `
        <div class="cola-item">
            <div class="cola-info">
                <div class="cola-cantante">🎵 ${escapeHtml(solicitud.nombre_cantante)}</div>
                <div class="cola-cancion">${escapeHtml(solicitud.cancion)} - ${escapeHtml(solicitud.interprete)}</div>
            </div>
            <div class="cola-mesa">Mesa ${escapeHtml(solicitud.id_mesa)}</div>
        </div>
    `).join('');
}

function actualizarEstadisticas() {
    const total = getTotalCancionesHoy();
    const mesas = getMesasActivas();
    document.getElementById('totalCanciones').innerText = total;
    document.getElementById('mesasActivas').innerText = mesas;
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

// Event listeners
document.getElementById('solicitudForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombreCantante = document.getElementById('nombreCantante').value.trim();
    const mesa = parseInt(document.getElementById('mesa').value);
    const numPersonas = parseInt(document.getElementById('numPersonas').value);
    const cancion = document.getElementById('cancion').value.trim();
    const interprete = document.getElementById('interprete').value.trim();
    
    if (!nombreCantante || !mesa || !numPersonas || !cancion || !interprete) {
        mostrarMensaje('Por favor completa todos los campos', 'error');
        return;
    }
    
    const resultado = agregarSolicitud(nombreCantante, String(mesa), numPersonas, cancion, interprete);
    mostrarMensaje(resultado.mensaje, resultado.exito ? 'exito' : 'error');
    
    if (resultado.exito) {
        e.target.reset();
    }
});

function mostrarMensaje(texto, tipo) {
    const msgDiv = document.getElementById('mensajeFormulario');
    msgDiv.innerText = texto;
    msgDiv.className = `mensaje-flotante mensaje-${tipo}`;
    setTimeout(() => {
        msgDiv.innerText = '';
        msgDiv.className = 'mensaje-flotante';
    }, 3000);
}

document.getElementById('btnSimularFin').addEventListener('click', () => {
    finalizarCancionActual();
});

document.getElementById('btnResetear').addEventListener('click', () => {
    if (confirm('¿Resetear toda la noche? Se perderán todas las canciones en cola y el historial.')) {
        resetearSistema();
        mostrarMensaje('Sistema reiniciado. ¡Nueva noche de karaoke!', 'exito');
    }
});

// Inicialización
cargarDatos();
// Verificar si hay canción actual y asignar temporizador
if (solicitudes.some(s => s.estado === 'cantando')) {
    iniciarTemporizadorCancion();
} else {
    asignarNuevoTurno();
}