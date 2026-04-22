'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Lock, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
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
      const response = await api.login(email.trim(), password);
      const raw = response as {
        user?: { id?: string; email?: string; name?: string; phone?: string; roles?: string[] };
        accessToken?: string;
        refreshToken?: string;
        permissions?: string[];
        data?: typeof response;
      };
      const payload = raw?.data && typeof raw.data === 'object' && 'user' in raw.data ? raw.data : raw;
      const userData = payload.user;

      if (!userData?.id) {
        throw new Error('Invalid response from server');
      }

      setAuth(
        {
          id: String(userData.id),
          email: userData.email ?? '',
          name: userData.name ?? '',
          phone: userData.phone,
          permissions: payload.permissions ?? [],
          roles: userData.roles ?? [],
        },
        payload.accessToken ?? '',
        payload.refreshToken
      );

      toast.success(tCommon('success'));

      const isAdmin = userData.roles?.some((r: string) =>
        ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'STAFF'].includes(r)
      );

      if (isAdmin) {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}`);
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-ct-blue via-blue-600 to-blue-800 text-white pt-10 pb-24 md:pt-14 md:pb-28">
        <div className="container mx-auto px-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backHome')}
          </Link>
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80 mb-2">
              SYSMAC JSC
            </p>
            <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">
              {t('loginTitle')}
            </h1>
            <p className="mt-3 text-lg text-white/90">{t('welcomeSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Card overlap */}
      <section className="flex-1 px-4 -mt-16 md:-mt-20 pb-16 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-0 lg:gap-0 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 bg-white ring-1 ring-gray-200/80">
            {/* Brand panel — desktop */}
            <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-ct-dark via-[#1e2a4a] to-ct-blue p-10 text-white relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -left-10 bottom-0 w-40 h-40 rounded-full bg-ct-red/20 blur-3xl" />
              <div className="relative">
                <div className="relative w-44 h-14 mb-8">
                  <Image
                    src="/images/ctgroup/logo.webp"
                    alt="SYSMAC JSC"
                    fill
                    className="object-contain object-left"
                    sizes="176px"
                    priority
                  />
                </div>
                <h2 className="text-xl font-semibold font-heading leading-snug">
                  {t('panelTitle')}
                </h2>
                <p className="mt-3 text-sm text-white/75 leading-relaxed">{t('panelSubtitle')}</p>
                <ul className="mt-8 space-y-4 text-sm text-white/90">
                  <li className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                    <span>{t('panelBullet1')}</span>
                  </li>
                  <li className="flex gap-3">
                    <Lock className="w-5 h-5 text-sky-200 shrink-0 mt-0.5" />
                    <span>{t('panelBullet2')}</span>
                  </li>
                </ul>
              </div>
              <p className="relative text-xs text-white/50 pt-8 border-t border-white/10">
                {t('secureNote')}
              </p>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 p-8 md:p-10 lg:p-12">
              <div className="lg:hidden flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="relative w-32 h-10">
                  <Image
                    src="/images/ctgroup/logo.webp"
                    alt="SYSMAC JSC"
                    fill
                    className="object-contain object-left"
                    sizes="128px"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto lg:mx-0 lg:max-w-none">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-semibold text-gray-800 mb-2">
                    {t('email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-ct-blue/30 focus:border-ct-blue focus:bg-white transition-all outline-none"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-semibold text-gray-800 mb-2">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-ct-blue/30 focus:border-ct-blue focus:bg-white transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-ct-blue text-white font-semibold shadow-lg shadow-ct-blue/25 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-ct-blue focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('loggingIn') : t('loginButton')}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600 lg:text-left">
                {t('noAccount')}{' '}
                <Link
                  href={`/${locale}/register`}
                  className="font-semibold text-ct-blue hover:text-blue-700 underline-offset-2 hover:underline"
                >
                  {t('register')}
                </Link>
              </p>

              <div className="mt-8 rounded-xl border border-ct-blue/15 bg-gradient-to-br from-blue-50/90 to-slate-50 p-4 md:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ct-blue mb-3">
                  {t('demoTitle')}
                </p>
                <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
                  <li className="font-mono text-[13px]">{t('demoAdmin')}</li>
                  <li className="font-mono text-[13px]">{t('demoCustomer')}</li>
                </ul>
              </div>

              <p className="mt-6 text-xs text-gray-400 text-center lg:text-left leading-relaxed">
                {t('secureNote')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
