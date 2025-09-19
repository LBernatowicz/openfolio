"use client";

import { ReactNode, useEffect, useState } from 'react';

interface WelcomeCardProps {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  colStart?: number;
  rowStart?: number;
  hasExternalLink?: boolean;
  style?: React.CSSProperties;
}

export default function WelcomeCard({ children, className = '', width = 1, height = 1, colStart, rowStart, hasExternalLink = false, style }: WelcomeCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const widthClass = `col-span-${width}`;
  const heightClass = `row-span-${height}`;
  const colStartClass = colStart ? `col-start-${colStart}` : '';
  const rowStartClass = rowStart ? `row-start-${rowStart}` : '';
  const hoverClass = hasExternalLink ? 'card-hover-border' : 'card-hover';
  
  useEffect(() => {
    // Welcome pojawia się pierwszy - bez opóźnienia
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={`bg-transparent border border-slate-700 rounded-2xl p-4 ${hoverClass} ${widthClass} ${heightClass} ${colStartClass} ${rowStartClass} ${className} transition-all duration-1000 ease-out relative z-20 ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8'
      }`} 
      style={style}
    >
      {/* Tło wewnątrz sekcji zasłaniające światło */}
      <div className="absolute inset-0 bg-black rounded-2xl -z-10"></div>
      {children}
    </div>
  );
}
