'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Plus } from 'lucide-react';
import { useCartStore, CartItem } from '@/store/cartStore';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface ProductCardProps {
  product: {
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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('products');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) return;
    
    setIsAdding(true);
    
    const item: Omit<CartItem, 'id'> = {
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
      unit: product.unit || 'phần',
    };
    
    addItem(item);
    
    // Dispatch event for cart sidebar
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success(t('addToCartSuccess', { name: product.name }));
    
    setTimeout(() => setIsAdding(false), 500);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/${locale}/products/${product.slug}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingBag className="w-16 h-16" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isBestSeller && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
                {locale === 'vi' ? 'Bán chạy' : 'Best Seller'}
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded">
                {locale === 'vi' ? 'Nổi bật' : 'Featured'}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`absolute bottom-3 right-3 p-3 rounded-full shadow-lg transition-all duration-300 ${
              isOutOfStock 
                ? 'bg-gray-300 cursor-not-allowed' 
                : isAdding 
                  ? 'bg-green-500 text-white scale-110' 
                  : 'bg-primary-500 text-white hover:bg-primary-600 hover:scale-110'
            }`}
          >
            <Plus className={`w-5 h-5 ${isAdding ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          {product.shortDesc && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
              {product.shortDesc}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            {product.calories && (
              <span className="text-xs text-gray-500">
                {product.calories} cal
              </span>
            )}
          </div>

          {isOutOfStock && (
            <span className="inline-block mt-2 text-sm text-red-500 font-medium">
              {t('outOfStock')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
