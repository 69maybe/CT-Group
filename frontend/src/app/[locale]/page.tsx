'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Leaf, Truck, BadgeCheck, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ArticleCarousel from '@/components/ArticleCarousel';

export default function HomePage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const tProducts = useTranslations('products');
  const params = useParams();
  const locale = params.locale as string;

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ??
          "https://backend-production-446d.up.railway.app";
        const [productsRes, articlesRes] = await Promise.all([
          fetch(`${baseUrl}/api/products/featured`),
          fetch(`${baseUrl}/api/articles/featured?locale=${locale}`)
        ]);

        const productsData = await productsRes.json();
        const articlesData = await articlesRes.json();

        setFeaturedProducts(productsData.data || []);
        setFeaturedArticles(articlesData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [locale]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {locale === 'vi' ? 'Tươi & Healthy' : 'Fresh & Healthy'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-heading">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all hover:shadow-lg hover:scale-105"
                >
                  {t('hero.cta')}
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-primary-500 hover:text-primary-600 transition-all"
                >
                  {t('hero.secondary')}
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary-200 rounded-full blur-3xl opacity-50"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-lg p-4 transform hover:scale-105 transition-transform overflow-hidden">
                    <div className="bg-primary-100 rounded-xl h-32 mb-3 flex items-center justify-center">
                      <img
                        src="/images/salad.jpg"
                        alt="Fresh Salad"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-sm font-medium text-center">{locale === 'vi' ? 'Salad Tươi' : 'Fresh Salad'}</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-4 transform hover:scale-105 transition-transform overflow-hidden">
                    <div className="bg-orange-100 rounded-xl h-40 mb-3 flex items-center justify-center">
                      <img
                        src="/images/juice.jpg"
                        alt="Fresh Juice"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-sm font-medium text-center">{locale === 'vi' ? 'Nước Ép' : 'Fresh Juice'}</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-white rounded-2xl shadow-lg p-4 transform hover:scale-105 transition-transform overflow-hidden">
                    <div className="bg-green-100 rounded-xl h-40 mb-3 flex items-center justify-center">
                      <img
                        src="/images/eatclean.jpg"
                        alt="Eat Clean"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-sm font-medium text-center">{locale === 'vi' ? 'Eat-Clean' : 'Eat-Clean'}</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-4 transform hover:scale-105 transition-transform overflow-hidden">
                    <div className="bg-purple-100 rounded-xl h-32 mb-3 flex items-center justify-center">
                      <img
                        src="/images/smoothie.jpg"
                        alt="Smoothie"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-sm font-medium text-center">{locale === 'vi' ? 'Sinh tố' : 'Smoothie'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">
              {t('featuredProducts')}
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {tProducts('featuredSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center px-6 py-3 border-2 border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              {tNav('viewAll')}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">
              {t('aboutSection.title')}
            </h2>
            <p className="text-gray-600 mt-4">
              {t('aboutSection.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Leaf, titleKey: 'freshIngredient', descKey: 'freshIngredientDesc', color: 'text-green-500' },
              { icon: Sparkles, titleKey: 'professionalChef', descKey: 'professionalChefDesc', color: 'text-orange-500' },
              { icon: Truck, titleKey: 'fastDelivery', descKey: 'fastDeliveryDesc', color: 'text-blue-500' },
              { icon: BadgeCheck, titleKey: 'qualityGuarantee', descKey: 'qualityGuaranteeDesc', color: 'text-purple-500' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className={`${item.color} mb-4`}>
                  <item.icon size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(`aboutSection.${item.titleKey}`)}</h3>
                <p className="text-gray-600">{t(`aboutSection.${item.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-500 text-teal-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all"
            >
              {t('cta.orderNow')}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="inline-flex bg-green-400 items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
            >
              {t('cta.createAccount')}
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {featuredArticles.length > 0 && (
        <ArticleCarousel articles={featuredArticles} />
      )}

      {/* All News */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">
              {t('newsSection')}
            </h2>
          </div>
          <div className="text-center">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center px-6 py-3 bg-zinc-700 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              {tNav('viewAll')}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
