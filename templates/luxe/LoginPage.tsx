'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';
import type { AuthPageProps } from '@/templates';

export default function LuxeLoginPage({ theme }: AuthPageProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--sf-bg)' }}>
      {/* Left Brand Panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-14 w-1/2 relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg,
            color-mix(in srgb, var(--sf-bg) 40%, black) 0%,
            color-mix(in srgb, var(--sf-primary) 30%, black) 50%,
            black 100%)`,
        }}
      >
        {/* Decorative lines */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 22}%`,
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: `rgba(255,255,255,${0.03 + i * 0.01})`,
              transform: `skewX(-3deg)`,
            }}
          />
        ))}

        <div className="relative z-10">
          <Link href="/">
            <div>
              <span className="text-xl font-bold tracking-[0.25em] uppercase text-white">{theme.storeName}</span>
              <span className="text-xs tracking-[0.4em] uppercase font-light block mt-0.5" style={{ color: 'var(--sf-primary)' }}>Premium</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white leading-none mb-6" style={{ letterSpacing: '-0.02em' }}>
            Welcome<br />
            back.
          </h2>
          <div className="w-12 h-px mb-6" style={{ backgroundColor: 'var(--sf-primary)' }} />
          <p className="text-sm font-light leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Access your private collection, order history, and exclusive member benefits.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center border" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-xs font-light tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Protected by SSL encryption
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-12 text-center">
          <span className="text-xl font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--sf-text)' }}>{theme.storeName}</span>
          <span className="text-xs tracking-[0.4em] uppercase block mt-0.5" style={{ color: 'var(--sf-primary)' }}>Premium</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-10">
            <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: 'var(--sf-primary)' }}>Member Access</span>
            <h1 className="text-3xl font-light" style={{ color: 'var(--sf-text)' }}>Sign In</h1>
          </div>

          {error && (
            <div
              className="mb-6 px-4 py-3 border text-xs tracking-wide"
              style={{
                borderColor: 'color-mix(in srgb, var(--sf-primary) 40%, transparent)',
                color: 'var(--sf-primary)',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs tracking-[0.15em] uppercase block mb-3 font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>
                Email Address
              </label>
              <input
                id="luxe-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 text-sm bg-transparent border outline-none transition-all"
                style={{
                  color: 'var(--sf-text)',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                }}
                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--sf-primary)'}
                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'color-mix(in srgb, var(--sf-text) 15%, transparent)'}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs tracking-[0.15em] uppercase font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs font-light transition-opacity hover:opacity-60" style={{ color: 'var(--sf-primary)' }}>
                  Forgot?
                </Link>
              </div>
              <input
                id="luxe-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 text-sm bg-transparent border outline-none transition-all"
                style={{
                  color: 'var(--sf-text)',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                }}
                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--sf-primary)'}
                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'color-mix(in srgb, var(--sf-text) 15%, transparent)'}
              />
            </div>

            <button
              id="luxe-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 disabled:opacity-50"
              style={{ backgroundColor: 'var(--sf-primary)', color: 'white' }}
              onMouseEnter={(e) => {
                if (!isLoading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sf-primary-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sf-primary)';
              }}
            >
              {isLoading ? '···' : 'Enter Collection'}
            </button>
          </form>

          <p className="mt-8 text-xs font-light text-center" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
            Not yet a member?{' '}
            <Link href="/auth/signup" className="transition-colors" style={{ color: 'var(--sf-primary)' }}>
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
