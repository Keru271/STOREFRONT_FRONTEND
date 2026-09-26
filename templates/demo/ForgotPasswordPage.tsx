'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import type { AuthPageProps } from '@/templates';
import DemoHeader, { DemoLogo } from './Header';
import DemoFooter from './Footer';

export default function DemoForgotPasswordPage({ theme }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate recovery email dispatch
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 800);
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
            Reset Password
          </h1>
          <p className="text-xs text-slate-500 mb-8">
            Enter the email address associated with your account and we will send you a reset link.
          </p>

          {submitted ? (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-[#108474] text-xs font-semibold rounded-xl">
                ✓ If an account exists for <strong className="text-slate-900">{email}</strong>, a
                password reset link has been dispatched.
              </div>
              <Link
                href="/auth/login"
                className="inline-block px-6 py-3 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ff9638] transition shadow"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff9638] focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-lg bg-black hover:bg-[#ff9638] text-white font-medium text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2 cursor-pointer"
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
            Remembered your password?{' '}
            <Link href="/auth/login" className="text-slate-950 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <DemoFooter />
    </div>
  );
}
