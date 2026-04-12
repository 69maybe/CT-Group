'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';

function categoryLabel(cat: string | undefined, locale: string) {
  const c = (cat || 'NEWS').toUpperCase();
  if (locale === 'vi') {
    const map: Record<string, string> = {
      NEWS: 'Tin tức',
      BLOG: 'Blog',
      RECRUITMENT: 'Tuyển dụng',
      PROMOTION: 'Khuyến mãi',
    };
    return map[c] || 'Tin tức';
  }
  return c.charAt(0) + c.slice(1).toLowerCase();
}

/** Tin mẫu khi API chưa chạy / DB trống / lỗi mạng — cùng slug với seed backend */
function getFallbackArticles(locale: string) {
  return [
    {
      id: 'fallback-1',
      slug: 'ct-smart-city-vietnam-tech-week-2026',
      title:
        locale === 'vi'
          ? 'CT GROUP giới thiệu giải pháp Smart City tại Vietnam Tech Week 2026'
          : 'CT GROUP Introduces Smart City Solutions at Vietnam Tech Week 2026',
      excerpt:
        locale === 'vi'
          ? 'CT GROUP đã giới thiệu các giải pháp thành phố thông minh tiên tiến tại sự kiện Vietnam Tech Week 2026.'
          : 'CT GROUP showcased advanced smart city solutions at Vietnam Tech Week 2026.',
      image: '/images/ctgroup/CT-Land.jpg',
      category: 'NEWS',
      publishedAt: '2026-03-15T12:00:00',
    },
    {
      id: 'fallback-2',
      slug: 'ct-ai-partnership-japan-2026',
      title:
        locale === 'vi'
          ? 'Hợp tác chiến lược với đối tác Nhật Bản trong lĩnh vực AI'
          : 'Strategic Partnership with Japanese Partner in AI Field',
      excerpt:
        locale === 'vi'
          ? 'CT GROUP ký kết hợp tác chiến lược với tập đoàn công nghệ hàng đầu Nhật Bản.'
          : 'CT GROUP signs strategic partnership with a leading Japanese technology group.',
      image: '/images/ctgroup/Logiin.jpg',
      category: 'NEWS',
      publishedAt: '2026-02-28T12:00:00',
    },
    {
      id: 'fallback-3',
      slug: 'ct-innovation-hub-4-launch',
      title:
        locale === 'vi'
          ? 'Ra mắt CT Innovation Hub 4.0 - Trung tâm đổi mới sáng tạo'
          : 'Launch of CT Innovation Hub 4.0 - Innovation Center',
      excerpt:
        locale === 'vi'
          ? 'CT GROUP chính thức ra mắt CT Innovation Hub 4.0.'
          : 'CT GROUP officially launches CT Innovation Hub 4.0.',
      image: '/images/ctgroup/Bon-14.jpg',
      category: 'NEWS',
      publishedAt: '2026-01-20T12:00:00',
    },
  ];
}

export default function NewsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.getArticles({ page: 1, limit: 24, locale });
        const list = res.items || [];
        if (!cancelled) setItems(list);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const displayed = useMemo(() => {
    if (items.length > 0) return items;
    return getFallbackArticles(locale);
  }, [items, locale]);

  const isSample = items.length === 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ct-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative bg-gradient-to-r from-ct-blue to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === 'vi' ? 'TIN TỨC' : 'NEWS'}
            </h1>
            <p className="text-xl opacity-90">
              {locale === 'vi'
                ? 'Cập nhật tin tức mới nhất từ CT GROUP'
                : 'Latest updates from CT GROUP'}
            </p>
          </div>
        </div>
      </section>

      {isSample && (
        <div className="bg-amber-50 border-b border-amber-100 py-2 text-center text-sm text-amber-900">
          {locale === 'vi'
            ? 'Đang hiển thị tin mẫu. Khi backend kết nối, danh sách sẽ lấy từ API.'
            : 'Showing sample news. Connect the backend to load live articles.'}
        </div>
      )}

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((item) => {
              const img = item.image || '/images/ctgroup/logo.png';
              const dateStr = item.publishedAt || item.createdAt;
              return (
                <article
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image src={img} alt={item.title || ''} fill className="object-cover" />
                    <div className="absolute top-4 left-4 bg-ct-blue text-white text-xs px-3 py-1 rounded-full">
                      {categoryLabel(typeof item.category === 'string' ? item.category : undefined, locale)}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {dateStr
                        ? new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : ''}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{item.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt || ''}</p>
                    <Link
                      href={`/${locale}/news/${item.slug}`}
                      className="inline-flex items-center gap-2 text-ct-blue font-medium hover:gap-3 transition-all"
                    >
                      {locale === 'vi' ? 'Đọc thêm' : 'Read More'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
