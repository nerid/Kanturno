import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useKanturnoData } from '../lib/kanturnoLogic';

const mockVideos = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4'
];

export const QueueGrid = () => {
  const { getSolicitudesOrdenadas } = useKanturnoData();
  const queue = getSolicitudesOrdenadas();
  
  // Si no hay datos, mostrar ejemplo visual (mock fallback)
  const displayQueue = queue.length > 0 ? queue : [
    { id: 'm1', nombre_cantante: 'Laura', cancion: 'Como la flor', prioridad: 9.8, video_idx: 0 },
    { id: 'm2', nombre_cantante: 'Carlos', cancion: 'Bohemian Rhapsody', prioridad: 8.5, video_idx: 1 },
    { id: 'm3', nombre_cantante: 'Ana', cancion: 'I Will Survive', prioridad: 7.2, video_idx: 2 }
  ];
  return (
    <section className="w-full bg-[#010828] py-16 md:py-24 flex justify-center">
      <div className="w-full max-w-[1831px] px-6 md:px-12 flex flex-col gap-16">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          
          <h2 className="font-grotesk text-[32px] sm:text-[48px] lg:text-[60px] uppercase leading-tight">
            Lista de<br />
            <div className="ml-12 sm:ml-24 md:ml-32 flex items-baseline gap-4">
              <span className="font-condiment text-neon normal-case" style={{ textTransform: 'none' }}>Karaoke</span>
              <span>songs</span>
            </div>
          </h2>

          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center gap-4">
              <span className="font-grotesk text-[32px] sm:text-[48px] lg:text-[60px] uppercase">VER</span>
              <div className="flex flex-col">
                <span className="font-grotesk text-[20px] sm:text-[28px] lg:text-[36px] uppercase leading-none">TODA</span>
                <span className="font-grotesk text-[20px] sm:text-[28px] lg:text-[36px] uppercase leading-none">LA COLA</span>
              </div>
            </div>
            <div className="w-full h-[6px] sm:h-[8px] lg:h-[10px] bg-neon mt-2" />
          </div>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {displayQueue.map((item, idx) => {
            const vidUrl = (item as any).video_idx !== undefined ? mockVideos[(item as any).video_idx] : mockVideos[idx % 3];
            
            return (
            <div key={item.id} className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition-colors group">
              <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  src={vidUrl}
                />
                
                {/* Top Bar (Priority) */}
                <div className="absolute top-4 inset-x-4 liquid-glass rounded-[20px] px-5 py-4 flex items-center justify-between z-10">
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] text-cream/70 uppercase shadow-black drop-shadow-md">PRIORIDAD:</span>
                    <span className="font-mono text-[16px] font-bold shadow-black drop-shadow-md">{item.prioridad ? item.prioridad.toFixed(1) : '0.0'}/10</span>
                  </div>
                  
                  <button className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Bottom Text (Name/Song) */}
                <div className="absolute inset-x-0 bottom-0 p-6 pt-12 bg-gradient-to-t from-[#010828]/90 to-transparent z-10">
                  <h3 className="font-grotesk text-2xl uppercase shadow-black drop-shadow-lg truncate">{item.nombre_cantante}</h3>
                  <p className="font-mono text-sm opacity-90 drop-shadow-lg uppercase truncate">{item.cancion}</p>
                </div>
              </div>
            </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
