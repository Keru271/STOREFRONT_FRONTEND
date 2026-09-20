'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import type { ThemeConfig } from '@/lib/api/types';
import { trackPageView } from '@/lib/analytics/events';

interface PixelTrackerProps {
  theme: ThemeConfig;
}

/**
 * PixelTracker dynamically injects official client-side tracking scripts
 * for Meta Pixel, GA4, TikTok Pixel, Pinterest Tag, Adobe Launch, and CleverTap
 * based on merchant store settings.
 * It also automatically tracks page views on client-side SPA route transitions.
 */
export function PixelTracker({ theme }: PixelTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route and query changes
  useEffect(() => {
    if (!pathname) return;
    const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    trackPageView(url);
  }, [pathname, searchParams]);

  const {
    metaPixelId,
    ga4MeasurementId,
    tikTokPixelId,
    pinterestTagId,
    adobeLaunchUrl,
    cleverTapAccountId,
    cleverTapRegion,
  } = theme || {};

  return (
    <>
      {/* ── META / FACEBOOK PIXEL ── */}
      {metaPixelId && (
        <>
          <Script
            id="meta-pixel-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId.trim()}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${metaPixelId.trim()}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* ── GOOGLE ANALYTICS 4 (GA4) ── */}
      {ga4MeasurementId && (
        <>
          <Script
            id="ga4-gtag-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId.trim()}`}
          />
          <Script
            id="ga4-gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4MeasurementId.trim()}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* ── TIKTOK ADS PIXEL ── */}
      {tikTokPixelId && (
        <Script
          id="tiktok-pixel-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${tikTokPixelId.trim()}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      )}

      {/* ── PINTEREST TAG ── */}
      {pinterestTagId && (
        <Script
          id="pinterest-tag-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(e){if(!window.pintrk){window.pintrk = function () {
              window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
                n=window.pintrk;n.queue=[],n.version="3.0";var
                t=document.createElement("script");t.async=!0,t.src=e;var
                r=document.getElementsByTagName("script")[0];
                r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
              pintrk('load', '${pinterestTagId.trim()}');
              pintrk('page');
            `,
          }}
        />
      )}

      {/* ── ADOBE ANALYTICS / LAUNCH ── */}
      {adobeLaunchUrl && (
        <Script
          id="adobe-launch-script"
          strategy="afterInteractive"
          src={adobeLaunchUrl.trim()}
        />
      )}

      {/* ── CLEVERTAP CUSTOMER ENGAGEMENT ── */}
      {cleverTapAccountId && (
        <Script
          id="clevertap-init-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var clevertap = window.clevertap || {event:[], profile:[], account:[], onUserLogin:[], notifications:[], privacy:[]};
              clevertap.account.push({"id": "${cleverTapAccountId.trim()}"${cleverTapRegion ? `, "region": "${cleverTapRegion.trim()}"` : ''}});
              clevertap.privacy.push({optOut: false});
              clevertap.privacy.push({useIP: false});
              (function () {
                var wzrk = document.createElement('script');
                wzrk.type = 'text/javascript';
                wzrk.async = true;
                wzrk.src = ('https:' == document.location.protocol ? 'https://d2r1yp2w7bvc2b.cloudfront.net' : 'http://static.clevertap.com') + '/js/clevertap.min.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(wzrk, s);
              })();
            `,
          }}
        />
      )}
    </>
  );
}
