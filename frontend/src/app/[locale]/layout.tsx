import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToasterProvider } from '@/components/ToasterProvider';
import DocumentLang from '@/components/DocumentLang';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CT GROUP VIETNAM - Công Nghệ Cao',
  description:
    'CT GROUP VIETNAM - Đổi Mới Công Nghệ, Kiến Tạo Tương Lai. 15 lĩnh vực kinh doanh đa dạng từ Smart City đến AI.',
  keywords: 'CT GROUP, Vietnam, technology, smart city, AI, biotech, drone, semiconductor',
  icons: {
    icon: '/images/ctgroup/logo.png',
  },
};

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
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </>
  );
}
