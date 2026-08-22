'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPageProps } from '@/templates';
import { ApiError } from '@/lib/api/client';
import NovaHeader from './Header';
import NovaFooter from './Footer';

export default function NovaLoginPage({ theme }: AuthPageProps) {
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
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      <NovaHeader />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="w-full max-w-[420px] bg-white border border-[#e2e2e5] rounded-[8px] p-8 sm:p-10 shadow-sm text-center">
          
          {/* Logo / Monogram */}
          <div className="w-12 h-12 rounded-full bg-[#f5f5f7] border border-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] mx-auto mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
            Sign in with your Store ID
          </h1>
          <p className="text-[13px] text-[#707070] mb-8">
            Manage your orders, saved bag, and express checkout across {theme.storeName || 'Nova'}.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] text-xs rounded-md text-left leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[12px] font-medium text-[#1d1d1f] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#d2d2d7] rounded-[8px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[12px] font-medium text-[#1d1d1f]">Password</label>
                <Link href="/auth/forgot-password" className="text-[11px] text-[#0066cc] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#d2d2d7] rounded-[8px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-[980px] bg-[#0071e3] text-white text-[14px] font-normal hover:bg-[#0077ed] active:scale-[0.98] transition-all flex items-center justify-center shadow-sm disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Continue with Email'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#f5f5f7] text-[13px] text-[#707070]">
            Don&apos;t have an ID?{' '}
            <Link href="/auth/signup" className="text-[#0066cc] font-medium hover:underline">
              Create yours now &gt;
            </Link>
          </div>

        </div>
      </main>

      <NovaFooter />
    </div>
  );
}
