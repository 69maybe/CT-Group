'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('auth');
  const { setAuth } = useAuthStore();
  const tCommon = useTranslations('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.login(email, password);
      
      // API returns: { data: { user, accessToken, refreshToken, permissions } }
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
          phone: userData.phone,
          permissions: data.permissions || [],
          roles: userData.roles || [],
        },
        data.accessToken,
        data.refreshToken
      );

      toast.success(tCommon('success'));
      
      // Redirect admin to admin page, others to home
      const isAdmin = userData.roles?.some((r) => 
        ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'STAFF'].includes(r)
      );
      
      if (isAdmin) {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}`);
      }
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
              {t('loginTitle')}
            </h1>
            <p className="text-gray-600 mt-2">{locale === 'vi' ? 'Chào mừng bạn quay trở lại' : 'Welcome back'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('loggingIn') : t('loginButton')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {t('noAccount')}{' '}
              <a
                href={`/${locale}/register`}
                className="text-primary-600 font-medium hover:underline"
              >
                {t('register')}
              </a>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">{locale === 'vi' ? 'Tài khoản demo:' : 'Demo accounts:'}</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Admin:</strong> admin@greenlifefood.vn / Admin@123</p>
              <p><strong>Customer:</strong> customer@example.com / Customer@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
