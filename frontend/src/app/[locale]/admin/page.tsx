'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { TrendingUp, ShoppingBag, Package, Users, DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Stats {
  orders: number;
  revenue: number;
  products: number;
  users: number;
}

interface TopProduct {
  id: string;
  name: string;
  image?: string;
  totalSold: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ orders: 0, revenue: 0, products: 0, users: 0 });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('admin');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    
    try {
      const [statsData, productsData] = await Promise.all([
        api.getDashboardStats(accessToken, 'week'),
        api.getTopProducts(accessToken),
      ]);
      
      setStats(statsData?.stats || { orders: 0, revenue: 0, products: 0, users: 0 });
      setTopProducts(productsData || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setStats({ orders: 0, revenue: 0, products: 0, users: 0 });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: t('orders'), value: stats.orders, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: t('totalRevenue'), value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-green-500' },
    { label: t('totalProducts'), value: stats.products, icon: Package, color: 'bg-purple-500' },
    { label: t('totalUsers'), value: stats.users, icon: Users, color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
        <select className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="week">{locale === 'vi' ? '7 ngày qua' : 'Last 7 days'}</option>
          <option value="month">{locale === 'vi' ? 'Tháng này' : 'This month'}</option>
          <option value="year">{locale === 'vi' ? 'Năm nay' : 'This year'}</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">{t('topProducts')}</h2>
        {topProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{locale === 'vi' ? 'Chưa có dữ liệu' : 'No data yet'}</p>
        ) : (
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl font-bold text-gray-300 w-8">#{i + 1}</span>
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                  {product.image && (
                    <img src={product.image} alt="" className="w-full h-full object-cover rounded-lg" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.totalSold} {locale === 'vi' ? 'đã bán' : 'sold'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
