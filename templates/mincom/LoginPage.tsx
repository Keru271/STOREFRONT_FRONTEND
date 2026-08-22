'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPageProps } from '@/templates';
import { ApiError } from '@/lib/api/client';
import MincomHeader from './Header';
import MincomFooter from './Footer';

export default function MincomLoginPage({ theme }: AuthPageProps) {
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
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Incorrect email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900 font-sans antialiased">
      <MincomHeader />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl text-center">
          
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            M
          </div>

          <h1 className="text-2xl font-black text-slate-950 tracking-tight mb-2">
            Welcome to {theme.storeName || 'Mincom'}
          </h1>
          <p className="text-xs text-slate-500 mb-8">
            Sign in to access your orders, track delivery, and unlock member discounts.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl text-left">
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="sf-input w-full p-3 text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-[11px] text-amber-600 font-semibold hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="sf-input w-full p-3 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition mt-4 disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In To Account →'}
            </button>
          </form>

          <p className="text-xs text-slate-500 mt-6 pt-6 border-t border-slate-100">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-bold text-amber-600 hover:underline">
              Create New Account
            </Link>
          </p>
        </div>
      </main>

      <MincomFooter />
    </div>
  );
}
