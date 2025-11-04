import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { Toast, ToastAction, ToastViewport, ToastProvider as RadixToastProvider } from '../components/ui/toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const dismissToast = useCallback((id) => {
        setToasts((current) => current.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback(
        ({ title, description, type = 'default', action, duration = 5000 }) => {
            const id = Math.random().toString(36).substring(2, 9);
            setToasts((current) => [...current, { id, title, description, type, action, duration }]);

            if (duration > 0) {
                setTimeout(() => dismissToast(id), duration);
            }

            return { id, dismiss: () => dismissToast(id) };
        },
        [dismissToast]
    );

    const value = useMemo(() => ({ toast, dismissToast }), [toast, dismissToast]);

    return (
        <ToastContext.Provider value={value}>
            <RadixToastProvider>
                {children}
                {toasts.map(({ id, title, description, type, action }) => (
                    <Toast
                        key={id}
                        variant={
                            type === 'error'
                                ? 'destructive'
                                : type === 'success'
                                    ? 'success'
                                    : type === 'warning'
                                        ? 'warning'
                                        : type === 'info'
                                            ? 'info'
                                            : 'default'
                        }
                        onOpenChange={(open) => {
                            if (!open) dismissToast(id);
                        }}
                    >
                        <div className="grid gap-1">
                            <h3 className="text-sm font-semibold">{title}</h3>
                            {description && <p className="text-sm opacity-90">{description}</p>}
                        </div>
                        {action && (
                            <ToastAction altText={action.label} onClick={action.onClick}>
                                {action.label}
                            </ToastAction>
                        )}
                    </Toast>
                ))}
                <ToastViewport />
            </RadixToastProvider>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
