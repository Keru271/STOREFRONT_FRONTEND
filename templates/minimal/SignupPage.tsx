'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';
import type { AuthPageProps } from '@/templates';

export default function MinimalSignupPage({ theme }: AuthPageProps) {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      await register(formData);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { id: 'min-signup-name', name: 'name', label: 'Full Name', type: 'text', autoComplete: 'name' },
    { id: 'min-signup-email', name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    { id: 'min-signup-password', name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-12">
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--sf-text)' }}>{theme.storeName}</span>
        </Link>

        <h1 className="text-3xl font-extralight text-center mb-2" style={{ color: 'var(--sf-text)' }}>Create account</h1>
        <p className="text-center text-sm mb-10 font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>
          Already a member?{' '}
          <Link href="/auth/login" className="transition-opacity hover:opacity-60" style={{ color: 'var(--sf-text)' }}>Sign in</Link>
        </p>

        {error && (
          <p className="text-center text-sm mb-6" style={{ color: 'var(--sf-primary)' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="relative">
              <input
                id={field.id}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                required
                autoComplete={field.autoComplete}
                placeholder=" "
                className="peer w-full px-0 pt-5 pb-2 bg-transparent text-sm outline-none"
                style={{
                  color: 'var(--sf-text)',
                  borderBottom: '1px solid color-mix(in srgb, var(--sf-text) 25%, transparent)',
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderBottomColor = 'var(--sf-primary)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderBottomColor = 'color-mix(in srgb, var(--sf-text) 25%, transparent)';
                }}
              />
              <label
                htmlFor={field.id}
                className="absolute left-0 top-2 text-xs tracking-widest uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal"
                style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}
              >
                {field.label}
              </label>
            </div>
          ))}

          <button
            id="min-signup-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-4 text-xs tracking-widest uppercase font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ backgroundColor: 'var(--sf-text)', color: 'var(--sf-bg)' }}
          >
            {isLoading ? '...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
