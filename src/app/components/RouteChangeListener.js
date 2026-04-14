'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useContext } from 'react';
import { useLoading } from '../hooks/useLoading';
import { GlobalContext } from '../context/GlobalContext';

export default function RouteChangeListener() {
  const pathname = usePathname();
  const { showLoading, hideLoading } = useLoading();
  const { setCurrentUrl } = useContext(GlobalContext);
  const previousPathname = useRef(null);
  const timerRef = useRef(null);

  // Extract segment helper
  const getSegment = (path) => {
    const pathWithoutBase = path.replace(/^\/energy/, '') || '/';
    if (pathWithoutBase === '/') return '/';
    const segments = pathWithoutBase.split('/').filter(Boolean);
    return segments[segments.length - 1];
  };

  // Initialize on mount
  useEffect(() => {
    setCurrentUrl(getSegment(pathname));
    previousPathname.current = pathname;
  }, []);

  // Handle pathname changes
  useEffect(() => {
    if (previousPathname.current !== null && pathname !== previousPathname.current) {
      showLoading();
      setCurrentUrl(getSegment(pathname));
      previousPathname.current = pathname;
      
      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);
      
      // Hide loading after route completes
      timerRef.current = setTimeout(() => hideLoading(), 800);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, showLoading, hideLoading, setCurrentUrl]);

  return null;
}
