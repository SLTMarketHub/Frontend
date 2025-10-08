import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slt-secondary';
  
  const variantClasses = {
    // Solid backgrounds for reliability
    primary: 'bg-slt-secondary text-white hover:bg-slt-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all',
    secondary: 'bg-slt-cyan text-white hover:bg-slt-teal shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all',
    success: 'bg-slt-green text-white hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all',
    outline: 'border-2 border-slt-secondary text-slt-secondary hover:bg-slt-light hover:border-slt-primary transition-all',
    ghost: 'text-slt-dark hover:bg-slt-light transition-all',
    slt: 'bg-slt-primary text-white hover:bg-slt-secondary hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    rounded-xl font-semibold
    ${className}
  `;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${classes} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
      )}
      
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
    </button>
  );
};

export default Button;