'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPageProps } from '@/templates';
import { ApiError } from '@/lib/api/client';
import PawzyHeader, { PawzyLogo } from './Header';
import PawzyFooter from './Footer';

export default function PawzySignupPage({ theme }: AuthPageProps) {
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
            Create Pet Parent Account
          </h1>
          <p className="text-[13.44px] text-[#6b7280] mb-8">
            Join Pawzy for exclusive discounts, free delivery perks, and appointment reminders.
          </p>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-2xl text-left">
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#1f2937] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full px-4 py-3 rounded-full border border-[#eaeaea] text-xs text-[#1f2937] focus:outline-none focus:border-[#ffd100] transition"
              />
            </div>

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
              <label className="block text-xs font-bold text-[#1f2937] mb-1.5">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-full border border-[#eaeaea] text-xs text-[#1f2937] focus:outline-none focus:border-[#ffd100] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1f2937] mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-full border border-[#eaeaea] text-xs text-[#1f2937] focus:outline-none focus:border-[#ffd100] transition"
              />
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#6b7280] cursor-pointer pt-1">
              <input
                id="pawzy-signup-marketing-consent"
                type="checkbox"
                checked={acceptsMarketing}
                onChange={(e) => setAcceptsMarketing(e.target.checked)}
                className="mt-0.5 rounded border-[#eaeaea] text-[#ffd100] focus:ring-[#ffd100]"
              />
              <span className="leading-relaxed">
                Send me news about healthy pet treats, discount vouchers, and seasonal pet health tips.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#ffd100] hover:bg-[#ecbd00] text-[#1f2937] font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isLoading ? 'Creating Account...' : 'Create Account 🐾'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#eaeaea] text-xs text-[#6b7280]">
            Already have an account?{' '}
            <Link
              href={
                redirectParam
                  ? `/auth/login?redirect=${encodeURIComponent(redirectParam)}`
                  : '/auth/login'
              }
              className="text-[#1f2937] font-bold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <PawzyFooter />
    </div>
  );
}
