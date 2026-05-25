import React from 'react';
import { Mail, MessageCircle, Share2 } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex justify-center bg-background rounded-b-[32px] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4"
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

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center relative mt-12 lg:mt-0 lg:ml-32 max-w-[780px]">
          <h1 className="font-grotesk text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px] uppercase leading-[1.05] md:leading-[1] relative">
            Siente la música<br />
            y ( rompe ) tus límites
            
            <span className="font-condiment absolute right-0 top-0 sm:top-[-20px] text-neon text-[24px] sm:text-[36px] md:text-[48px] -rotate-1 mix-blend-exclusion opacity-90 normal-case" style={{ textTransform: 'none' }}>
              Karaoke Night
            </span>
          </h1>

          {/* Mobile CTA */}
          <div className="flex lg:hidden mt-8 justify-start">
            <a href="#pedir" className="bg-neon text-black font-grotesk text-[18px] uppercase px-8 py-4 rounded-[16px] hover:bg-white transition-colors">
              Pedir Canción Ahora
            </a>
          </div>
        </div>

        {/* Desktop CTA Floating */}
        <div className="hidden lg:flex flex-col gap-4 absolute right-12 top-1/2 -translate-y-1/2">
          <a href="#pedir" className="w-[80px] h-[80px] liquid-glass rounded-full flex flex-col items-center justify-center hover:bg-neon hover:text-black transition-colors text-white group">
            <span className="font-grotesk text-[10px] uppercase text-center leading-tight">Pedir<br/>Canción</span>
          </a>
        </div>
      </div>
    </section>
  );
};

const SocialButtons = () => (
  <>
    <button className="w-[56px] h-[56px] liquid-glass rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-colors">
      <Mail className="w-[20px] h-[20px]" />
    </button>
    <button className="w-[56px] h-[56px] liquid-glass rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-colors">
      <MessageCircle className="w-[20px] h-[20px]" />
    </button>
    <button className="w-[56px] h-[56px] liquid-glass rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-colors">
      <Share2 className="w-[20px] h-[20px]" />
    </button>
  </>
);
