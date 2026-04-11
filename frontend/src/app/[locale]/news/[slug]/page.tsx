'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Eye, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  image?: string;
  author?: string;
  category: string;
  tags: string[];
  viewCount: number;
  publishedAt: string;
  createdAt: string;
}

export default function NewsDetailPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const locale = params.locale as string;
  const slug = params.slug as string;
  const t = useTranslations('news');

  const isVi = locale === 'vi';

  useEffect(() => {
    fetchArticle();
  }, [slug, locale]);

  const fetchArticle = async () => {
    try {
      const data = await api.getArticle(slug, locale);
      setArticle(data);
      
      if (data.category) {
        const related = await api.getArticles({ category: data.category, locale });
        setRelatedArticles(related.items.filter((a: Article) => a.slug !== slug).slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('shareCopied'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('notFound')}</h1>
          <Link href={`/${locale}/news`} className="text-primary-600 hover:underline">
            {t('backToNews')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href={`/${locale}/news`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToNews')}</span>
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          <div className="aspect-video bg-gray-100 overflow-hidden">
            {article.image ? (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                📰
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="p-8">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full">
                {article.category}
              </span>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount} {t('views')}</span>
              </div>
              {article.author && (
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <span>{t('author')} {article.author}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-6">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-primary-500 pl-4">
                {article.excerpt}
              </p>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-600 text-sm">{t('tags')}</span>
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('share')}</span>
              </button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">{t('relatedArticles')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/${locale}/news/${related.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      {related.image ? (
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📰
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded">
                          {related.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(related.publishedAt || related.createdAt).toLocaleDateString(isVi ? 'vi-VN' : 'en-US')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
