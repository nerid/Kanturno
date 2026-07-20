import React from 'react';
import { RequestFormCTA } from './RequestFormCTA';

export const Hero = () => {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-center bg-background rounded-b-[32px] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center lg:object-[75%_center] z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4"
      />
      
      {/* Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 lg:py-24 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 lg:mb-16">
          <div className="font-grotesk text-[16px] uppercase tracking-wide">Kanturno.App</div>
          
          <nav className="hidden lg:flex items-center gap-8 liquid-glass rounded-[28px] px-[52px] py-[24px]">
            <a href="#inicio" className="font-grotesk text-[13px] uppercase hover:text-neon transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('inicio')?.scrollIntoView({behavior: 'smooth'})}}>Inicio</a>
            <a href="#cola" className="font-grotesk text-[13px] uppercase hover:text-neon transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('cola')?.scrollIntoView({behavior: 'smooth'})}}>Cola</a>
            <a href="#pedir" className="font-grotesk text-[13px] uppercase hover:text-neon transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('pedir')?.scrollIntoView({behavior: 'smooth'})}}>Pedir Canción</a>
            <a href="/admin" target="_blank" className="font-grotesk text-[13px] uppercase text-neon/80 hover:text-neon transition-colors">Admin</a>
          </nav>
          
          <div className="w-[100px] hidden lg:block" /> {/* Spacer */}
        </header>

        {/* Content Split Layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8 flex-1">
          
          {/* Title Side (Right on Desktop, Top on Mobile) */}
          <div className="w-full lg:w-auto order-1 lg:order-2 flex flex-col justify-center items-center lg:items-end text-center lg:text-right pointer-events-none mt-8 lg:mt-0">
            <h1 className="font-grotesk text-[40px] sm:text-[60px] md:text-[75px] lg:text-[85px] uppercase leading-[1.05] relative drop-shadow-2xl">
              Siente la música<br />
              y rompe límites
              
              <span className="font-condiment absolute -bottom-4 lg:-bottom-6 right-0 text-neon text-[32px] sm:text-[48px] md:text-[60px] -rotate-2 mix-blend-plus-lighter opacity-100 normal-case" style={{ textTransform: 'none' }}>
                Karaoke Night
              </span>
            </h1>
          </div>
          
          {/* Form Side (Left on Desktop, Bottom on Mobile) */}
          <div id="pedir" className="w-full lg:w-[420px] order-2 lg:order-1 relative z-20">
            <RequestFormCTA />
          </div>

        </div>
      </div>
    </section>
  );
};

