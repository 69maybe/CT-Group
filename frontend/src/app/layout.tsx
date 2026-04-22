import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import 'react-quill/dist/quill.snow.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  metadataBase: new URL('https://sysmac.vn'),
  title: {
    default: 'SYSMAC JSC',
    template: '%s | SYSMAC JSC',
  },
  description: 'SYSMAC JSC — công nghệ cao, đa lĩnh vực.',
  keywords: ['SYSMAC', 'công nghệ cao', 'đa lĩnh vực', 'công ty công nghệ', 'phần mềm', 'giải pháp CNTT'],
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/vi',
      'en-US': '/en',
    },
  },
  authors: [{ name: 'SYSMAC JSC' }],
  creator: 'SYSMAC JSC',
  publisher: 'SYSMAC JSC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'SYSMAC JSC',
    description: 'SYSMAC JSC — công nghệ cao, đa lĩnh vực.',
    url: 'https://sysmac.vn',
    siteName: 'SYSMAC JSC',
    images: [
      {
        url: '/images/ctgroup/logo.png',
        width: 800,
        height: 600,
        alt: 'SYSMAC JSC Logo',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SYSMAC JSC',
    description: 'SYSMAC JSC — công nghệ cao, đa lĩnh vực.',
    images: ['/images/ctgroup/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/ctgroup/logo.png',
    apple: '/images/ctgroup/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SYSMAC JSC',
    url: 'https://sysmac.vn',
    logo: 'https://sysmac.vn/images/ctgroup/logo.png',
    description: 'SYSMAC JSC — công nghệ cao, đa lĩnh vực.',
  };

  return (
    <html suppressHydrationWarning lang="vi">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
