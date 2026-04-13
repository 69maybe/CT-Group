/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** Backend gốc cho rewrite: trình duyệt gọi /api/* → Next proxy → backend (tránh CORS & lỗi fetch tới cổng khác). */
function normalizeBackendOrigin(raw) {
  const t = String(raw || '').trim().replace(/\/$/, '');
  if (!t) return 'http://127.0.0.1:5000';
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('127.0.0.1') || t.startsWith('localhost')) return `http://${t}`;
  return `https://${t}`;
}

const backendOrigin = normalizeBackendOrigin(
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || process.env.INTERNAL_API_URL
);

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'greenlife-food-production.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: 'ctgroupvietnam.com',
      },
      {
        protocol: 'https',
        hostname: '**.ctgroupvietnam.com',
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
