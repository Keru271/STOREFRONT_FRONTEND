'use client';

import React, { useState, useEffect } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import {
  Cpu,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Server,
  Terminal,
  Activity,
} from 'lucide-react';
import { Instagram, Facebook, Twitter, Linkedin } from '@/components/shared/SocialIcons';

export default function MinimalMaintenancePage({ theme }: { theme: ThemeConfig }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [uptime, setUptime] = useState('99.98%');
  const [progress, setProgress] = useState(78);

  const title = theme?.maintenanceTitle || 'System Optimization in Progress';
  const message =
    theme?.maintenanceMessage ||
    'We are currently performing precision engineering and infrastructure upgrades to provide lightning-fast, ultra-secure shopping.';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
    }, 500);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between relative bg-black text-white selection:bg-white selection:text-black font-sans overflow-hidden"
    >
      {/* Background High-Tech Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-sky-600/15 via-indigo-600/20 to-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {theme?.logo ? (
            <img src={theme.logo} alt={theme.storeName} className="h-8 w-auto object-contain brightness-110" />
          ) : (
            <span className="text-xl font-bold tracking-tighter text-white">
              {theme?.storeName || 'NOVA'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>STATUS: UPGRADING</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full mx-auto text-center space-y-8">
          {/* Micro Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide bg-zinc-900/90 text-zinc-400 border border-zinc-800 backdrop-blur-xl">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>CORE RELEASE 2.4.0</span>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
              {message}
            </p>
          </div>

          {/* Progress Status Card */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-2xl text-left space-y-4 shadow-2xl">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400 animate-spin" />
                <span>Deployment Pipeline</span>
              </div>
              <span className="text-white font-semibold">{progress}% Completed</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Database Migration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>CDN Cache Prime</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                <div className="w-3 h-3 rounded-full border border-sky-400 border-t-transparent animate-spin" />
                <span className="text-sky-400">Final Verification</span>
              </div>
            </div>
          </div>

          {/* Email Notification */}
          <div className="max-w-md mx-auto pt-2">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to get notified..."
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-medium text-sm text-black bg-white hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 cursor-pointer shrink-0 font-sans"
                >
                  {loading ? 'Subscribing...' : 'Get Alert'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-800/40">
                <CheckCircle2 className="w-4 h-4" />
                <span>You will be notified immediately upon relaunch.</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-900 text-xs text-zinc-500">
        <div>{theme?.footerCopyright || `© ${new Date().getFullYear()} ${theme?.storeName || 'OmniStore'}. All systems operational.`}</div>

        <div className="flex items-center gap-4">
          {theme?.socialTwitter && (
            <a href={theme.socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {theme?.socialInstagram && (
            <a href={theme.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {theme?.socialLinkedin && (
            <a href={theme.socialLinkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
