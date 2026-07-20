import React, { useState } from 'react';
import { Mail, MessageCircle, Share2, LogOut } from 'lucide-react';
import { agregarSolicitud, useKanturnoAuth } from '../lib/kanturnoLogic';

export const RequestFormCTA = () => {
  const { user, loading, loginWithGoogle, logout } = useKanturnoAuth();
  const [nombre, setNombre] = useState('');
  const [cancion, setCancion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setMensaje('');
    try {
      const res = await loginWithGoogle();
      if (res && !res.exito) {
        setMensaje("Error: " + (res.msj || "No se pudo iniciar sesión"));
        alert("Error de inicio de sesión: " + (res.msj || "Por favor, autoriza en tu navegador."));
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

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
    <div className="w-full liquid-glass p-6 rounded-[24px] backdrop-blur-md border border-white/10 shadow-2xl relative">
      {/* Decorative gradients */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {loading ? (
          <div className="text-cream text-center font-mono py-8">Cargando...</div>
        ) : !user ? (
          <div className="flex flex-col items-center py-4">
            <h3 className="font-grotesk text-2xl uppercase mb-2">Acceso VIP</h3>
            <p className="font-mono text-sm text-cream/80 text-center mb-6 uppercase">
              Inicia sesión para pedir tu canción
            </p>
            {mensaje && <div className="text-neon font-mono mb-4 text-sm bg-black/30 p-2 rounded max-w-full overflow-hidden text-center">{mensaje}</div>}
            <button 
              onClick={handleLogin}
              className="w-full bg-white text-black font-grotesk text-xl py-4 rounded-[16px] hover:bg-gray-200 transition-colors uppercase flex items-center justify-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span>Iniciar con Google</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-xs text-cream/70 uppercase">Hola, {user.displayName}</span>
              <button type="button" onClick={logout} className="text-cream/50 hover:text-white" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            {mensaje && <div className="text-neon font-mono mb-4 text-sm bg-black/30 p-2 rounded">{mensaje}</div>}
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del cantante" 
              className="w-full bg-black/20 border-b border-white/20 p-3 mb-4 font-mono text-sm focus:outline-none focus:border-neon focus:bg-black/40 transition-all text-white uppercase rounded-t-md"
            />
            <input 
              type="text" 
              value={cancion}
              onChange={(e) => setCancion(e.target.value)}
              placeholder="Canción" 
              className="w-full bg-black/20 border-b border-white/20 p-3 mb-6 font-mono text-sm focus:outline-none focus:border-neon focus:bg-black/40 transition-all text-white uppercase rounded-t-md"
            />
            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-neon text-[#010828] font-grotesk text-xl py-4 rounded-[16px] hover:bg-white transition-colors uppercase disabled:opacity-50">
              {isSubmitting ? 'ENVIANDO...' : 'Enviar a la cola'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
