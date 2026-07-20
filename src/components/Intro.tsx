import React from 'react';

export const Intro = () => {
  return (
    <section className="relative w-full min-h-[80vh] flex justify-center bg-background py-16 md:py-24 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        src="/astronauta_disco.mp4"
      />
      
      <div className="relative z-10 w-full max-w-[1831px] px-6 md:px-12 flex flex-col justify-between">
        
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <h2 className="font-grotesk text-[32px] sm:text-[48px] lg:text-[60px] uppercase leading-tight relative">
            ¡Hola!<br />
            Soy Kanturno
            
            <span className="font-condiment block mt-4 lg:mt-6 text-neon text-[36px] sm:text-[52px] lg:text-[68px] rotate-[-5deg] mix-blend-exclusion normal-case" style={{ textTransform: 'none' }}>
              Verificación
            </span>
          </h2>
          
          <p className="font-mono text-[14px] md:text-[16px] uppercase text-cream max-w-[266px] leading-relaxed">
            Un sistema digital fijado en el tiempo y el lugar. Escanea el QR del local para poder pedir tus canciones.
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-row justify-between mt-24">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[12px] uppercase opacity-10 hidden sm:block md:text-cream text-[#010828]">
              Un sistema digital fijado en el tiempo y el lugar. Escanea el QR del local para poder pedir tus canciones.
            </p>
            <p className="font-mono text-[12px] uppercase opacity-10 hidden sm:block md:text-cream text-[#010828]">
              Un sistema digital fijado en el tiempo y el lugar. Escanea el QR del local para poder pedir tus canciones.
            </p>
          </div>
          
          <div className="hidden lg:flex flex-col gap-4">
            <p className="font-mono text-[12px] uppercase opacity-10">
              Un sistema digital fijado en el tiempo y el lugar. Escanea el QR del local para poder pedir tus canciones.
            </p>
            <p className="font-mono text-[12px] uppercase opacity-10">
              Un sistema digital fijado en el tiempo y el lugar. Escanea el QR del local para poder pedir tus canciones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
