import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  };

  const colors = {
    success: 'bg-green-50 border-success text-success',
    error: 'bg-red-50 border-error text-error',
    warning: 'bg-orange-50 border-warning text-warning',
    info: 'bg-blue-50 border-info text-info',
  };

  return (
    <div
      className={`flex items-center space-x-3 p-4 rounded-lg border-l-4 shadow-lg ${colors[type]} animate-slide-in`}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium text-gray-900">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition"
        aria-label="Close"
      >
        <X size={16} className="text-gray-600" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
