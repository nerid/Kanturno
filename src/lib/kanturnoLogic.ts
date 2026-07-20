import { useState, useEffect } from 'react';
import { ref, onValue, push, set } from 'firebase/database';
import { signInWithRedirect, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { db, auth, googleProvider } from './firebase';

export interface Solicitud {
  id: string;
  nombre_cantante: string;
  cancion: string;
  interprete: string;
  id_mesa: string;
  timestamp_solicitud: number;
  estado: 'en_cola' | 'cantando' | 'completada';
  prioridad?: number;
}

export interface Mesa {
  numPersonas: number;
  cantadas: number;
}

const ALPHA = 0.1;
const BETA = 0.2;
const MAX_CANCIONES_POR_MESA = 3;

export function calcularPrioridad(solicitud: Solicitud, mesaObj?: Mesa) {
  const ahora = Date.now();
  const esperaMinutos = Math.max(0, (ahora - solicitud.timestamp_solicitud) / (1000 * 60));
  const num_personas = mesaObj?.numPersonas || 1;
  const cancionesCantadas = mesaObj?.cantadas || 0;
  
  return (esperaMinutos * (1 + ALPHA * num_personas)) / (1 + BETA * cancionesCantadas);
}

export function useKanturnoData() {
  const [solicitudes, setSolicitudes] = useState<Record<string, Solicitud>>({});
  const [mesas, setMesas] = useState<Record<string, Mesa>>({});
  const [cantandoId, setCantandoId] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    
    const unsubs: (() => void)[] = [];
    
    unsubs.push(onValue(ref(db, 'solicitudes'), (snap) => setSolicitudes(snap.val() || {})));
    unsubs.push(onValue(ref(db, 'mesas'), (snap) => setMesas(snap.val() || {})));
    unsubs.push(onValue(ref(db, 'estado/cantandoId'), (snap) => setCantandoId(snap.val() || null)));
    
    return () => unsubs.forEach(fn => fn());
  }, []);

  const getSolicitudesOrdenadas = () => {
    const arr = Object.keys(solicitudes).map(key => ({ ...solicitudes[key], id: key }));
    const enCola = arr.filter(s => s.estado === 'en_cola');
    
    enCola.forEach(s => {
      s.prioridad = calcularPrioridad(s, mesas[s.id_mesa]);
    });
    
    enCola.sort((a, b) => {
      if (b.prioridad !== a.prioridad) return (b.prioridad || 0) - (a.prioridad || 0);
      return a.timestamp_solicitud - b.timestamp_solicitud;
    });
    
    return enCola;
  };

  const getCantando = () => {
    if (!cantandoId) return null;
    return solicitudes[cantandoId] ? { ...solicitudes[cantandoId], id: cantandoId } : null;
  };

  return { solicitudes, mesas, cantandoId, getSolicitudesOrdenadas, getCantando };
}

export const actualizarEstadoSolicitud = async (solicitudId: string, nuevoEstado: 'en_cola' | 'cantando' | 'completada' | 'rechazada') => {
  if (!db) return;
  await set(ref(db, `solicitudes/${solicitudId}/estado`), nuevoEstado);
  
  if (nuevoEstado === 'cantando') {
    await set(ref(db, `estado/cantandoId`), solicitudId);
  } else if (nuevoEstado === 'completada' || nuevoEstado === 'rechazada') {
    // Si la que estábamos cantando se completa o rechaza, limpiamos el estado actual
    // Obtenemos el cantandoId actual (solo si no estamos manejándolo a través del hook)
    // Para simplificar, confiaremos en que el admin panel llame esto correctamente.
  }
};

export const agregarSolicitud = async (solicitudData: Omit<Solicitud, 'id' | 'estado' | 'timestamp_solicitud'>) => {
  if (!db) return { exito: false, msj: "Firebase no configurado" };
  const solRef = push(ref(db, 'solicitudes'));
  await set(solRef, {
    ...solicitudData,
    estado: 'en_cola',
    timestamp_solicitud: Date.now()
  });
  return { exito: true, msj: "Enviado con éxito" };
};

// ========================
// AUTHENTICATION HOOKS
// ========================
export function useKanturnoAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    // Capturar el resultado si venimos de un redirect de Google
    getRedirectResult(auth).catch(err => {
      console.error("Error en redirección:", err);
      alert("Error de autenticación: " + err.message);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) return { exito: false, msj: "Firebase Auth no está configurado." };
    try {
      // Usamos redirect porque en celulares (especialmente iOS e in-app browsers) los popups fallan silenciosamente.
      await signInWithRedirect(auth, googleProvider);
      return { exito: true };
    } catch (error: any) {
      console.error(error);
      return { exito: false, msj: error.message };
    }
  };

  const logout = async () => {
    if (!auth) return;
    await auth.signOut();
  };

  return { user, loading, loginWithGoogle, logout };
}
