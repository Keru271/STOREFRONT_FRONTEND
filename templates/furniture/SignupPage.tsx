'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPageProps } from '@/templates';
import { ApiError } from '@/lib/api/client';
import FurnitureHeader from './Header';
import FurnitureFooter from './Footer';
import { ArrowRight, UserPlus } from 'lucide-react';

export default function FurnitureSignupPage({ theme }: AuthPageProps) {
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
        setError('Failed to create account. Please check your information and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const storeTitle = theme.storeName || 'AURA Goods';

  return (
    <div
      className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1a1c1a] antialiased"
      style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
    >
      <FurnitureHeader />

      <main className="flex-1 flex items-center justify-center pt-32 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-md bg-[#ffffff] border border-[#e3e2e0] rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-sm bg-[#040505] text-white flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-semibold text-[#040505]"
              style={{ fontFamily: 'var(--font-playfair, serif)' }}
            >
              Join the Archive
            </h1>
            <p className="text-[13px] text-[#444748] mt-2">
              Create an account with {storeTitle} for early seasonal release access and dedicated curation.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-[#ffdad6]/40 border border-[#ba1a1a]/30 text-[#93000a] text-[13px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[13px] font-semibold text-[#040505] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full h-11 px-3.5 bg-[#ffffff] text-[14px] text-[#1a1c1a] placeholder:text-[#747878] border border-[#e3e2e0] rounded-lg focus:border-[#466557] focus:ring-2 focus:ring-[#466557]/15 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#040505] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@example.com"
                className="w-full h-11 px-3.5 bg-[#ffffff] text-[14px] text-[#1a1c1a] placeholder:text-[#747878] border border-[#e3e2e0] rounded-lg focus:border-[#466557] focus:ring-2 focus:ring-[#466557]/15 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#040505] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full h-11 px-3.5 bg-[#ffffff] text-[14px] text-[#1a1c1a] placeholder:text-[#747878] border border-[#e3e2e0] rounded-lg focus:border-[#466557] focus:ring-2 focus:ring-[#466557]/15 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#040505] mb-1.5">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-11 px-3.5 bg-[#ffffff] text-[14px] text-[#1a1c1a] placeholder:text-[#747878] border border-[#e3e2e0] rounded-lg focus:border-[#466557] focus:ring-2 focus:ring-[#466557]/15 outline-none transition"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="marketing"
                checked={acceptsMarketing}
                onChange={(e) => setAcceptsMarketing(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#e3e2e0] text-[#466557] focus:ring-[#466557]"
              />
              <label htmlFor="marketing" className="text-xs text-[#444748] leading-relaxed">
                Receive dispatches from our Archive Journal, exhibition releases, and guild announcements.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-[#040505] hover:bg-[#466557] text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#e3e2e0] text-center text-[13px] text-[#444748]">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="text-[#466557] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>

      <FurnitureFooter />
    </div>
  );
}

