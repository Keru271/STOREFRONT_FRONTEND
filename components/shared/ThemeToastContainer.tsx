'use client';

import React from 'react';
import { useToast, ToastItem } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToastContainer() {
  const { toasts, hideToast } = useToast();
  const { theme } = useTheme();

  if (!toasts || toasts.length === 0) return null;

  const template = (theme.activeTemplateSlug || 'mincom').toLowerCase();

  // 1. Mincom Theme Toasts (Warm Charcoal + Amber, Bottom Right)
  if (template.includes('mincom')) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-[#23272a] text-white p-4 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-5 fade-in relative overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md">
                {t.type === 'success' && '✓'}
                {t.type === 'error' && '✕'}
                {t.type === 'warning' && '⚠'}
                {t.type === 'info' && 'ℹ'}
              </div>
              <div className="flex-1 min-w-0">
                {t.title && (
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 mb-0.5">
                    {t.title}
                  </h4>
                )}
                <p className="text-xs text-slate-200 leading-relaxed break-words font-medium">
                  {t.message}
                </p>
                {t.action && (
                  <button
                    onClick={() => {
                      t.action?.onClick();
                      hideToast(t.id);
                    }}
                    className="mt-2 text-[11px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 underline"
                  >
                    {t.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => hideToast(t.id)}
                className="text-slate-400 hover:text-white transition text-sm p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {/* Linear countdown bar */}
            {t.duration && t.duration > 0 && (
              <div
                className="absolute bottom-0 left-0 h-[3px] bg-amber-400"
                style={{
                  animation: `shrinkWidth ${t.duration}ms linear forwards`,
                  width: '100%',
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // 2. Nova Theme Toasts (Apple Dynamic Island Capsule, Top Center)
  if (template.includes('nova')) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2.5 max-w-md w-full pointer-events-none px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto backdrop-blur-2xl bg-[#1d1d1f]/90 text-white py-2.5 px-5 rounded-full border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 fade-in flex items-center gap-3.5 max-w-full"
          >
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                t.type === 'success'
                  ? 'bg-[#30d158] shadow-[0_0_8px_#30d158]'
                  : t.type === 'error'
                  ? 'bg-[#ff453a] shadow-[0_0_8px_#ff453a]'
                  : t.type === 'warning'
                  ? 'bg-[#ffd60a] shadow-[0_0_8px_#ffd60a]'
                  : 'bg-[#0a84ff] shadow-[0_0_8px_#0a84ff]'
              }`}
            />
            <div className="flex-1 min-w-0 text-left">
              <span className="text-[13px] font-normal text-slate-100 truncate block">
                {t.title ? <strong className="font-semibold text-white mr-1.5">{t.title}:</strong> : null}
                {t.message}
              </span>
            </div>
            {t.action && (
              <button
                onClick={() => {
                  t.action?.onClick();
                  hideToast(t.id);
                }}
                className="text-[12px] font-medium text-[#2997ff] hover:underline flex-shrink-0"
              >
                {t.action.label}
              </button>
            )}
            <button
              onClick={() => hideToast(t.id)}
              className="text-white/40 hover:text-white text-xs pl-1"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  }

  // 3. Luxe Theme Toasts (Haute Couture Luxury Notification, Top Right)
  if (template.includes('luxe')) {
    return (
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0 font-light">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-[#0e1014] text-[#f4eee6] p-5 border border-[#c5a880]/50 shadow-2xl transform transition-all duration-400 ease-out animate-in slide-in-from-right-4 fade-in relative"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a880] block font-normal">
                  {t.title || (t.type === 'success' ? 'Confirmed' : 'Notification')}
                </span>
                <p className="text-xs tracking-wider text-slate-300 font-light leading-relaxed">
                  {t.message}
                </p>
              </div>
              <button
                onClick={() => hideToast(t.id)}
                className="text-[#c5a880]/60 hover:text-[#c5a880] text-xs transition uppercase tracking-widest"
              >
                ✕
              </button>
            </div>
            {t.action && (
              <button
                onClick={() => {
                  t.action?.onClick();
                  hideToast(t.id);
                }}
                className="mt-3 text-[10px] tracking-[0.25em] uppercase text-[#c5a880] hover:underline block"
              >
                {t.action.label} →
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  // 4. Minimal Theme Toasts (Monochrome Brutalist Box, Bottom Left)
  if (template.includes('minimal')) {
    return (
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0 font-mono text-xs">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-white text-black p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 animate-in slide-in-from-left-4 fade-in"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-bold uppercase tracking-wider block mb-1">
                  [{t.type.toUpperCase()}] {t.title || ''}
                </span>
                <p className="leading-snug text-neutral-800">{t.message}</p>
                {t.action && (
                  <button
                    onClick={() => {
                      t.action?.onClick();
                      hideToast(t.id);
                    }}
                    className="mt-2 text-[11px] font-bold underline uppercase"
                  >
                    &gt; {t.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => hideToast(t.id)}
                className="font-black hover:opacity-50 text-sm"
              >
                [X]
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 5. Default Theme Toasts (Modern Glassmorphic Card, Top Right)
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 fade-in"
          style={{
            backgroundColor: 'var(--sf-bg)',
            color: 'var(--sf-text)',
            borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
            borderRadius: 'var(--sf-radius, 0.75rem)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{
                backgroundColor:
                  t.type === 'success'
                    ? '#10b981'
                    : t.type === 'error'
                    ? '#ef4444'
                    : t.type === 'warning'
                    ? '#f59e0b'
                    : 'var(--sf-primary)',
              }}
            >
              {t.type === 'success' && '✓'}
              {t.type === 'error' && '✕'}
              {t.type === 'warning' && '!'}
              {t.type === 'info' && 'i'}
            </div>
            <div className="flex-1 min-w-0">
              {t.title && (
                <h4 className="font-semibold text-xs mb-0.5" style={{ color: 'var(--sf-primary)' }}>
                  {t.title}
                </h4>
              )}
              <p className="text-xs leading-relaxed opacity-90">{t.message}</p>
              {t.action && (
                <button
                  onClick={() => {
                    t.action?.onClick();
                    hideToast(t.id);
                  }}
                  className="mt-2 text-xs font-semibold underline"
                  style={{ color: 'var(--sf-primary)' }}
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => hideToast(t.id)}
              className="opacity-50 hover:opacity-100 text-xs p-1"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
