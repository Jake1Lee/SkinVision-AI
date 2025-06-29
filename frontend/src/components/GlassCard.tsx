'use client';

import React from 'react';
import styles from './GlassCard.module.css';
import { usePathname } from 'next/navigation';

interface GlassCardProps {
  children: React.ReactNode;
  backButton?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, backButton, className, style }) => {
  const pathname = usePathname();
  const isBenchmarkingPage = pathname.includes('/benchmarking');
  
  return (
    <div 
      className={`${styles.glassCard} ${className}`} 
      style={{
        ...style,
        color: isBenchmarkingPage ? '#000' : 'inherit'
      }}
    >
      {backButton}
      {children}
    </div>
  );
};

export default GlassCard;
