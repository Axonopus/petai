"use client";

import { ReactNode } from 'react';
import { LoadingProvider } from './loading-provider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LoadingProvider>
      {children}
    </LoadingProvider>
  );
}

export { useLoading } from './loading-provider';