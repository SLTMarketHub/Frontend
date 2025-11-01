import React from 'react';

export const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-slt-primary border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slt-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="animate-pulse">
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b border-gray-100 p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LoadingState = ({ loading, error, children, skeleton = null }) => {
  if (loading) {
    return skeleton || <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 font-medium">Error loading data</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return children;
};

export default LoadingSpinner;