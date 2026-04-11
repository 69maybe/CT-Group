'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.register({
        name,
        email,
        password,
        phone: phone || undefined,
      });
      
      // API returns: { data: { user, accessToken, refreshToken } }
      const data = response.data || response;
      const userData = data.user;
      
      if (!userData?.id) {
        throw new Error('Invalid response from server');
      }

      setAuth(
        {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          permissions: [],
          roles: ['Customer'],
        },
        data.accessToken,
        data.refreshToken
      );

      toast.success(tCommon('success'));
      router.push(`/${locale}`);
    } catch (error: any) {
      toast.error(error.message || tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  const isVi = locale === 'vi';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 font-heading">
              {t('registerTitle')}
            </h1>
            <p className="text-gray-600 mt-2">{t('createAccountSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder={isVi ? 'Nguyễn Văn Tèo' : 'John Cena'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="0901 234 567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">
                {isVi ? 'Ít nhất 8 ký tự, có chữ hoa, chữ thường và số' : 'At least 8 characters, uppercase, lowercase and number'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('registering') : t('registerButton')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {t('hasAccount')}{' '}
              <a
                href={`/${locale}/login`}
                className="text-primary-600 font-medium hover:underline"
              >
                {t('login')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
