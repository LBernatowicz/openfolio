import { ReactNode } from 'react';
import Card from './Card';

interface SectionWrapperProps {
  children: ReactNode;
  width: number;
  height: number;
  colStart?: number;
  rowStart?: number;
  className?: string;
  hasExternalLink?: boolean;
  style?: React.CSSProperties;
}

export default function SectionWrapper({ children, width, height, colStart, rowStart, className = '', hasExternalLink = false, style }: SectionWrapperProps) {
  return (
    <Card width={width} height={height} colStart={colStart} rowStart={rowStart} className={className} hasExternalLink={hasExternalLink} style={style}>
      {children}
    </Card>
  );
}
