import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slt-primary">404</h1>
        <p className="text-xl text-gray-600 mt-4">Page not found</p>
        <a
          href="/admin/dashboard"
          className="inline-block mt-6 px-6 py-3 bg-slt-primary text-white rounded-lg hover:bg-slt-primary/90 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
