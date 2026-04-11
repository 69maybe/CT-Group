import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GreenLife Food - Healthy Food Delivery',
  description: 'Order fresh and healthy meals, salads, juices, and eat-clean dishes online.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
