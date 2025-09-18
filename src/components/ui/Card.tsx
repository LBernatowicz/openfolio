import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  colStart?: number;
  rowStart?: number;
  hasExternalLink?: boolean;
  style?: React.CSSProperties;
}

export default function Card({ children, className = '', width = 1, height = 1, colStart, rowStart, hasExternalLink = false, style }: CardProps) {
  const widthClass = `col-span-${width}`;
  const heightClass = `row-span-${height}`;
  const colStartClass = colStart ? `col-start-${colStart}` : '';
  const rowStartClass = rowStart ? `row-start-${rowStart}` : '';
  const hoverClass = hasExternalLink ? 'card-hover-border' : 'card-hover';
  
  return (
    <div className={`bg-black border border-slate-700 rounded-2xl p-4 ${hoverClass} ${widthClass} ${heightClass} ${colStartClass} ${rowStartClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
