'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';
import type { AuthPageProps } from '@/templates';

export default function LuxeSignupPage({ theme }: AuthPageProps) {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password, phone: formData.phone || undefined });
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Early access to new collections',
    'Complimentary shipping on all orders',
    'Dedicated personal stylist service',
    'Exclusive member events & previews',
  ];

  const fields = [
    { id: 'luxe-signup-name', name: 'name', label: 'Full Name', type: 'text', autoComplete: 'name' },
    { id: 'luxe-signup-email', name: 'email', label: 'Email Address', type: 'email', autoComplete: 'email' },
    { id: 'luxe-signup-phone', name: 'phone', label: 'Phone (Optional)', type: 'tel', autoComplete: 'tel' },
    { id: 'luxe-signup-password', name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--sf-bg)' }}>
      {/* Left Panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-14 w-1/2 relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg,
            color-mix(in srgb, var(--sf-bg) 40%, black) 0%,
            color-mix(in srgb, var(--sf-primary) 30%, black) 50%,
            black 100%)`,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute" style={{ left: `${20 + i * 22}%`, top: 0, bottom: 0, width: '1px', backgroundColor: `rgba(255,255,255,${0.03 + i * 0.01})`, transform: 'skewX(-3deg)' }} />
        ))}

        <div className="relative z-10">
          <Link href="/">
            <div>
              <span className="text-xl font-bold tracking-[0.25em] uppercase text-white">{theme.storeName}</span>
              <span className="text-xs tracking-[0.4em] uppercase font-light block mt-0.5" style={{ color: 'var(--sf-primary)' }}>Premium</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white leading-none mb-6" style={{ letterSpacing: '-0.02em' }}>
            Become<br />a member.
          </h2>
          <div className="w-12 h-px mb-8" style={{ backgroundColor: 'var(--sf-primary)' }} />
          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0" style={{ border: '1px solid var(--sf-primary)' }}>
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} style={{ color: 'var(--sf-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.65)' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-light tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Join {(50000).toLocaleString()}+ members worldwide
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 overflow-y-auto">
        <div className="lg:hidden mb-10 text-center">
          <span className="text-xl font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--sf-text)' }}>{theme.storeName}</span>
          <span className="text-xs tracking-[0.4em] uppercase block mt-0.5" style={{ color: 'var(--sf-primary)' }}>Premium</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: 'var(--sf-primary)' }}>Membership</span>
            <h1 className="text-3xl font-light" style={{ color: 'var(--sf-text)' }}>Request Access</h1>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 border text-xs tracking-wide" style={{ borderColor: 'color-mix(in srgb, var(--sf-primary) 40%, transparent)', color: 'var(--sf-primary)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="text-xs tracking-[0.15em] uppercase block mb-3 font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  required={field.name !== 'phone'}
                  autoComplete={field.autoComplete}
                  className="w-full px-4 py-3.5 text-sm bg-transparent border outline-none transition-all"
                  style={{ color: 'var(--sf-text)', borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)' }}
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--sf-primary)'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'color-mix(in srgb, var(--sf-text) 15%, transparent)'}
                />
              </div>
            ))}

            <button
              id="luxe-signup-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 disabled:opacity-50 mt-2"
              style={{ backgroundColor: 'var(--sf-primary)', color: 'white' }}
              onMouseEnter={(e) => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sf-primary-hover)'; }}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sf-primary)'}
            >
              {isLoading ? '···' : 'Join the Collection'}
            </button>
          </form>

          <p className="mt-8 text-xs font-light text-center" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
            Already a member?{' '}
            <Link href="/auth/login" className="transition-colors" style={{ color: 'var(--sf-primary)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
