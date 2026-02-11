"use client";

import { ReactNode, useEffect, useState } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  colStart?: number;
  rowStart?: number;
  hasExternalLink?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function Card({ children, className = '', width = 1, height = 1, colStart, rowStart, hasExternalLink = false, style, onClick }: CardProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const widthClass = `col-span-${width}`;
  const heightClass = `row-span-${height}`;
  const colStartClass = colStart ? `col-start-${colStart}` : '';
  const rowStartClass = rowStart ? `row-start-${rowStart}` : '';
  const hoverClass = hasExternalLink ? 'card-hover-border' : 'card-hover';
  
  useEffect(() => {
    // Opóźnienie bazowe + losowe dla płynności
    const baseDelay = 200; // 200ms bazowe opóźnienie
    const randomDelay = Math.random() * 800; // 0-800ms losowe
    const totalDelay = baseDelay + randomDelay;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={`bg-transparent border border-slate-700 rounded-2xl p-4 ${hoverClass} ${widthClass} ${heightClass} ${colStartClass} ${rowStartClass} ${className} transition-all duration-700 ease-out relative z-20 ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8'
      } ${onClick ? 'cursor-pointer' : ''}`} 
      style={style}
      onClick={onClick}
    >
      {/* Tło wewnątrz sekcji zasłaniające światło */}
      <div 
        className="absolute inset-0 bg-black rounded-2xl"
        style={{ zIndex: 20 }}
      ></div>
      <div 
        className="relative"
        style={{ zIndex: 30 }}
      >
        {children}
      </div>
    </div>
  );
}
