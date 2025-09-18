import { ReactNode } from 'react';

interface VerticalGroupProps {
  children: ReactNode;
  width: number;
  height: number;
  colStart?: number;
  rowStart?: number;
  className?: string;
}

export default function VerticalGroup({ children, width, height, colStart, rowStart, className = '' }: VerticalGroupProps) {
  const widthClass = `col-span-${width}`;
  const heightClass = `row-span-${height}`;
  const colStartClass = colStart ? `col-start-${colStart}` : '';
  const rowStartClass = rowStart ? `row-start-${rowStart}` : '';
  
  return (
    <div className={`${widthClass} ${heightClass} ${colStartClass} ${rowStartClass} ${className}`}>
      <div className="flex flex-col gap-6 h-full">
        {children}
      </div>
    </div>
  );
}
