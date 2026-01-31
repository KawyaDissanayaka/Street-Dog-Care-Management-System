import React from 'react';

const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`glass-panel ${className}`} style={{ padding: '20px' }}>
      {children}
    </div>
  );
};

export default GlassCard;
