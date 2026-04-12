'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { FileText, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AdminDashboard() {
  const [articleTotal, setArticleTotal] = useState(0);
  const [userTotal, setUserTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('admin');

  useEffect(() => {
    const load = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const [articlesPage, usersPage] = await Promise.all([
          api.getAdminArticles(accessToken, { limit: 1, page: 1, includeUnpublished: true }),
          api.getUsers(accessToken, { page: 1, limit: 1 }),
        ]);
        const a = articlesPage as { total?: number };
        const u = usersPage as { total?: number };
        setArticleTotal(typeof a?.total === 'number' ? a.total : 0);
        setUserTotal(typeof u?.total === 'number' ? u.total : (u as { items?: unknown[] })?.items?.length ?? 0);
      } catch {
        setArticleTotal(0);
        setUserTotal(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: t('totalArticles'),
      value: articleTotal,
      icon: FileText,
      color: 'bg-blue-500',
      href: `/${locale}/admin/articles`,
    },
    {
      label: t('totalUsers'),
      value: userTotal,
      icon: Users,
      color: 'bg-orange-500',
      href: `/${locale}/admin/users`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
        <p className="text-gray-500 mt-1">{t('dashboardNewsHint')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow block"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="text-gray-500 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
