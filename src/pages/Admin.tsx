import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useKanturnoData, actualizarEstadoSolicitud } from '../lib/kanturnoLogic';
import { Play, Check, Trash2 } from 'lucide-react';

export const Admin = () => {
  const [pin, setPin] = useState('');
  const { getSolicitudesOrdenadas, getCantando } = useKanturnoData();
  const queue = getSolicitudesOrdenadas();
  const cantando = getCantando();
  
  // Rotar PIN cada 30 segundos para demostración
  useEffect(() => {
    const generarPin = () => {
      const nuevoPin = Math.floor(1000 + Math.random() * 9000).toString();
      setPin(nuevoPin);
    };
    
    generarPin();
    const interval = setInterval(generarPin, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLlamar = async (id: string) => {
    if (cantando) {
      // Si ya hay alguien cantando, lo completamos automáticamente al llamar al siguiente
      await actualizarEstadoSolicitud(cantando.id, 'completada');
    }
    await actualizarEstadoSolicitud(id, 'cantando');
  };

  const handleCompletar = async (id: string) => {
    await actualizarEstadoSolicitud(id, 'completada');
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta solicitud de la cola?')) {
      await actualizarEstadoSolicitud(id, 'rechazada');
    }
  };

  return (
    <div className="w-full min-h-screen bg-background pt-12 px-6 flex flex-col items-center pb-24">
      <h1 className="font-grotesk text-4xl sm:text-6xl uppercase text-cream mb-8">Admin Dashboard</h1>
      
      {/* SECCIÓN ACTUALMENTE CANTANDO */}
      <div className="w-full max-w-4xl liquid-glass p-8 rounded-[32px] mb-8 border border-neon/50 shadow-[0_0_30px_rgba(111,255,0,0.2)]">
        <h2 className="font-grotesk text-2xl uppercase mb-4 text-neon flex items-center gap-3">
          <Play className="w-6 h-6 fill-neon" />
          En el Escenario
        </h2>
        
        {cantando ? (
          <div className="flex flex-col md:flex-row justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/10">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="font-grotesk text-3xl uppercase text-white mb-2">{cantando.nombre_cantante}</h3>
              <p className="font-mono text-xl text-cream/80 uppercase">{cantando.cancion}</p>
            </div>
            
            <button 
              onClick={() => handleCompletar(cantando.id)}
              className="bg-neon text-background font-grotesk text-xl px-8 py-4 rounded-xl hover:bg-white transition-colors uppercase flex items-center gap-3">
              <Check className="w-6 h-6" /> Terminar Canción
            </button>
          </div>
        ) : (
          <div className="text-center py-8 text-cream/50 font-mono uppercase">
            Nadie está cantando en este momento.
          </div>
        )}
      </div>

      {/* SECCIÓN LA COLA */}
      <div className="w-full max-w-4xl liquid-glass p-8 rounded-[32px] mb-12">
        <h2 className="font-grotesk text-2xl uppercase mb-6 text-white flex items-center justify-between">
          Siguientes en Cola ({queue.length})
          <a href="/tv" target="_blank" className="text-sm text-neon underline hover:text-white">Abrir Pantalla TV</a>
        </h2>
        
        <div className="flex flex-col gap-4">
          {queue.length === 0 ? (
            <p className="text-cream/50 font-mono uppercase text-center py-8">La cola está vacía.</p>
          ) : (
            queue.map((sol, index) => (
              <div key={sol.id} className="flex flex-col sm:flex-row justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-black/40 transition-colors">
                
                <div className="flex items-center gap-6 mb-4 sm:mb-0 w-full sm:w-auto">
                  <div className="font-grotesk text-4xl text-white/20 w-8 text-center">{index + 1}</div>
                  <div>
                    <h4 className="font-grotesk text-xl uppercase text-white">{sol.nombre_cantante}</h4>
                    <p className="font-mono text-sm text-cream/70 uppercase">{sol.cancion}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => handleLlamar(sol.id)}
                    className="bg-white/10 hover:bg-neon hover:text-black text-white px-6 py-2 rounded-lg font-grotesk uppercase transition-colors">
                    Llamar
                  </button>
                  <button 
                    onClick={() => handleEliminar(sol.id)}
                    className="bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white p-2 rounded-lg transition-colors"
                    title="Eliminar de la cola">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* CÓDIGO QR */}
      <div className="liquid-glass p-8 rounded-[32px] w-full max-w-2xl text-center">
        <h2 className="font-grotesk text-2xl uppercase mb-4 text-cream">Código de Acceso del Local</h2>
        <p className="font-mono text-sm text-cream/70 mb-8 uppercase">
          El público debe ingresar este PIN o escanear el QR para poder pedir canciones.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="bg-white p-4 rounded-xl">
            <QRCodeSVG value={`https://kanturno.netlify.app/?pin=${pin}`} size={200} />
          </div>
          
          <div className="flex flex-col items-center">
            <span className="font-mono text-xl uppercase text-cream/80 mb-2">PIN Actual:</span>
            <span className="font-grotesk text-[80px] text-neon leading-none tracking-widest">{pin}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};
