'use client';

import React from 'react';
import type { ThemeConfig } from '@/lib/api/types';

// Template Headers & Footers
import DefaultHeader from '@/templates/default/Header';
import DefaultFooter from '@/templates/default/Footer';
import MincomHeader from '@/templates/mincom/Header';
import MincomFooter from '@/templates/mincom/Footer';
import NovaHeader from '@/templates/nova/Header';
import NovaFooter from '@/templates/nova/Footer';
import LuxeHeader from '@/templates/luxe/Header';
import LuxeFooter from '@/templates/luxe/Footer';
import MinimalHeader from '@/templates/minimal/Header';
import MinimalFooter from '@/templates/minimal/Footer';
import FunoHeader from '@/templates/funo/Header';
import FunoFooter from '@/templates/funo/Footer';

interface TemplateLayoutProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

export function TemplateLayout({ theme, children }: TemplateLayoutProps) {
  const slug = (theme.activeTemplateSlug || 'mincom').toLowerCase();

  const renderHeader = () => {
    switch (slug) {
      case 'luxe':
      case 'velvet-luxury':
        return <LuxeHeader />;
      case 'nova':
      case 'nova-tech':
        return <NovaHeader />;
      case 'minimal':
        return <MinimalHeader />;
      case 'default':
      case 'pulse-streetwear':
        return <DefaultHeader />;
      case 'funo':
        return <FunoHeader />;
      case 'mincom':
      case 'mincom-furniture':
      case 'mincom-theme':
      case 'artisan-craft':
      default:
        return <MincomHeader />;
    }
  };

  const renderFooter = () => {
    switch (slug) {
      case 'luxe':
      case 'velvet-luxury':
        return <LuxeFooter />;
      case 'nova':
      case 'nova-tech':
        return <NovaFooter />;
      case 'minimal':
        return <MinimalFooter />;
      case 'default':
      case 'pulse-streetwear':
        return <DefaultFooter />;
      case 'funo':
        return <FunoFooter />;
      case 'mincom':
      case 'mincom-furniture':
      case 'mincom-theme':
      case 'artisan-craft':
      default:
        return <MincomFooter />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col antialiased"
      style={{
        backgroundColor: 'var(--sf-bg)',
        color: 'var(--sf-text)',
      }}
    >
      {renderHeader()}
      <main className="flex-1">{children}</main>
      {renderFooter()}
    </div>
  );
}
