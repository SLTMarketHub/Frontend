import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = true 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const paddingClasses = padding ? 'p-6' : '';
  
  return (
    <div className={`${baseClasses} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;

