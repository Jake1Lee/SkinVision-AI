import React from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: React.ReactNode;
  backButton?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, backButton, className, style }) => {
  return (
    <div className={`${styles.glassCard} ${className}`} style={style}>
      {backButton}
      {children}
    </div>
  );
};

export default GlassCard;
