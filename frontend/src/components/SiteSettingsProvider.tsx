'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSiteSettingsStore } from '@/store/siteSettingsStore';

export default function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const loadPublic = useSiteSettingsStore((s) => s.loadPublic);
  const loaded = useSiteSettingsStore((s) => s.loaded);

  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
    if (!loaded) loadPublic();
  }, [loaded, loadPublic]);

  // Prevent hydration mismatch while keeping SSR visible
  if (!hasHydrated) return <>{children}</>;

  return <>{children}</>;
}

