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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-slt-primary hover:bg-slt-primary/90 text-white focus:ring-slt-primary disabled:bg-gray-300',
    secondary: 'bg-slt-secondary hover:bg-slt-secondary/90 text-white focus:ring-slt-secondary disabled:bg-gray-300',
    outline: 'border-2 border-slt-primary text-slt-primary hover:bg-slt-light focus:ring-slt-primary disabled:border-gray-300 disabled:text-gray-400',
    ghost: 'text-slt-primary hover:bg-slt-light focus:ring-slt-primary disabled:text-gray-400',
    danger: 'bg-error hover:bg-error/90 text-white focus:ring-error disabled:bg-gray-300',
    success: 'bg-success hover:bg-success/90 text-white focus:ring-success disabled:bg-gray-300',
    warning: 'bg-warning hover:bg-warning/90 text-white focus:ring-warning disabled:bg-gray-300',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;