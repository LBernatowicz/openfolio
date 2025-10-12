"use client";

import { useEffect, useState } from "react";

export default function CursorLight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Sprawdź czy kursor jest nad kartą
      const target = e.target as HTMLElement;
      target.closest('.card-hover, .card-hover-border, [class*="col-span-"], [class*="row-span-"]');
      
      // Pokaż lampkę zawsze - światło jest widoczne na całym ekranie
      // ale będzie zasłonięte przez wewnętrzne tło kart
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Dodaj event listenery
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 15,
      }}
    >
      {/* Główna lampka - bardzo rozproszone światło */}
      <div className="relative">
        {/* Światło zewnętrzne - ogromny zasięg z bardzo miękkim przejściem */}
        <div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.15) 20%, rgba(59, 130, 246, 0.1) 40%, rgba(59, 130, 246, 0.05) 60%, rgba(59, 130, 246, 0.02) 80%, transparent 95%)',
            filter: 'blur(80px)',
            transform: 'translate(-50%, -50%)',
            opacity: 1,
          }}
        />
        
        {/* Światło środkowe - duży zasięg z miękkim przejściem */}
        <div 
          className="absolute w-100 h-100 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.18) 25%, rgba(59, 130, 246, 0.12) 50%, rgba(59, 130, 246, 0.06) 75%, transparent 90%)',
            filter: 'blur(35px)',
            transform: 'translate(-50%, -50%)',
            opacity: 0.2,
          }}
        />
        
        {/* Światło wewnętrzne - średni zasięg z miękkim przejściem */}
        <div 
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.22) 30%, rgba(59, 130, 246, 0.15) 60%, rgba(59, 130, 246, 0.08) 80%, transparent 95%)',
            filter: 'blur(25px)',
            transform: 'translate(-50%, -50%)',
            opacity: 0.25,
          }}
        />
        
        {/* Dodatkowe bardzo rozproszone światło */}
        <div 
          className="absolute w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 30%, rgba(59, 130, 246, 0.05) 60%, rgba(59, 130, 246, 0.02) 85%, transparent 98%)',
            filter: 'blur(40px)',
            transform: 'translate(-50%, -50%)',
            opacity: 0.12,
          }}
        />
        
        {/* Najbardziej rozproszone światło - ogromny zasięg */}
        <div 
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.05) 40%, rgba(59, 130, 246, 0.02) 70%, transparent 95%)',
            filter: 'blur(60px)',
            transform: 'translate(-50%, -50%)',
            opacity: 0.08,
          }}
        />
      </div>
    </div>
  );
}
