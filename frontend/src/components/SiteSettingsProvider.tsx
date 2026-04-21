'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSiteSettingsStore } from '@/store/siteSettingsStore';

export default function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const loadPublic = useSiteSettingsStore((s) => s.loadPublic);
  const loaded = useSiteSettingsStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) loadPublic();
  }, [loaded, loadPublic]);

  if (!loaded) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#0e4b85] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#0e4b85] font-medium animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

