'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPageProps } from '@/templates';
import { ApiError } from '@/lib/api/client';
import NovaHeader from './Header';
import NovaFooter from './Footer';

export default function NovaSignupPage({ theme }: AuthPageProps) {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please accept the Terms of Service to create your ID.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });
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
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      <NovaHeader />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="w-full max-w-[460px] bg-white border border-[#e2e2e5] rounded-[8px] p-8 sm:p-10 shadow-sm text-center">
          
          {/* Icon Header */}
          <div className="w-12 h-12 rounded-full bg-[#f5f5f7] border border-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] mx-auto mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
            Create Your Store ID
          </h1>
          <p className="text-[13px] text-[#707070] mb-8">
            One ID is all you need to access all {theme.storeName || 'Nova'} products and services.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] text-xs rounded-md text-left leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[12px] font-medium text-[#1d1d1f] mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Appleseed"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#d2d2d7] rounded-[8px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#1d1d1f] mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#d2d2d7] rounded-[8px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#1d1d1f] mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#d2d2d7] rounded-[8px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[#1d1d1f] mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#d2d2d7] rounded-[8px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#1d1d1f] mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  required
                  value={formData.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#d2d2d7] rounded-[8px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-[12px] text-[#707070] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-[#d2d2d7] text-[#0071e3] focus:ring-[#0071e3]"
                />
                <span>
                  I agree to the <Link href="/terms" className="text-[#0066cc] hover:underline">Terms of Service</Link> and acknowledge the <Link href="/privacy" className="text-[#0066cc] hover:underline">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-[980px] bg-[#0071e3] text-white text-[14px] font-normal hover:bg-[#0077ed] active:scale-[0.98] transition-all flex items-center justify-center shadow-sm disabled:opacity-50"
              >
                {isLoading ? 'Creating ID...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#f5f5f7] text-[13px] text-[#707070]">
            Already have an ID?{' '}
            <Link href="/auth/login" className="text-[#0066cc] font-medium hover:underline">
              Sign in now &gt;
            </Link>
          </div>

        </div>
      </main>

      <NovaFooter />
    </div>
  );
}
