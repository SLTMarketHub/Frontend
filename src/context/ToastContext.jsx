import React, { createContext, useContext, useMemo, useCallback, useState } from 'react';
import { setToastNotifier } from '../utils/toastBus';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const api = useMemo(() => ({
    toasts,
    removeToast,
    addToast,
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  }), [toasts, removeToast, addToast]);

  return (
    <ToastContext.Provider value={api}>
      {/* Register a global notifier for non-React contexts (e.g., services) */}
      {setToastNotifier((evt) => {
        if (!evt) return;
        const { type = 'info', message = '', duration = 3000 } = evt || {};
        addToast(message, type, duration);
      })}
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within a ToastProvider');
  return ctx;
};

// Alias for backward compatibility
export const useToast = () => {
  const toast = useToastContext();
  return { toast };
};

export default ToastContext;
