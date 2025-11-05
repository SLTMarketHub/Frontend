import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Toast = React.forwardRef(
    ({ className, variant = 'default', title, description, action, closeButton = true, ...props }, ref) => {
        const baseClasses =
            'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all';
        const variantClasses = {
            default: 'border bg-white text-gray-900 dark:bg-gray-900 dark:text-white',
            destructive: 'border-red-500 bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-50',
            success: 'border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-50',
            warning: 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-50',
            info: 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-50',
        };

        return (
            <ToastPrimitive.Root
                ref={ref}
                className={cn(baseClasses, variantClasses[variant], className)}
                {...props}
            >
                <div className="grid gap-1">
                    {title && <ToastPrimitive.Title className="text-sm font-semibold">{title}</ToastPrimitive.Title>}
                    {description && (
                        <ToastPrimitive.Description className="text-sm opacity-90">{description}</ToastPrimitive.Description>
                    )}
                </div>

                {action}

                {closeButton && (
                    <ToastPrimitive.Close className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-100">
                        <X className="h-4 w-4" />
                    </ToastPrimitive.Close>
                )}
            </ToastPrimitive.Root>
        );
    }
);
Toast.displayName = 'Toast';

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitive.Viewport
        ref={ref}
        className={cn(
            'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
            className
        )}
        {...props}
    />
));
ToastViewport.displayName = 'ToastViewport';

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitive.Action
        ref={ref}
        className={cn(
            'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50',
            className
        )}
        {...props}
    />
));
ToastAction.displayName = 'ToastAction';

export { Toast, ToastProvider, ToastViewport, ToastAction };
