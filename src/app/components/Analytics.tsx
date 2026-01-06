'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '../lib/analytics';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track initial page load
    trackPageView(pathname, document.title);
  }, [pathname]);

  return null;
}
