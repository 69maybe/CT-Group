'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const t = useTranslations('account');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [isAuthenticated, locale, router]);

  const handleLogout = () => {
    logout();
    router.push(`/${locale}`);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="font-semibold text-xl">{user.name}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('logout')}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-xl mb-6">{t('profile')}</h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg">{user.phone || t('notSet')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg">{user.address || t('notSet')}</p>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">{t('roles')}</h3>
              <div className="flex flex-wrap gap-2">
                {user.roles?.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500 pt-4 border-t border-gray-100">
              {t('newsHint')}{' '}
              <Link href={`/${locale}/news`} className="text-primary-600 hover:underline font-medium">
                {t('viewNews')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
