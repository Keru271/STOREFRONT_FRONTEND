'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPageProps } from '@/templates';
import { ApiError } from '@/lib/api/client';
import DemoHeader, { DemoLogo } from './Header';
import DemoFooter from './Footer';

export default function DemoSignupPage({ theme }: AuthPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const redirectUrl = redirectParam || '/';
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({ name, email, password, phone: phone || undefined, acceptsMarketing });
      router.push(redirectUrl);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#fbfbfb] text-slate-900 font-sans antialiased"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <DemoHeader />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white border border-[#eaeaea] rounded-2xl p-8 sm:p-10 shadow-lg text-center">
          <div className="flex justify-center mb-6">
            <DemoLogo className="h-9" />
          </div>

          <h1 className="text-2xl font-bold text-slate-950 tracking-tight mb-2">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-500 mb-8">
            Join the {theme.storeName || 'Funie'} community for exclusive furniture previews and
            member benefits.
          </p>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-lg text-left">
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff9638] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff9638] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff9638] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff9638] focus:border-transparent transition"
              />
            </div>

            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
              <input
                id="demo-signup-marketing-consent"
                type="checkbox"
                checked={acceptsMarketing}
                onChange={(e) => setAcceptsMarketing(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#ff9638] focus:ring-[#ff9638]"
              />
              <span className="leading-relaxed">
                Send me news about new design drops, furniture collections, and subscriber-only
                discounts.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-lg bg-black hover:bg-[#ff9638] text-white font-medium text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              href={
                redirectParam
                  ? `/auth/login?redirect=${encodeURIComponent(redirectParam)}`
                  : '/auth/login'
              }
              className="text-slate-950 font-bold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <DemoFooter />
    </div>
  );
}
