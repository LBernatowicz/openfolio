import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
}

export default function Card({ children, className = '', width = 1, height = 1 }: CardProps) {
  const widthClass = `col-span-${width}`;
  const heightClass = `row-span-${height}`;
  
  return (
    <div className={`bg-black border border-slate-700 rounded-2xl p-4 card-hover ${widthClass} ${heightClass} ${className}`}>
      {children}
    </div>
  );
}
