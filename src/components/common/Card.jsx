import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  padding = true,
  hover = false,
  gradient = false,
  className = '',
}) => {
  const cardClasses = `
    bg-white rounded-2xl shadow-lg border border-gray-100
    ${hover ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''}
    ${gradient ? 'overflow-hidden' : ''}
    ${className}
  `;

  return (
    <div className={cardClasses}>
      {(title || headerAction) && (
        <div className={`flex items-center justify-between px-6 py-4 ${gradient ? 'bg-slt-gradient text-white' : 'border-b border-gray-100'}`}>
          <div>
            {title && (
              <h3 className={`text-lg font-semibold ${gradient ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            )}
            {subtitle && (
              <p className={`mt-1 text-sm ${gradient ? 'text-white/90' : 'text-gray-500'}`}>{subtitle}</p>
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
  const gradientClasses = {
    primary: 'from-slt-primary to-slt-teal',
    secondary: 'from-slt-secondary to-slt-cyan',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-amber-500 to-orange-500',
    error: 'from-red-500 to-rose-500',
    info: 'from-slt-secondary to-slt-primary',
  };

  const bgClasses = {
    primary: 'from-green-50 to-teal-50',
    secondary: 'from-blue-50 to-cyan-50',
    success: 'from-green-50 to-emerald-50',
    warning: 'from-amber-50 to-orange-50',
    error: 'from-red-50 to-rose-50',
    info: 'from-blue-50 to-teal-50',
  };
  
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientClasses[color]} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <Card hover className={`relative bg-gradient-to-br ${bgClasses[color]} border-0`}>
        <div className="relative">
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradientClasses[color]} text-white shadow-lg mb-4`}>
            {icon}
          </div>
          
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</p>
          
          <p className={`text-3xl font-bold bg-gradient-to-r ${gradientClasses[color]} bg-clip-text text-transparent mb-3`}>{value}</p>
          
          {trendValue && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${trendColor} flex items-center`}>
                <span className="text-lg">{trendIcon}</span>
                <span className="ml-1">{trendValue}</span>
              </span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Card;