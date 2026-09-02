'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPageProps } from '@/templates';
import { ApiError } from '@/lib/api/client';

export default function DefaultSignupPage({ theme }: AuthPageProps) {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['transparent', '#ef4444', '#f97316', '#eab308', '#22c55e'];
    return { score, label: labels[score], color: colors[score] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the terms to continue.');
      return;
    }
    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        acceptsMarketing,
      });
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const perks = [
    { icon: '🎁', text: 'Exclusive member-only deals' },
    { icon: '🚚', text: 'Free shipping on every order' },
    { icon: '📦', text: 'Easy order tracking & returns' },
    { icon: '⭐', text: 'Earn points with every purchase' },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--sf-bg)' }}>
      {/* ── Left Panel ───────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 flex-1 relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg,
            color-mix(in srgb, var(--sf-accent) 85%, black) 0%,
            color-mix(in srgb, var(--sf-primary) 80%, black) 60%,
            color-mix(in srgb, var(--sf-secondary) 75%, black) 100%)`,
        }}
      >
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: 'white' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: 'white' }} />

        <div className="relative z-10">
          <Link href="/">
            <span className="text-2xl font-bold text-white">{theme.storeName}</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Join the<br />
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>community.</span>
          </h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-md">
            Create your free account and unlock a world of exclusive benefits.
          </p>
          <div className="space-y-4">
            {perks.map((perk) => (
              <div key={perk.text} className="flex items-center gap-3">
                <span className="text-2xl">{perk.icon}</span>
                <span className="text-white/85 text-sm">{perk.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative z-10 p-5 rounded-2xl flex items-center gap-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            50k
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Join 50,000+ happy shoppers</p>
            <p className="text-white/60 text-xs mt-0.5">Trusted by customers in 40+ countries</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Signup Form ─────────────────────────────────────── */}
      <div className="flex-1 lg:max-w-lg flex flex-col justify-center px-6 sm:px-12 py-12 overflow-y-auto">
        <div className="lg:hidden mb-8">
          <Link href="/">
            <span className="text-xl font-bold" style={{ color: 'var(--sf-primary)' }}>{theme.storeName}</span>
          </Link>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <h2 className="text-3xl font-bold mb-1" style={{ color: 'var(--sf-text)' }}>Create account</h2>
          <p className="text-sm mb-8" style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
            Already have one?{' '}
            <Link href="/auth/login" className="font-semibold" style={{ color: 'var(--sf-primary)' }}>
              Sign in
            </Link>
          </p>

          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
              style={{
                backgroundColor: 'color-mix(in srgb, #ef4444 10%, transparent)',
                color: '#ef4444',
                border: '1px solid color-mix(in srgb, #ef4444 30%, transparent)',
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--sf-text)' }}>Full name</label>
              <input
                id="signup-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                autoComplete="name"
                className="sf-input w-full px-4 py-3 text-sm"
                style={{ color: 'var(--sf-text)' }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--sf-text)' }}>Email address</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="sf-input w-full px-4 py-3 text-sm"
                style={{ color: 'var(--sf-text)' }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--sf-text)' }}>
                Phone <span style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>(optional)</span>
              </label>
              <input
                id="signup-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                autoComplete="tel"
                className="sf-input w-full px-4 py-3 text-sm"
                style={{ color: 'var(--sf-text)' }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--sf-text)' }}>Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="sf-input w-full px-4 py-3 pr-11 text-sm"
                  style={{ color: 'var(--sf-text)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                </button>
              </div>
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i <= passwordStrength.score ? passwordStrength.color : 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: passwordStrength.color }}>{passwordStrength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--sf-text)' }}>Confirm password</label>
              <input
                id="signup-confirm"
                name="confirm"
                type="password"
                value={formData.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="sf-input w-full px-4 py-3 text-sm"
                style={{
                  color: 'var(--sf-text)',
                  ...(formData.confirm && formData.password !== formData.confirm
                    ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.15)' }
                    : {}),
                }}
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                className="w-4 h-4 rounded mt-0.5 flex-shrink-0 flex items-center justify-center transition-all"
                style={{
                  border: agreed ? 'none' : '1.5px solid color-mix(in srgb, var(--sf-text) 30%, transparent)',
                  backgroundColor: agreed ? 'var(--sf-primary)' : 'transparent',
                }}
                onClick={() => setAgreed(!agreed)}
              >
                {agreed && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs leading-relaxed" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
                I agree to the{' '}
                <Link href="/terms" className="font-medium" style={{ color: 'var(--sf-primary)' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="font-medium" style={{ color: 'var(--sf-primary)' }}>Privacy Policy</Link>
              </span>
            </label>

            {/* Marketing Consent */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                id="signup-marketing-consent"
                className="w-4 h-4 rounded mt-0.5 flex-shrink-0 flex items-center justify-center transition-all"
                style={{
                  border: acceptsMarketing ? 'none' : '1.5px solid color-mix(in srgb, var(--sf-text) 30%, transparent)',
                  backgroundColor: acceptsMarketing ? 'var(--sf-primary)' : 'transparent',
                }}
                onClick={() => setAcceptsMarketing(!acceptsMarketing)}
              >
                {acceptsMarketing && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs leading-relaxed" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
                Keep me updated with exclusive member discounts, promo rewards, and product launches via email & SMS.
              </span>
            </label>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : 'Create Free Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
