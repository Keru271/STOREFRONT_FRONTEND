'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPageProps } from '@/templates';
import { ApiError } from '@/lib/api/client';

export default function DefaultLoginPage({ theme }: AuthPageProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--sf-bg)' }}>
      {/* ── Left Panel: Brand Visual ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 flex-1 relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg,
            color-mix(in srgb, var(--sf-primary) 95%, black) 0%,
            color-mix(in srgb, var(--sf-secondary) 80%, black) 50%,
            color-mix(in srgb, var(--sf-accent) 70%, black) 100%)`,
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: 'white' }} />
        <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: 'white' }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            {theme.logo ? (
              <img src={theme.logo} alt={theme.storeName} className="h-9 w-auto brightness-200" />
            ) : (
              <span className="text-2xl font-bold text-white">{theme.storeName}</span>
            )}
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <blockquote className="text-5xl font-bold text-white leading-tight mb-6">
            Welcome back.<br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Missed you.</span>
          </blockquote>
          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            Sign in to access your wishlist, track orders, and discover personalized picks crafted just for you.
          </p>
        </div>

        {/* Bottom testimonial */}
        <div
          className="relative z-10 p-6 rounded-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        >
          <p className="text-white/90 text-sm italic mb-3">
            "The shopping experience is unmatched. Fast delivery and incredible product quality!"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'white' }}>
              S
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Sarah M.</p>
              <div className="flex gap-0.5">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i} className="text-yellow-400 text-xs">{star}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ───────────────────────────────────────── */}
      <div className="flex-1 lg:max-w-lg flex flex-col justify-center px-6 sm:px-12 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/">
            <span className="text-xl font-bold" style={{ color: 'var(--sf-primary)' }}>{theme.storeName}</span>
          </Link>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <h2 className="text-3xl font-bold mb-1" style={{ color: 'var(--sf-text)' }}>Sign in</h2>
          <p className="text-sm mb-8" style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-semibold transition-colors" style={{ color: 'var(--sf-primary)' }}>
              Create one free
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{
                backgroundColor: 'color-mix(in srgb, #ef4444 10%, transparent)',
                color: '#ef4444',
                border: '1px solid color-mix(in srgb, #ef4444 30%, transparent)',
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--sf-text)' }}>
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="sf-input w-full px-4 py-3 text-sm"
                style={{ color: 'var(--sf-text)' }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium" style={{ color: 'var(--sf-text)' }}>
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium transition-colors"
                  style={{ color: 'var(--sf-primary)' }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="sf-input w-full px-4 py-3 pr-11 text-sm"
                  style={{ color: 'var(--sf-text)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)' }} />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3" style={{ backgroundColor: 'var(--sf-bg)', color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                or continue with
              </span>
            </div>
          </div>

          {/* Social Login (placeholder) */}
          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Apple'].map((provider) => (
              <button
                key={provider}
                type="button"
                className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border"
                style={{
                  backgroundColor: 'var(--sf-bg)',
                  color: 'var(--sf-text)',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--sf-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'color-mix(in srgb, var(--sf-text) 15%, transparent)';
                }}
              >
                {provider === 'Google' ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                  </svg>
                )}
                {provider}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
