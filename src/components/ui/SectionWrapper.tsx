import { ReactNode } from 'react';
import Card from './Card';

interface SectionWrapperProps {
  children: ReactNode;
  width: number;
  height: number;
  className?: string;
}

export default function SectionWrapper({ children, width, height, className = '' }: SectionWrapperProps) {
  return (
    <Card width={width} height={height} className={className}>
      {children}
    </Card>
  );
}
