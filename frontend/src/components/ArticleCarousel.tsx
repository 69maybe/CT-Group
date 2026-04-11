'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  category: string;
}

interface ArticleCarouselProps {
  articles: Article[];
}

export default function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations('home');

  useEffect(() => {
    if (articles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) return null;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 bg-white/20 text-neutral-900 rounded-full text-sm font-medium backdrop-blur-sm">
            {t('carousel.label')}
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {articles.map((article, index) => (
                <div
                  key={article.id}
                  className="w-full flex-shrink-0"
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8">
                    <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl">
                      {article.image ? (
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-300 to-secondary-300 flex items-center justify-center">
                          <span className="text-8xl">🍽️</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 text-primary-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-black">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight line-clamp-3">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-primary-500 text-lg line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                      <Link
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center gap-2 px-0 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-primary-50 transition-all hover:scale-105 mt-4"
                      >
                        {t('carousel.readMore')}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {articles.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:translate-x-0 w-12 h-12 bg-white/90 hover:bg-white text-primary-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-0 w-12 h-12 bg-white/90 hover:bg-white text-primary-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="flex justify-center gap-2 mt-6">
                {articles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
