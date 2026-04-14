'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useLoading } from '../hooks/useLoading';

export default function RouteChangeListener() {
  const pathname = usePathname();
  const { showLoading, hideLoading } = useLoading();
  const previousPathname = useRef(pathname);
  const timerRef = useRef(null);

  useEffect(() => {
    // Only trigger loading if the pathname actually changed
    if (pathname !== previousPathname.current) {
      showLoading();
      previousPathname.current = pathname;
      
      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);
      
      // Hide loading after route completes
      timerRef.current = setTimeout(() => hideLoading(), 800);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]); // Only depend on pathname, not showLoading/hideLoading

  return null;
}
