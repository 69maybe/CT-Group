'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  author?: string;
  category: string;
  tags: string[];
  viewCount: number;
  publishedAt: string;
  createdAt: string;
}

function NewsContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('news');

  const isVi = locale === 'vi';

  useEffect(() => {
    fetchArticles();
  }, [category, locale]);

  const fetchArticles = async () => {
    try {
      const data = await api.getArticles({ category: category || undefined, locale });
      setArticles(data.items);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: '', label: t('allCategories') },
    { value: 'NEWS', label: t('news') },
    { value: 'BLOG', label: t('blog') },
    { value: 'RECRUITMENT', label: t('recruitment') },
    { value: 'PROMOTION', label: t('promotion') },
  ];

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <Link
            key={cat.value}
            href={cat.value ? `/${locale}/news?category=${cat.value}` : `/${locale}/news`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              (category || '') === cat.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('noArticles')}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/${locale}/news/${article.slug}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      📰
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString(isVi ? 'vi-VN' : 'en-US')}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function NewsPage() {
  const t = useTranslations('news');

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-4">{t('title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <Suspense fallback={
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        }>
          <NewsContent />
        </Suspense>
      </div>
    </div>
  );
}
