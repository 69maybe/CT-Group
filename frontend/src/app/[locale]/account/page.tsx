'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { User, ShoppingBag, Package, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';
import { formatPrice, formatDateTime, ORDER_STATUS_COLORS, ORDER_STATUS_VI } from '@/lib/utils';
import { api } from '@/lib/api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  items: any[];
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, logout } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const t = useTranslations('account');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

    const fetchOrders = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      if (!token) return;
      const data = await api.getOrders(token);
      setOrders(data.items || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}`);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const tabs = [
    { id: 'orders', label: t('orders'), icon: ShoppingBag },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  {t('logout')}
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-semibold text-xl mb-6">{t('orderHistory')}</h2>
                
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{t('noOrders')}</p>
                    <Link
                      href={`/${locale}/products`}
                      className="inline-block mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                    >
                      Bắt đầu mua sắm
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                          <div>
                            <p className="font-semibold">#{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                              {ORDER_STATUS_VI[order.status] || order.status}
                            </span>
                            <span className="font-bold text-lg">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {order.items.slice(0, 4).map((item, i) => (
                            <div key={i} className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                              {item.product?.image && (
                                <img src={item.product.image} alt="" className="w-full h-full object-cover rounded" />
                              )}
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm flex-shrink-0">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-semibold text-xl mb-6">{t('profile')}</h2>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <p className="px-4 py-3 bg-gray-50 rounded-lg">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="px-4 py-3 bg-gray-50 rounded-lg">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <p className="px-4 py-3 bg-gray-50 rounded-lg">{user.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <p className="px-4 py-3 bg-gray-50 rounded-lg">{user.address || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Vai trò</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.roles?.map((role) => (
                        <span key={role} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
