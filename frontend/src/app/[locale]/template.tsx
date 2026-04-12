import { Suspense } from 'react';

/** Không lặp Header/Footer — đã có trong [locale]/layout.tsx. */
export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
