import React from 'react';
import { useKanturnoData } from '../lib/kanturnoLogic';
import { Mic2 } from 'lucide-react';

export const TV = () => {
  const { getCantando, getSolicitudesOrdenadas } = useKanturnoData();
  const cantando = getCantando();
  const queue = getSolicitudesOrdenadas().slice(0, 3); // Solo mostrar los siguientes 3

  // Helper para heurística de género (simplificado, si termina en 'a' se asume mujer)
  const isFemale = (name: string) => name.trim().toLowerCase().endsWith('a');

  // Helper para obtener imagen y color basado en el nombre
  const getThemeProps = (name: string | undefined) => {
    if (!name) return { color: 'text-neon', gradient: 'from-neon/10', bgImage: '' };
    
    const female = isFemale(name);
    // Usar longitud del nombre para asignar una imagen determinista
    const imgIndex = name.length % 3;
    const images = [
      '/assets/astronaut_singing_1_1784561857620.png',
      '/assets/astronaut_singing_2_1784561868781.png',
      '/assets/astronaut_dj_1784561878999.png'
    ];
    
    return {
      color: female ? 'text-fuchsia-400' : 'text-neon',
      gradient: female ? 'from-fuchsia-500/20' : 'from-neon/20',
      bgImage: images[imgIndex]
    };
  };

  const theme = getThemeProps(cantando?.nombre_cantante);

  return (
    <div className="w-full h-screen bg-[#010828] flex overflow-hidden">
      
      {/* SECCIÓN PRINCIPAL: CANTANDO AHORA */}
      <div className="flex-1 flex flex-col justify-center items-center relative p-12 overflow-hidden">
        
        {/* Imagen de fondo si hay cantante */}
        {cantando && (
          <div 
            className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-cover bg-center transition-all duration-1000 scale-105"
            style={{ backgroundImage: `url(${theme.bgImage})` }}
          />
        )}

        {/* Fondo animado sutil */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} to-blue-900/20 blur-3xl opacity-50 mix-blend-screen transition-colors duration-1000`} />
        
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className={`flex items-center gap-4 ${theme.color} mb-8 transition-colors duration-1000`}>
            <Mic2 className="w-12 h-12 animate-pulse" />
            <span className="font-mono text-2xl uppercase tracking-[0.2em]">En el escenario</span>
          </div>

          {cantando ? (
            <>
              <h1 className="font-grotesk text-[80px] sm:text-[120px] lg:text-[160px] uppercase text-white leading-[0.9] drop-shadow-[0_0_40px_rgba(255,255,255,0.3)] mb-8">
                {cantando.nombre_cantante}
              </h1>
              <p className={`font-condiment text-[40px] sm:text-[60px] lg:text-[80px] ${theme.color} -rotate-2 mix-blend-plus-lighter transition-colors duration-1000`} style={{ textTransform: 'none' }}>
                {cantando.cancion}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-grotesk text-[80px] sm:text-[120px] uppercase text-white/20 leading-[0.9] mb-8">
                ESCENARIO<br />LIBRE
              </h1>
              <p className="font-mono text-2xl text-cream/50 uppercase">
                Escanea el QR para pedir tu canción
              </p>
            </>
          )}
        </div>
      </div>

      {/* SECCIÓN LATERAL: SIGUIENTES EN COLA */}
      <div className="w-[400px] bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col p-8 z-20">
        <h2 className="font-grotesk text-3xl uppercase text-white mb-8 border-b border-white/10 pb-4">
          Próximos Turnos
        </h2>
        
        <div className="flex flex-col gap-6 flex-1">
          {queue.length === 0 ? (
            <p className="font-mono text-cream/30 uppercase text-center mt-12">La cola está vacía</p>
          ) : (
            queue.map((sol, idx) => (
              <div key={sol.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="font-grotesk text-3xl text-white/30">{idx + 1}</div>
                <div className="flex flex-col">
                  <span className="font-grotesk text-xl uppercase text-white">{sol.nombre_cantante}</span>
                  <span className="font-mono text-sm uppercase text-cream/70">{sol.cancion}</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="font-mono text-sm text-neon uppercase tracking-widest mb-4">kanturno.app</p>
          <div className="w-full aspect-square bg-white rounded-2xl flex items-center justify-center p-4">
             {/* Aquí iría un componente QRCodeSVG en producción, usando una imagen estática por ahora o importándolo si es necesario */}
             <div className="text-black font-grotesk uppercase text-xl">QR Code</div>
          </div>
        </div>
      </div>
    </div>
  );
};
