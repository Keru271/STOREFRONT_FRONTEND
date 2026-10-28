'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPageProps } from '@/templates';
import { ApiError } from '@/lib/api/client';
import TechnoHeader, { MarketNestLogo } from './Header';
import TechnoFooter from './Footer';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function TechnoLoginPage({ theme }: AuthPageProps) {
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
      className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#1C1917] antialiased"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <TechnoHeader />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white border border-[#E7E5E4] rounded-[8px] p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-[4px] bg-[#C2410C] text-white text-xl font-bold flex items-center justify-center mx-auto mb-3 border border-[#9A3412]">
              🌿
            </div>
            <h1
              className="text-2xl sm:text-3xl font-semibold text-[#1C1917]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Welcome to {theme.storeName || 'MarketNest'}
            </h1>
            <p className="text-[13px] text-[#57534E] mt-2">
              Sign in to manage your artisan orders, track shipments, and support independent makers.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-[4px] bg-[#FEE2E2] border border-[#DC2626]/30 text-[#991B1B] text-[13px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-[13px] font-semibold text-[#1C1917] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maker@example.com"
                className="w-full h-[42px] px-3.5 bg-white text-[15px] text-[#1C1917] placeholder:text-[#A8A29E] border-[1.5px] border-[#D6D3D1] rounded-[4px] focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15 outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[13px] font-semibold text-[#1C1917]">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[12px] text-[#C2410C] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[42px] px-3.5 bg-white text-[15px] text-[#1C1917] placeholder:text-[#A8A29E] border-[1.5px] border-[#D6D3D1] rounded-[4px] focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] rounded-[4px] bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12] text-white text-[15px] font-semibold transition-colors flex items-center justify-center gap-2 border border-[#C2410C]"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E7E5E4] text-center text-[13px] text-[#57534E]">
            <span>New to MarketNest? </span>
            <Link
              href="/auth/signup"
              className="text-[#C2410C] font-semibold hover:underline"
            >
              Create an artisan account
            </Link>
          </div>
        </div>
      </main>

      <TechnoFooter />
    </div>
  );
}
