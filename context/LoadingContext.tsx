'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface LoadingContextValue {
  isLoading: boolean;
  message?: string;
  progress: number;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  setProgress: (progress: number) => void;
  withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const activeCountRef = useRef(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback((msg?: string) => {
    activeCountRef.current += 1;
    setMessage(msg);
    setIsLoading(true);

    // Animate progress bar incrementally up to 90%
    setProgress(15);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const diff = Math.max(1, Math.floor((90 - prev) * 0.15));
        return prev + diff;
      });
    }, 150);
  }, []);

  const stopLoading = useCallback(() => {
    activeCountRef.current = Math.max(0, activeCountRef.current - 1);
    if (activeCountRef.current === 0) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setMessage(undefined);
        setProgress(0);
      }, 250);
    }
  }, []);

  const withLoading = useCallback(
    async <T,>(promise: Promise<T>, msg?: string): Promise<T> => {
      startLoading(msg);
      try {
        const result = await promise;
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        message,
        progress,
        startLoading,
        stopLoading,
        setProgress,
        withLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoadingProvider');
  }
  return context;
}
