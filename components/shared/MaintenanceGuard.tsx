'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ThemeConfig } from '@/lib/api/types';
import { resolveTemplate } from '@/templates';
import { ShieldAlert, Eye, X } from 'lucide-react';

interface MaintenanceGuardProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

export function MaintenanceGuard({ theme, children }: MaintenanceGuardProps) {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [dismissBanner, setDismissBanner] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isBypass =
    searchParams?.get('bypass') === 'true' ||
    searchParams?.get('preview') === 'true' ||
    searchParams?.get('admin') === 'true';

  const isExplicitPreview =
    searchParams?.get('preview_maintenance') === 'true' ||
    searchParams?.get('maintenance') === 'true';

  const { MaintenancePage } = resolveTemplate(theme.activeTemplateSlug);

  // If explicit maintenance preview requested
  if (isExplicitPreview) {
    return <MaintenancePage theme={theme} />;
  }

  // If maintenance mode is active
  if (theme.maintenanceMode) {
    // If admin has bypass flag, show top warning banner and let them see the site
    if (mounted && isBypass) {
      return (
        <>
          {!dismissBanner && (
            <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-black px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  <strong>MAINTENANCE MODE ACTIVE:</strong> Public visitors currently see the maintenance screen. You are viewing in Admin Preview Bypass mode.
                </span>
              </div>
              <button
                onClick={() => setDismissBanner(true)}
                className="p-1 hover:bg-amber-600 rounded transition cursor-pointer"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className={!dismissBanner ? 'pt-8' : ''}>{children}</div>
        </>
      );
    }

    // Otherwise show the template's designated maintenance screen
    return <MaintenancePage theme={theme} />;
  }

  // Normal storefront rendering
  return <>{children}</>;
}
