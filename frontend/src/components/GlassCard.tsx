import React from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: React.ReactNode;
  backButton?: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, backButton, className }) => {
  return (
    <div className={`${styles.glassCard} ${className}`}>
      {backButton}
      {children}
    </div>
  );
};

export default GlassCard;
