import React from 'react';
import { RequestFormCTA } from './RequestFormCTA';

export const Hero = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex justify-center bg-background rounded-b-[32px] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center lg:object-[75%_center] z-0"
        src="/astronauta_disco.mp4"
      />
      
      {/* Container */}
      <div className="relative z-10 w-full max-w-[1831px] px-6 md:px-12 pt-8 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="font-grotesk text-[16px] uppercase tracking-wide">Kanturno.App</div>
          
          <nav className="hidden lg:flex items-center gap-8 liquid-glass rounded-[28px] px-[52px] py-[24px]">
            <a href="#inicio" className="font-grotesk text-[13px] uppercase hover:text-neon transition-colors">Inicio</a>
            <a href="#cola" className="font-grotesk text-[13px] uppercase hover:text-neon transition-colors">Cola</a>
            <a href="#pedir" className="font-grotesk text-[13px] uppercase hover:text-neon transition-colors">Pedir Canción</a>
            <a href="/admin" className="font-grotesk text-[13px] uppercase text-neon/80 hover:text-neon transition-colors">Admin</a>
          </nav>
          
          <div className="w-[100px] hidden lg:block" /> {/* Spacer */}
        </header>

        {/* Content Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between relative mt-8 lg:mt-0 lg:ml-12 max-w-[1400px] gap-8">
          
          {/* Form Side (Left on Desktop, Bottom on Mobile) */}
          <div className="w-full lg:w-[450px] flex-shrink-0 order-2 lg:order-1 mt-8 lg:mt-0">
            <RequestFormCTA />
          </div>

          {/* Title Side (Right on Desktop, Top on Mobile) */}
          <div className="w-full lg:w-auto order-1 lg:order-2 flex flex-col justify-center items-center lg:items-end text-center lg:text-right pointer-events-none">
            <h1 className="font-grotesk text-[40px] sm:text-[60px] md:text-[75px] lg:text-[85px] uppercase leading-[1.05] relative drop-shadow-2xl">
              Siente la música<br />
              y rompe límites
              
              <span className="font-condiment absolute -bottom-8 lg:-bottom-12 right-0 text-neon text-[32px] sm:text-[48px] md:text-[60px] -rotate-2 mix-blend-plus-lighter opacity-100 normal-case" style={{ textTransform: 'none' }}>
                Karaoke Night
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

