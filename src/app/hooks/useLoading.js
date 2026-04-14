'use client';

import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

export function useLoading() {
  const { isLoading, setIsLoading } = useContext(GlobalContext);

  return {
    isLoading,
    showLoading: () => setIsLoading(true),
    hideLoading: () => setIsLoading(false),
    setIsLoading,
  };
}
