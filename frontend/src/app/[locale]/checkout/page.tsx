'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, CreditCard, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { items, getSubtotal, clearCart } = useCartStore();
  const { isAuthenticated, accessToken, user } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const t = useTranslations('checkout');

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 200000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    customerEmail: user?.email || '',
    customerAddress: '',
    note: '',
    paymentMethod: 'COD',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isAuthenticated || !accessToken) {
        toast.error(t('pleaseLogin'));
        router.push(`/${locale}/login`);
        return;
      }

      const data = await api.createOrder(accessToken, {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        ...formData,
      });

      setOrderNumber(data.orderNumber);
      clearCart();
      setStep(2);
      toast.success(t('orderSuccess'));
    } catch (error: any) {
      toast.error(error.message || t('orderFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('orderSuccess')}</h1>
          <p className="text-gray-600 mb-4">
            {t('thankYou')}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">{t('orderNumber')}</p>
            <p className="text-2xl font-bold text-primary-600">{orderNumber}</p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            {locale === 'vi' ? 'Tiếp tục mua sắm' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    router.push(`/${locale}/cart`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/${locale}/cart`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">{t('title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" />
                {t('contactInfo')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0901 234 567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary-500" />
                {t('deliveryInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')} *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('addressPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('note')}</label>
                  <textarea
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('notePlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-lg mb-4">{t('paymentMethod')}</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="text-primary-500"
                  />
                  <div>
                    <p className="font-medium">{t('cod')}</p>
                    <p className="text-sm text-gray-500">{t('codDescription')}</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={formData.paymentMethod === 'BANK_TRANSFER'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="text-primary-500"
                  />
                  <div>
                    <p className="font-medium">{t('bankTransfer')}</p>
                    <p className="text-sm text-gray-500">{t('bankTransferDescription')}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">{t('orderSummary')}</h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{locale === 'vi' ? 'Tạm tính' : 'Subtotal'}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('shipping')}</span>
                  <span>{shippingFee === 0 ? (locale === 'vi' ? 'Miễn phí' : 'Free') : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{locale === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {loading ? t('processing') : t('placeOrder')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
