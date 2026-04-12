/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** Backend gốc cho rewrite: trình duyệt gọi /api/* → Next proxy → backend (tránh CORS & lỗi fetch tới cổng khác). */
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
};

module.exports = withNextIntl(nextConfig);
