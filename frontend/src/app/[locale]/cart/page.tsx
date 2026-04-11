'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const t = useTranslations('cart');

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 200000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('empty')}</h2>
          <p className="text-gray-500 mb-6">{t('addProducts')}</p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/${locale}/products`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">{t('title')}</h1>
          <span className="text-gray-500">{t('itemsCount', { count: items.length })}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                  <p className="text-primary-600 font-semibold mt-1">{formatPrice(item.price)}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">{t('orderSummary')}</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('subtotal')}</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('shipping')}</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? (locale === 'vi' ? 'Miễn phí' : 'Free') : formatPrice(shippingFee)}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-green-600">
                    {t('buyMoreForFree', { amount: formatPrice(200000 - subtotal) })}
                  </p>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>{t('total')}</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push(`/${locale}/checkout`)}
                className="w-full mt-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                {t('checkout')}
              </button>

              <Link
                href={`/${locale}/products`}
                className="block w-full mt-3 py-3 text-center border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {t('continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
