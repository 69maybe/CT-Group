'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

/** Đồng bộ <html lang> với locale trong URL (layout không bọc thêm <html>). */
export default function DocumentLang() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  useEffect(() => {
    if (typeof document !== 'undefined' && locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
