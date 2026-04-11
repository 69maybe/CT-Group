'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Minus, Plus, Check, Flame } from 'lucide-react';
import { useCartStore, CartItem } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  description?: string;
  shortDesc?: string;
  image?: string;
  images?: string[];
  stock?: number;
  calories?: number;
  unit?: string;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  category?: { name: string; slug: string };
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const params = useParams();
  const locale = params.locale as string;
  const slug = params.slug as string;
  const t = useTranslations('products');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const data = await api.getProduct(slug);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    
    const item: Omit<CartItem, 'id'> = {
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity,
      unit: product.unit || 'phần',
    };
    
    addItem(item);
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(t('addToCartSuccess', { name: product.name }));
    
    setTimeout(() => setIsAdding(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('productNotFound')}</h1>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square bg-gray-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag className="w-32 h-32" />
                  </div>
                )}
              </div>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestSeller && (
                  <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
                    {locale === 'vi' ? 'Bán chạy' : 'Best Seller'}
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                    {locale === 'vi' ? 'Nổi bật' : 'Featured'}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {product.category && (
                <p className="text-sm text-primary-600 font-medium mb-2">
                  {product.category.name}
                </p>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4 font-heading">
                {product.name}
              </h1>

              {product.shortDesc && (
                <p className="text-gray-600 mb-4">{product.shortDesc}</p>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              {product.calories && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span>{product.calories} calories</span>
                </div>
              )}

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <span className="text-red-500 font-medium">{t('outOfStock')}</span>
                ) : (
                  <span className="text-green-600 font-medium">
                    {t('inStock', { stock: product.stock, unit: product.unit })}
                  </span>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              {!isOutOfStock && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                      isAdding
                        ? 'bg-green-500 text-white'
                        : 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg'
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-5 h-5" />
                        {locale === 'vi' ? 'Đã thêm!' : 'Added!'}
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        {t('addToCart')}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Features */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{locale === 'vi' ? '100% nguyên liệu tươi' : '100% fresh ingredients'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{t('fastDelivery')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{locale === 'vi' ? 'Không chất bảo quản' : 'No preservatives'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{t('moneyBack')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
