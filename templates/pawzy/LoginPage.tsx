'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPageProps } from '@/templates';
import { ApiError } from '@/lib/api/client';
import PawzyHeader, { PawzyLogo } from './Header';
import PawzyFooter from './Footer';

export default function PawzyLoginPage({ theme }: AuthPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const redirectUrl = redirectParam || '/';
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
      router.push(redirectUrl);
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
    <div
      className="min-h-screen flex flex-col bg-[#fbfbfb] text-[#1f2937] antialiased"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <PawzyHeader />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white border border-[#eaeaea] rounded-3xl p-8 sm:p-10 shadow-lg text-center">
          <div className="flex justify-center mb-6">
            <PawzyLogo className="h-10" />
          </div>

          <h1
            className="text-2xl font-bold text-[#1f2937] tracking-tight mb-2"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Welcome Back Pet Parent!
          </h1>
          <p className="text-[13.44px] text-[#6b7280] mb-8">
            Access your pet care orders, appointments, and wishlist.
          </p>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-2xl text-left">
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#1f2937] mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="petparent@example.com"
                className="w-full px-4 py-3 rounded-full border border-[#eaeaea] text-xs text-[#1f2937] focus:outline-none focus:border-[#ffd100] transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#1f2937]">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] font-bold text-[#1f2937] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-full border border-[#eaeaea] text-xs text-[#1f2937] focus:outline-none focus:border-[#ffd100] transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#ffd100] hover:bg-[#ecbd00] text-[#1f2937] font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isLoading ? 'Signing In...' : 'Sign In 🐾'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#eaeaea] text-xs text-[#6b7280]">
            Don't have an account yet?{' '}
            <Link
              href={
                redirectParam
                  ? `/auth/signup?redirect=${encodeURIComponent(redirectParam)}`
                  : '/auth/signup'
              }
              className="text-[#1f2937] font-bold hover:underline"
            >
              Register Pet Parent Account
            </Link>
          </div>
        </div>
      </main>

      <PawzyFooter />
    </div>
  );
}
