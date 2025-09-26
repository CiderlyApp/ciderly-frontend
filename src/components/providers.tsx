// src/components/providers.tsx
'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: ReactNode }) {
  // Здесь в будущем можно будет добавлять и другие провайдеры
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}