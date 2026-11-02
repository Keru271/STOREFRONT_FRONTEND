'use client';

import React from 'react';
import { useToast, ToastItem } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import { SwipeToast } from '@/components/ui/SwipeToast';

export function ThemeToastContainer() {
  const { toasts, hideToast } = useToast();
  const { theme } = useTheme();

  if (!toasts || toasts.length === 0) return null;

  const template = (theme.activeTemplateSlug || 'mincom').toLowerCase();

  // 1. Mincom Theme Toasts (Warm Charcoal + Amber, Bottom Right)
  if (template.includes('mincom')) {
    return (
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <SwipeToast
              inline
              open={true}
              type={t.type}
              title={t.title || (t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Notice')}
              description={t.message}
              duration={t.duration || 4000}
              onClose={() => hideToast(t.id)}
              actionLabel={t.action?.label}
              onAction={t.action?.onClick}
              background="#23272a"
              borderColor="rgba(251, 191, 36, 0.35)"
              color="#f8fafc"
              fuseColor="#fbbf24"
              radius={16}
            />
          </div>
        ))}
      </div>
    );
  }

  // 2. Nova Theme Toasts (Dynamic Island Capsule, Top Center)
  if (template.includes('nova')) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2.5 max-w-md w-full pointer-events-none px-4">
        {toasts.map((t) => {
          const fuseColor =
            t.type === 'success'
              ? '#30d158'
              : t.type === 'error'
                ? '#ff453a'
                : t.type === 'warning'
                  ? '#ffd60a'
                  : '#0a84ff';

          return (
            <div key={t.id} className="pointer-events-auto w-full flex justify-center">
              <SwipeToast
                inline
                open={true}
                type={t.type}
                title={t.title}
                description={t.message}
                duration={t.duration || 4000}
                onClose={() => hideToast(t.id)}
                actionLabel={t.action?.label}
                onAction={t.action?.onClick}
                background="rgba(29, 29, 31, 0.95)"
                borderColor="rgba(255, 255, 255, 0.16)"
                color="#ffffff"
                fuseColor={fuseColor}
                radius={9999}
                className="shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              />
            </div>
          );
        })}
      </div>
    );
  }

  // 3. Luxe Theme Toasts (Haute Couture Luxury Notification, Top Right)
  if (template.includes('luxe')) {
    return (
      <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0 font-light">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <SwipeToast
              inline
              open={true}
              type={t.type}
              title={t.title || (t.type === 'success' ? 'CONFIRMED' : 'NOTIFICATION')}
              description={t.message}
              duration={t.duration || 4000}
              onClose={() => hideToast(t.id)}
              actionLabel={t.action?.label}
              onAction={t.action?.onClick}
              background="#0e1014"
              borderColor="rgba(197, 168, 128, 0.5)"
              color="#f4eee6"
              fuseColor="#c5a880"
              radius={4}
            />
          </div>
        ))}
      </div>
    );
  }

  // 4. Minimal Theme Toasts (Monochrome Brutalist Box, Bottom Left)
  if (template.includes('minimal')) {
    return (
      <div className="fixed bottom-6 left-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0 font-mono text-xs">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <SwipeToast
              inline
              open={true}
              type={t.type}
              title={`[${(t.type || 'info').toUpperCase()}] ${t.title || ''}`.trim()}
              description={t.message}
              duration={t.duration || 4000}
              onClose={() => hideToast(t.id)}
              actionLabel={t.action?.label}
              onAction={t.action?.onClick}
              background="#ffffff"
              borderColor="#000000"
              color="#000000"
              fuseColor="#000000"
              radius={0}
              className="border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
        ))}
      </div>
    );
  }

  // 5. Default Theme Toasts (Modern Glassmorphic Card with Dynamic Status Colors, Bottom Right)
  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <SwipeToast
            inline
            open={true}
            type={t.type}
            title={t.title}
            description={t.message}
            duration={t.duration || 4000}
            onClose={() => hideToast(t.id)}
            actionLabel={t.action?.label}
            onAction={t.action?.onClick}
          />
        </div>
      ))}
    </div>
  );
}

export default ThemeToastContainer;
