import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import 'react-quill/dist/quill.snow.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  metadataBase: new URL('https://sysmac.vn'),
  title: {
    default: 'Giải pháp Công nghệ & Tự động hóa | SYSMAC JSC',
    template: '%s | SYSMAC JSC',
  },
  description: 'SYSMAC JSC cung cấp giải pháp AI, Smart City, IoT, Robotics và công nghệ cao tại Việt Nam, hỗ trợ doanh nghiệp chuyển đổi số toàn diện.',
  keywords: ['SYSMAC JSC', 'AI Vietnam', 'Smart City Vietnam', 'IoT solutions Vietnam', 'Industrial automation Vietnam', 'đa lĩnh vực', 'công ty công nghệ', 'phần mềm', 'giải pháp CNTT'],
  authors: [{ name: 'SYSMAC JSC' }],
  creator: 'SYSMAC JSC',
  publisher: 'SYSMAC JSC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    siteName: 'SYSMAC JSC',
    images: [
      {
        url: 'https://sysmac.vn/images/ctgroup/logo.png',
        width: 800,
        height: 600,
        alt: 'SYSMAC JSC Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://sysmac.vn/images/ctgroup/logo.png'],
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
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sysmac.vn/#organization',
        name: 'SYSMAC JSC',
        url: 'https://sysmac.vn',
        logo: 'https://sysmac.vn/images/ctgroup/logo.png',
        description: 'SYSMAC JSC cung cấp giải pháp AI, Smart City, IoT, Robotics và công nghệ cao tại Việt Nam.',
        sameAs: [
          'https://www.facebook.com/sysmacjsc',
          'https://www.linkedin.com/company/sysmac-jsc'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+84-123-456-789',
          contactType: 'customer service',
          email: 'contact@sysmac.vn'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Số 1, Đường 1',
          addressLocality: 'Hồ Chí Minh',
          addressCountry: 'VN'
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://sysmac.vn/#website',
        name: 'SYSMAC JSC',
        url: 'https://sysmac.vn',
        publisher: {
          '@id': 'https://sysmac.vn/#organization'
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://sysmac.vn/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <html suppressHydrationWarning lang="vi">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
        {children}
      </body>
    </html>
  );
}
