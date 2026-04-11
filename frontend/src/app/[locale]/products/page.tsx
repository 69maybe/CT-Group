'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  comparePrice?: string | number;
  image?: string;
  shortDesc?: string;
  calories?: number;
  stock?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  unit?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function ProductsContent() {
  const t = useTranslations('products');
  const params = useParams();
  const locale = params.locale as string;
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || '');
  const limit = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, sort, selectedCategory]);

  useEffect(() => {
    setSelectedCategory(categorySlug || '');
    setPage(1);
  }, [categorySlug]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        page,
        limit,
        category: selectedCategory || undefined,
        sort: sort,
      });
      setProducts(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('categories')}
          </h3>
          
          <div className="space-y-2">
            <button
              onClick={() => {
                setSelectedCategory('');
                setPage(1);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === ''
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t('allProducts')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setPage(1);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Sort Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            {t('showingCount', { count: products.length, total })}
          </p>
          
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600">{t('sortBy')}:</label>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 cursor-pointer hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">{t('newest')}</option>
                <option value="price_asc">{t('priceAsc')}</option>
                <option value="price_desc">{t('priceDesc')}</option>
                <option value="popular">{t('popular')}</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-500 text-lg">{t('noProducts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              {locale === 'vi' ? 'Trước' : 'Previous'}
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === i + 1
                    ? 'bg-primary-500 text-white'
                    : 'border hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              {locale === 'vi' ? 'Tiếp' : 'Next'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  const t = useTranslations('products');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>

        <Suspense fallback={
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            </aside>
            <main className="flex-1">
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        }>
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  );
}
