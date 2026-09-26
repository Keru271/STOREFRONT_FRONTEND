'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import type { AuthPageProps } from '@/templates';
import PawzyHeader, { PawzyLogo } from './Header';
import PawzyFooter from './Footer';

export default function PawzyForgotPasswordPage({ theme }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 800);
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
            Reset Password
          </h1>
          <p className="text-[13.44px] text-[#6b7280] mb-8">
            Enter the email address associated with your pet parent account and we will send you a reset link.
          </p>

          {submitted ? (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl">
                ✓ If an account exists for <strong className="text-[#1f2937]">{email}</strong>, a
                password reset link has been dispatched.
              </div>
              <Link
                href="/auth/login"
                className="inline-block px-8 py-3 rounded-full bg-[#ffd100] text-[#1f2937] text-xs font-bold uppercase tracking-wider hover:bg-[#ecbd00] transition shadow-xs"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#1f2937] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="petparent@example.com"
                  className="w-full px-4 py-3 rounded-full border border-[#eaeaea] text-xs text-[#1f2937] focus:outline-none focus:border-[#ffd100] transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full bg-[#ffd100] hover:bg-[#ecbd00] text-[#1f2937] font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 disabled:opacity-50 mt-2 cursor-pointer"
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link 🐾'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#eaeaea] text-xs text-[#6b7280]">
            Remembered your password?{' '}
            <Link href="/auth/login" className="text-[#1f2937] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <PawzyFooter />
    </div>
  );
}
