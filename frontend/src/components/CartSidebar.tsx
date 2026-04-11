'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useParams, useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const t = useTranslations('cart');

  useEffect(() => {
    const handleCartUpdate = () => {
      // Trigger re-render when cart is updated
      setIsOpen((prev) => {
        const items = useCartStore.getState().items;
        if (items && items.length > 0) return true;
        return prev;
      });
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 200000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    setIsOpen(false);
    router.push(`/${locale}/checkout`);
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-lg">{t('title')}</h2>
            <span className="text-sm text-gray-500">({items.length})</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh]">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-gray-50 rounded-lg p-3">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                <p className="text-primary-600 font-semibold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center border rounded-full hover:bg-gray-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center border rounded-full hover:bg-gray-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('subtotal')}</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('shipping')}</span>
              <span className="font-medium">
                {shippingFee === 0 ? t('freeShipping').split(' ')[0] : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>{t('total')}</span>
              <span className="text-primary-600">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              {t('checkout')}
            </button>
            <Link
              href={`/${locale}/cart`}
              onClick={() => setIsOpen(false)}
              className="block w-full py-3 text-center border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {t('continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
