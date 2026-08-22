'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forgotPassword, verifyOtp, resetPassword } from '@/lib/api/customer';
import { useToast } from '@/hooks/useToast';
import { useLoader } from '@/hooks/useLoader';
import type { ThemeConfig } from '@/lib/api/types';

interface ForgotPasswordBodyProps {
  theme?: ThemeConfig;
  cardClassName?: string;
  buttonClassName?: string;
  inputClassName?: string;
}

export function ForgotPasswordBody({
  theme,
  cardClassName = '',
  buttonClassName = '',
  inputClassName = '',
}: ForgotPasswordBodyProps) {
  const router = useRouter();
  const toast = useToast();
  const { startLoading, stopLoading } = useLoader();

  // Multi-step: 1 = Email, 2 = Verify OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resend Countdown
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const digitInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Countdown timer for Step 2
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // ── Step 1: Send OTP to Email ──────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    startLoading('Sending verification code...');

    try {
      const res = await forgotPassword(email.trim());
      if (res.otp) {
        setDevOtpHint(res.otp);
      }
      setStep(2);
      setCountdown(60);
      setCanResend(false);
      toast.success(res.message || 'Verification code sent to your email!', 'Code Sent');
    } catch (err: any) {
      const msg = err?.message || 'Failed to send verification code. Please check your email.';
      setErrorMessage(msg);
      toast.error(msg, 'Request Failed');
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  // ── Step 2: Handle OTP Input & Verification ────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted) {
        const next = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          next[i] = pasted[i] || '';
        }
        setOtpDigits(next);
        const nextFocus = Math.min(pasted.length, 5);
        digitInputRefs.current[nextFocus]?.focus();
      }
      return;
    }

    const next = [...otpDigits];
    next[index] = value.replace(/\D/g, '');
    setOtpDigits(next);

    if (value && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    startLoading('Verifying code...');

    try {
      const res = await verifyOtp(email.trim(), fullOtp);
      setStep(3);
      toast.success(res.message || 'Code verified successfully!', 'Code Verified');
    } catch (err: any) {
      const msg = err?.message || 'Invalid or expired verification code.';
      setErrorMessage(msg);
      toast.error(msg, 'Verification Error');
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrorMessage('');
    setOtpDigits(['', '', '', '', '', '']);
    setIsSubmitting(true);
    startLoading('Resending verification code...');

    try {
      const res = await forgotPassword(email.trim());
      if (res.otp) {
        setDevOtpHint(res.otp);
      }
      setCountdown(60);
      setCanResend(false);
      toast.success('A new 6-digit code has been sent.', 'Code Resent');
    } catch (err: any) {
      const msg = err?.message || 'Failed to resend code.';
      setErrorMessage(msg);
      toast.error(msg, 'Resend Failed');
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  // ── Step 3: Reset Password ─────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    startLoading('Updating your password...');

    try {
      const res = await resetPassword({
        email: email.trim(),
        otp: otpDigits.join(''),
        newPassword,
      });

      setStep(4);
      toast.success('Your password has been successfully reset!', 'Password Reset');
    } catch (err: any) {
      const msg = err?.message || 'Failed to reset password. Please try again.';
      setErrorMessage(msg);
      toast.error(msg, 'Reset Failed');
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const primaryBtnClass = buttonClassName || 'btn-primary font-bold text-xs shadow-md hover:shadow-lg';

  return (
    <div className="w-full max-w-md mx-auto my-auto py-10 px-4">
      <div
        className={`rounded-3xl p-6 sm:p-8 shadow-xl border ${cardClassName}`}
        style={{
          backgroundColor: cardClassName ? undefined : 'var(--sf-bg)',
          borderColor: cardClassName ? undefined : 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
          borderRadius: 'var(--sf-radius)',
        }}
      >
        {/* Step Indicator Header */}
        <div
          className="flex items-center justify-between mb-6 pb-4 border-b"
          style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
        >
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  backgroundColor:
                    step === num
                      ? 'var(--sf-primary)'
                      : step > num
                      ? '#10b981'
                      : 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                  color: step === num || step > num ? '#ffffff' : 'var(--sf-text)',
                }}
              >
                {step > num ? '✓' : num}
              </div>
            ))}
          </div>
          <span
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}
          >
            {step === 1 && 'Step 1: Enter Email'}
            {step === 2 && 'Step 2: Verify OTP'}
            {step === 3 && 'Step 3: New Password'}
            {step === 4 && 'Complete'}
          </span>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <span className="text-rose-500 font-bold">✕</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ── STEP 1: Enter Email ────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold shadow-sm"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sf-primary) 15%, var(--sf-bg))',
                  color: 'var(--sf-primary)',
                  borderRadius: 'var(--sf-radius)',
                }}
              >
                🔒
              </div>
              <h2 className="text-xl font-bold tracking-tight font-heading" style={{ color: 'var(--sf-text)' }}>
                Forgot Password?
              </h2>
              <p className="text-xs mt-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
                Enter your registered email address and we&apos;ll send you a 6-digit verification code.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--sf-text)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs transition ${inputClassName || 'sf-input'}`}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${primaryBtnClass}`}
              >
                {isSubmitting ? 'Sending Code...' : 'Send Verification Code →'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
              Remember your password?{' '}
              <Link href="/auth/login" className="font-bold hover:underline" style={{ color: 'var(--sf-primary)' }}>
                Sign In
              </Link>
            </div>
          </div>
        )}

        {/* ── STEP 2: Verify 6-Digit OTP ──────────────────────────────────── */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold shadow-sm"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sf-primary) 15%, var(--sf-bg))',
                  color: 'var(--sf-primary)',
                  borderRadius: 'var(--sf-radius)',
                }}
              >
                ✉️
              </div>
              <h2 className="text-xl font-bold tracking-tight font-heading" style={{ color: 'var(--sf-text)' }}>
                Verify OTP Code
              </h2>
              <p className="text-xs mt-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
                We sent a 6-digit code to{' '}
                <strong style={{ color: 'var(--sf-text)' }}>{email}</strong>
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-bold hover:underline mt-1 block mx-auto"
                style={{ color: 'var(--sf-primary)' }}
              >
                (Change Email)
              </button>
            </div>

            {/* Dev Helper Hint */}
            {devOtpHint && (
              <div
                className="mb-4 p-2.5 rounded-xl border text-center text-[11px]"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sf-accent) 10%, var(--sf-bg))',
                  borderColor: 'color-mix(in srgb, var(--sf-accent) 30%, transparent)',
                  color: 'var(--sf-text)',
                }}
              >
                ⚡ Development Code: <strong className="font-mono text-xs">{devOtpHint}</strong>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-between gap-2 sm:gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { digitInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border transition sf-input"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpDigits.join('').length !== 6}
                className={`w-full py-3 px-4 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${primaryBtnClass}`}
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code & Proceed →'}
              </button>
            </form>

            <div
              className="mt-6 flex items-center justify-between text-xs pt-2 border-t"
              style={{
                borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
              }}
            >
              <span>Didn&apos;t get a code?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="font-bold hover:underline"
                  style={{ color: 'var(--sf-primary)' }}
                >
                  Resend Code
                </button>
              ) : (
                <span className="font-mono opacity-60">
                  Resend in {countdown}s
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Create New Password ─────────────────────────────────── */}
        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold shadow-sm"
                style={{
                  backgroundColor: 'color-mix(in srgb, #10b981 15%, var(--sf-bg))',
                  color: '#10b981',
                  borderRadius: 'var(--sf-radius)',
                }}
              >
                🔑
              </div>
              <h2 className="text-xl font-bold tracking-tight font-heading" style={{ color: 'var(--sf-text)' }}>
                Create New Password
              </h2>
              <p className="text-xs mt-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
                Choose a strong password with at least 6 characters.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--sf-text)' }}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 pr-10 border text-xs transition ${inputClassName || 'sf-input'}`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 text-xs font-semibold"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--sf-text)' }}>
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 border text-xs transition ${inputClassName || 'sf-input'}`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${primaryBtnClass}`}
              >
                {isSubmitting ? 'Updating Password...' : 'Reset Password & Finish →'}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 4: Success Confirmation ────────────────────────────────── */}
        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-md animate-bounce">
              ✓
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-heading" style={{ color: 'var(--sf-text)' }}>
              Password Reset!
            </h2>
            <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
              Your password has been successfully updated. You can now log into your account with your new credentials.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className={`w-full py-3 px-4 transition duration-200 ${primaryBtnClass}`}
            >
              Sign In to Your Account →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
