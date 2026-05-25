import React, { useState } from 'react';
import { Mail, MessageCircle, Share2 } from 'lucide-react';
import { agregarSolicitud } from '../lib/kanturnoLogic';

export const RequestFormCTA = () => {
  const [nombre, setNombre] = useState('');
  const [cancion, setCancion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !cancion) return;
    
    setIsSubmitting(true);
    // Asumiendo mesa 1 por defecto hasta que implementemos validación QR en otra parte
    const res = await agregarSolicitud({
      nombre_cantante: nombre,
      cancion: cancion,
      interprete: 'Desconocido', // Se podría agregar otro campo
      id_mesa: '1'
    });
    
    setMensaje(res.msj);
    setIsSubmitting(false);
    if(res.exito) {
      setNombre('');
      setCancion('');
    }
  };

  return (
    <section className="relative w-full flex justify-center bg-background overflow-hidden min-h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto block z-0 opacity-50"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4"
      />
      
      <div className="absolute inset-0 z-10 w-full max-w-[1831px] mx-auto">
        
        {/* Content Block */}
        <div className="absolute top-[20%] right-6 lg:right-0 lg:pr-[20%] lg:pl-[15%] max-w-full lg:max-w-none">
          <div className="relative">
            <span className="font-condiment absolute top-[-30px] sm:top-[-40px] left-0 text-neon text-[17px] sm:text-[40px] lg:text-[68px] mix-blend-exclusion normal-case" style={{ textTransform: 'none' }}>
              Pide tu turno
            </span>
            
            <h2 className="font-grotesk text-[16px] sm:text-[32px] md:text-[48px] lg:text-[60px] uppercase leading-[1.1]">
              <div className="mb-4 sm:mb-8 lg:mb-12">ÚNETE A LA NOCHE.</div>
              <div>CANTA CON EL ALMA.</div>
              <div>VIVE EL MOMENTO.</div>
              <div>SIGUE LA MÚSICA.</div>
            </h2>
          </div>
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="mt-8 liquid-glass p-6 rounded-[24px] max-w-md w-full backdrop-blur-md border border-white/10">
            {mensaje && <div className="text-neon font-mono mb-4 text-sm">{mensaje}</div>}
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del cantante" 
              className="w-full bg-transparent border-b border-white/20 p-3 mb-4 font-mono text-sm focus:outline-none focus:border-neon transition-colors text-white uppercase"
            />
            <input 
              type="text" 
              value={cancion}
              onChange={(e) => setCancion(e.target.value)}
              placeholder="Canción" 
              className="w-full bg-transparent border-b border-white/20 p-3 mb-6 font-mono text-sm focus:outline-none focus:border-neon transition-colors text-white uppercase"
            />
            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-neon text-[#010828] font-grotesk text-xl py-4 rounded-[16px] hover:bg-white transition-colors uppercase disabled:opacity-50">
              {isSubmitting ? 'ENVIANDO...' : 'Enviar a la cola'}
            </button>
          </form>
        </div>

        {/* Social Icons Bottom Left */}
        <div className="absolute left-[8%] bottom-[12%] lg:bottom-[20%]">
          <div className="flex flex-col liquid-glass rounded-[0.5rem] lg:rounded-[1.25rem]">
            {[Mail, MessageCircle, Share2].map((Icon, idx) => (
              <button key={idx} className={`w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem] h-[14vw] sm:h-[4rem] md:h-[3rem] lg:h-[4.5rem] flex items-center justify-center hover:bg-white/10 transition-colors ${idx !== 2 ? 'border-b border-white/10' : ''}`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
