'use client';

import React from 'react';
import { useLoader } from '@/context/LoadingContext';
import { useTheme } from '@/context/ThemeContext';

export function ThemeLoader() {
  const { isLoading, message, progress } = useLoader();
  const { theme } = useTheme();

  const template = (theme.activeTemplateSlug || 'mincom').toLowerCase();

  // Color for the top progress bar
  let barColor = 'var(--sf-primary, #f59e0b)';
  if (template.includes('mincom')) barColor = '#f59e0b';
  else if (template.includes('nova')) barColor = '#0071e3';
  else if (template.includes('luxe')) barColor = '#c5a880';
  else if (template.includes('minimal')) barColor = '#000000';

  return (
    <>
      {/* ── Top Slim Dynamic Progress Bar ─────────────────────────────────── */}
      {progress > 0 && (
        <div className="fixed top-0 left-0 right-0 z-[99999] h-[3px] bg-transparent pointer-events-none">
          <div
            className="h-full transition-all duration-200 ease-out shadow-[0_0_10px_currentColor]"
            style={{
              width: `${progress}%`,
              backgroundColor: barColor,
              color: barColor,
            }}
          />
        </div>
      )}

      {/* ── Fullscreen Overlay Loader ──────────────────────────────────────── */}
      {isLoading && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200">
          
          {/* 1. Mincom Theme Loader */}
          {template.includes('mincom') && (
            <div className="bg-[#23272a] text-white p-8 rounded-3xl border border-slate-700 shadow-2xl flex flex-col items-center gap-5 max-w-xs text-center animate-in zoom-in-95 duration-200">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 border-4 border-amber-400/20 rounded-2xl" />
                <div className="absolute inset-0 border-4 border-amber-400 border-t-transparent rounded-2xl animate-spin" />
                <div className="absolute inset-3 bg-amber-400 rounded-xl flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
                  M
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-widest text-amber-400">
                  {theme.storeName || 'Mincom'}
                </h4>
                <p className="text-xs text-slate-300 font-medium">
                  {message || 'Crafting your view...'}
                </p>
              </div>
            </div>
          )}

          {/* 2. Nova Theme Loader */}
          {template.includes('nova') && (
            <div className="backdrop-blur-2xl bg-[#1d1d1f]/85 text-white p-7 rounded-3xl border border-white/15 shadow-2xl flex flex-col items-center gap-4 max-w-xs text-center animate-in zoom-in-95 duration-200">
              <div className="w-10 h-10 border-2 border-white/20 border-t-[#0071e3] rounded-full animate-spin" />
              <div className="space-y-0.5">
                <span className="text-[13px] font-semibold text-white block">
                  {message || 'Loading...'}
                </span>
                <span className="text-[11px] text-[#86868b] block tracking-tight">
                  Apple Silicon Responsive System
                </span>
              </div>
            </div>
          )}

          {/* 3. Luxe Theme Loader */}
          {template.includes('luxe') && (
            <div className="bg-[#0e1014] text-[#f4eee6] p-10 border border-[#c5a880]/40 shadow-2xl flex flex-col items-center gap-6 max-w-xs text-center animate-in zoom-in-95 duration-300 font-light">
              <div className="w-12 h-12 border border-[#c5a880]/30 border-t-[#c5a880] rounded-full animate-spin" />
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a880] block">
                  The Collection
                </span>
                <p className="text-xs tracking-[0.2em] text-slate-300 uppercase">
                  {message || 'Curating pieces...'}
                </p>
              </div>
            </div>
          )}

          {/* 4. Minimal Theme Loader */}
          {template.includes('minimal') && (
            <div className="bg-white text-black p-6 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-3 font-mono text-xs text-center">
              <div className="flex gap-1.5 py-2">
                <span className="w-2.5 h-2.5 bg-black animate-ping" />
                <span className="w-2.5 h-2.5 bg-black animate-pulse" />
                <span className="w-2.5 h-2.5 bg-black" />
              </div>
              <div className="font-bold uppercase tracking-widest">
                [ {message || 'LOADING'} ]
              </div>
            </div>
          )}

          {/* 5. Default Theme Loader */}
          {!template.includes('mincom') &&
            !template.includes('nova') &&
            !template.includes('luxe') &&
            !template.includes('minimal') && (
              <div
                className="p-8 rounded-2xl border shadow-2xl flex flex-col items-center gap-4 text-center max-w-xs"
                style={{
                  backgroundColor: 'var(--sf-bg)',
                  color: 'var(--sf-text)',
                  borderRadius: 'var(--sf-radius, 1rem)',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                }}
              >
                <div
                  className="w-10 h-10 border-3 rounded-full animate-spin"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--sf-primary) 20%, transparent)',
                    borderTopColor: 'var(--sf-primary)',
                  }}
                />
                <p className="text-xs font-semibold">{message || 'Loading...'}</p>
              </div>
            )}

        </div>
      )}
    </>
  );
}
