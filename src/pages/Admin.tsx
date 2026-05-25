import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export const Admin = () => {
  const [pin, setPin] = useState('');
  
  // Rotar PIN cada 30 segundos para demostración (normalmente 1 hora)
  useEffect(() => {
    const generarPin = () => {
      const nuevoPin = Math.floor(1000 + Math.random() * 9000).toString();
      setPin(nuevoPin);
    };
    
    generarPin();
    const interval = setInterval(generarPin, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-background pt-12 px-6 flex flex-col items-center">
      <h1 className="font-grotesk text-4xl sm:text-6xl uppercase text-cream mb-8">Admin Dashboard</h1>
      
      <div className="liquid-glass p-8 rounded-[32px] w-full max-w-2xl text-center">
        <h2 className="font-grotesk text-2xl uppercase mb-4 text-neon">Código de Acceso del Local</h2>
        <p className="font-mono text-sm text-cream/70 mb-8 uppercase">
          Los usuarios deben ingresar este PIN o escanear el QR para poder pedir canciones. Esto evita el spam desde casa.
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
      
      <div className="mt-12 liquid-glass p-8 rounded-[32px] w-full max-w-2xl">
        <h2 className="font-grotesk text-2xl uppercase mb-4">Gestión de Cola</h2>
        <p className="font-mono text-sm text-cream/70 uppercase">
          Aquí se conectará con Firebase para ver la cola real y asignar turnos, de la misma forma que en la Opción A. (En desarrollo).
        </p>
      </div>
    </div>
  );
};
