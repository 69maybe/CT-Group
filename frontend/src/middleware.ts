import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: defaultLocale,
  localePrefix: 'always',
});

/** Cửa hàng / đơn hàng đã gỡ — chuyển sang tin tức hoặc quản lý bài viết. */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const storefront = pathname.match(/^\/(en|vi)\/(products|cart|checkout)(\/|$)/);
  if (storefront) {
    const locale = storefront[1];
    return NextResponse.redirect(new URL(`/${locale}/news`, request.url));
  }
  const adminCommerce = pathname.match(/^\/(en|vi)\/admin\/(products|categories|orders)(\/|$)/);
  if (adminCommerce) {
    const locale = adminCommerce[1];
    return NextResponse.redirect(new URL(`/${locale}/admin/articles`, request.url));
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|vi)/:path*'],
};
