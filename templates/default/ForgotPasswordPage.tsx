'use client';

import DefaultHeader from './Header';
import DefaultFooter from './Footer';
import { ForgotPasswordBody } from '@/components/shared/ForgotPasswordBody';
import type { ThemeConfig } from '@/lib/api/types';

export default function DefaultForgotPasswordPage({ theme }: { theme: ThemeConfig }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--sf-bg)', color: 'var(--sf-text)' }}
    >
      <DefaultHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <ForgotPasswordBody
          theme={theme}
          cardClassName="border shadow-2xl backdrop-blur-md"
          buttonClassName="font-semibold shadow-md"
        />
      </main>
      <DefaultFooter />
    </div>
  );
}
