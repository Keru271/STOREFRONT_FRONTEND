'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: number;
}

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (options: ToastOptions | string) => string;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  success: (message: string, title?: string, options?: Partial<ToastOptions>) => string;
  error: (message: string, title?: string, options?: Partial<ToastOptions>) => string;
  info: (message: string, title?: string, options?: Partial<ToastOptions>) => string;
  warning: (message: string, title?: string, options?: Partial<ToastOptions>) => string;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (options: ToastOptions | string): string => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const resolved: ToastOptions =
        typeof options === 'string' ? { message: options, type: 'info' } : options;

      const duration = resolved.duration ?? 3500;

      const newToast: ToastItem = {
        id,
        type: resolved.type || 'info',
        title: resolved.title,
        message: resolved.message,
        duration,
        action: resolved.action,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        // Keep max 4 toasts on screen
        const updated = [...prev, newToast];
        if (updated.length > 4) {
          return updated.slice(updated.length - 4);
        }
        return updated;
      });

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }

      return id;
    },
    [hideToast]
  );

  const success = useCallback(
    (message: string, title?: string, options?: Partial<ToastOptions>) =>
      showToast({ ...options, type: 'success', message, title }),
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string, options?: Partial<ToastOptions>) =>
      showToast({ ...options, type: 'error', message, title: title || 'Error' }),
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string, options?: Partial<ToastOptions>) =>
      showToast({ ...options, type: 'info', message, title }),
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string, options?: Partial<ToastOptions>) =>
      showToast({ ...options, type: 'warning', message, title: title || 'Notice' }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        hideToast,
        clearToasts,
        success,
        error,
        info,
        warning,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
