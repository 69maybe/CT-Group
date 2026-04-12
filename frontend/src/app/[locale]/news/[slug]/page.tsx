'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';
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

/** Nội dung mẫu khi không gọi được API (cùng slug với seed backend & trang tin fallback) */
function getOfflineArticle(slug: string, locale: string): any | null {
  const vi = locale === 'vi';
  const blocks: Record<string, { title: { vi: string; en: string }; html: { vi: string; en: string }; image: string; at: string }> = {
    'ct-smart-city-vietnam-tech-week-2026': {
      title: {
        vi: 'CT GROUP giới thiệu giải pháp Smart City tại Vietnam Tech Week 2026',
        en: 'CT GROUP Introduces Smart City Solutions at Vietnam Tech Week 2026',
      },
      html: {
        vi: '<p>CT GROUP đã tham gia Vietnam Tech Week 2026 với các giải pháp thành phố thông minh.</p><p>Khi backend hoạt động, nội dung đầy đủ sẽ được tải từ máy chủ.</p>',
        en: '<p>CT GROUP participated in Vietnam Tech Week 2026 with smart city solutions.</p><p>When the backend is available, full content loads from the server.</p>',
      },
      image: '/images/ctgroup/CT-Land.jpg',
      at: '2026-03-15T12:00:00',
    },
    'ct-ai-partnership-japan-2026': {
      title: {
        vi: 'Hợp tác chiến lược với đối tác Nhật Bản trong lĩnh vực AI',
        en: 'Strategic Partnership with Japanese Partner in AI Field',
      },
      html: {
        vi: '<p>CT GROUP ký kết hợp tác chiến lược trong lĩnh vực AI.</p>',
        en: '<p>CT GROUP signed a strategic partnership in AI.</p>',
      },
      image: '/images/ctgroup/Logiin.jpg',
      at: '2026-02-28T12:00:00',
    },
    'ct-innovation-hub-4-launch': {
      title: {
        vi: 'Ra mắt CT Innovation Hub 4.0 - Trung tâm đổi mới sáng tạo',
        en: 'Launch of CT Innovation Hub 4.0 - Innovation Center',
      },
      html: {
        vi: '<p>CT GROUP ra mắt trung tâm đổi mới sáng tạo.</p>',
        en: '<p>CT GROUP launches the innovation center.</p>',
      },
      image: '/images/ctgroup/Bon-14.jpg',
      at: '2026-01-20T12:00:00',
    },
  };
  const b = blocks[slug];
  if (!b) return null;
  return {
    title: vi ? b.title.vi : b.title.en,
    content: vi ? b.html.vi : b.html.en,
    image: b.image,
    publishedAt: b.at,
    category: 'NEWS',
    author: 'CT GROUP',
  };
}

export default function NewsDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const slug = params.slug as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getArticle(slug, locale);
        if (!cancelled) setArticle(data);
      } catch (e) {
        if (!cancelled) {
          const offline = getOfflineArticle(slug, locale);
          if (offline) {
            setArticle(offline);
            setError(null);
          } else {
            setError(e instanceof Error ? e.message : 'Error');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ct-blue border-t-transparent" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-6">{error || (locale === 'vi' ? 'Không tìm thấy bài viết.' : 'Article not found.')}</p>
        <Link href={`/${locale}/news`} className="text-ct-blue font-medium">
          {locale === 'vi' ? '← Quay lại tin tức' : '← Back to news'}
        </Link>
      </div>
    );
  }

  const dateStr = article.publishedAt || article.createdAt;
  const img = article.image || '/images/ctgroup/logo.png';

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-ct-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === 'vi' ? 'Quay lại tin tức' : 'Back to News'}
          </Link>
        </div>
      </div>

      <article className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-ct-blue text-white text-sm px-3 py-1 rounded-full">
                  {categoryLabel(
                    typeof article.category === 'string' ? article.category : String(article.category ?? ''),
                    locale
                  )}
                </span>
                <span className="text-gray-500">
                  {dateStr
                    ? new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : ''}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
              <div className="flex items-center gap-4 text-gray-500">
                <span>{article.author || 'CT GROUP'}</span>
                <div className="flex gap-2 ml-auto">
                  <span className="sr-only">Share</span>
                  <Facebook className="w-5 h-5 opacity-50" />
                  <Twitter className="w-5 h-5 opacity-50" />
                  <Linkedin className="w-5 h-5 opacity-50" />
                </div>
              </div>
            </header>

            <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
              <Image src={img} alt={article.title} fill className="object-cover" />
            </div>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: article.content || '',
              }}
            />

            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">{locale === 'vi' ? 'Chia sẻ:' : 'Share:'}</span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
