'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Package, Search, DollarSign } from 'lucide-react';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  price: number;
  comparePrice?: number;
  image?: string;
  images?: string[];
  stock: number;
  unit?: string;
  category?: { id: string; name: string; slug: string };
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  createdAt: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { accessToken } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!accessToken) return;
    
    try {
      const response = await api.getProducts({ limit: 100 });
      const data = response.data?.items || response.data || [];
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    
    try {
      await api.deleteProduct(accessToken!, id);
      toast.success(t('deleteSuccess'));
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || tCommon('error'));
    }
  };

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('manageProducts')}</h1>
        <a
          href={`/${locale}/admin/products/new`}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-5 h-5" />
          {t('addProduct')}
        </a>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('searchProducts')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('product')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('price')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Tồn kho' : 'Stock'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('categories')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Thao tác' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">{t('noProductsYet')}</td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {product.image ? (
                        <img src={product.image} alt="" className="w-16 h-16 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{formatPrice(product.price)}</span>
                    </div>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <p className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={product.stock < 10 ? 'text-red-600 font-medium' : ''}>
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {product.category.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {product.isActive ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded">{locale === 'vi' ? 'Hoạt động' : 'Active'}</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{locale === 'vi' ? 'Tắt' : 'Inactive'}</span>
                      )}
                      {product.isFeatured && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-xs rounded">{locale === 'vi' ? 'Nổi bật' : 'Featured'}</span>
                      )}
                      {product.isBestSeller && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded">{locale === 'vi' ? 'Bán chạy' : 'Best Seller'}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/${locale}/admin/products/${product.id}`}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                        title={tCommon('edit')}
                      >
                        <Edit className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                        title={tCommon('delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}