import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToasterProvider } from '@/components/ToasterProvider';
import DocumentLang from '@/components/DocumentLang';
import SiteSettingsProvider from '@/components/SiteSettingsProvider';
import IdleLogout from '@/components/IdleLogout';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en';
  return {
    description: isEn 
      ? 'SYSMAC JSC — High-tech, multi-sector corporation.'
      : 'SYSMAC JSC — công nghệ cao, đa lĩnh vực.',
    keywords: 'SYSMAC JSC, Vietnam, technology, smart city, AI, biotech, drone, semiconductor',
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'vi': '/vi',
        'en': '/en',
      },
    },
    openGraph: {
      locale: isEn ? 'en_US' : 'vi_VN',
    }
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <>
      <DocumentLang />
      <ToasterProvider />
      <NextIntlClientProvider messages={messages}>
        <SiteSettingsProvider>
          <IdleLogout />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SiteSettingsProvider>
      </NextIntlClientProvider>
    </>
  );
}
