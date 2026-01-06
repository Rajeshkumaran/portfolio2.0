'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, testAnalytics } from '../lib/analytics';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track initial page load
    trackPageView(pathname, document.title);

    // Test analytics in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        testAnalytics();
      }, 2000);
    }
  }, [pathname]);

  return null;
}
