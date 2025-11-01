import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  padding = true,
  hover = false,
  className = '',
}) => {
  const cardClasses = `
    bg-white rounded-lg shadow-card
    ${hover ? 'hover:shadow-card-hover transition-shadow duration-200' : ''}
    ${className}
  `;
  
  return (
    <div className={cardClasses}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {headerAction && (
            <div className="flex-shrink-0">{headerAction}</div>
          )}
        </div>
      )}
      
      <div className={padding ? 'p-6' : ''}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'primary',
}) => {
  const colorClasses = {
    primary: 'bg-slt-primary text-white',
    secondary: 'bg-slt-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
  };
  
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-gray-500';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  
  return (
    <Card hover className="relative overflow-hidden">
      <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 opacity-50" />
      
      <div className="relative">
        <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-3`}>
          {icon}
        </div>
        
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        
        {trendValue && (
          <div className="flex items-center">
            <span className={`text-sm font-semibold ${trendColor}`}>
              {trendIcon} {trendValue}
            </span>
            <span className="text-xs text-gray-500 ml-2">vs last period</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;