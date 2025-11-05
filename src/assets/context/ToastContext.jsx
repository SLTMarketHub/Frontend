import * as React from 'react';
import { Toast, ToastAction, ToastViewport, ToastProvider as RadixToastProvider } from '..//components/common/Toast';

const ToastContext = React.createContext(undefined);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = React.useState([]);

    const dismissToast = React.useCallback((id) => {
        setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id)
        );
    }, []);

    const toast = React.useCallback(({ title, description, type = 'default', action, duration = 5000 }) => {
        const id = Math.random().toString(36).substring(2, 9);

        setToasts((currentToasts) => [
            ...currentToasts,
            { id, title, description, type, action, duration },
        ]);

        if (duration > 0) {
            setTimeout(() => {
                dismissToast(id);
            }, duration);
        }

        return {
            id,
            dismiss: () => dismissToast(id)
        };
    }, [dismissToast]);

    const value = React.useMemo(
        () => ({
            toast,
            dismissToast,
        }),
        [toast, dismissToast]
    );

    return (
        <ToastContext.Provider value={value}>
            <RadixToastProvider>
                {children}
                {toasts.map(({ id, title, description, type, action }) => (
                    <Toast
                        key={id}
                        variant={type === 'error' ? 'destructive' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'info' ? 'info' : 'default'}
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
    const context = React.useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};