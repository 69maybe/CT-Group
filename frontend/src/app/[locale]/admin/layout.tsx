'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, FileText, Users, Shield, Grid3X3, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

function activeAdminMenuId(pathname: string | null, locale: string): string {
  if (!pathname) return 'dashboard';
  const base = `/${locale}/admin`;
  if (pathname === base || pathname === `${base}/`) return 'dashboard';
  if (!pathname.startsWith(`${base}/`)) return 'dashboard';
  const rest = pathname.slice(base.length + 1).split('/')[0];
  return rest || 'dashboard';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { user, isAuthenticated, accessToken } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('admin');

  const activeMenu = useMemo(() => activeAdminMenuId(pathname, locale), [pathname, locale]);

  const menuItems = [
    { id: 'users', label: t('users'), icon: Users, href: '/users' },
    { id: 'roles', label: t('roles'), icon: Shield, href: '/roles' },
  ];

  const contentMenuItems = [
    { id: 'articles', label: t('articles'), icon: FileText, href: '/articles' },
    { id: 'article-tags', label: locale === 'vi' ? 'Tags & Thuộc tính' : 'Tags & Metadata', icon: FileText, href: '/articles/tags' },
    { id: 'sectors', label: locale === 'vi' ? 'Lĩnh vực' : 'Sectors', icon: Grid3X3, href: '/sectors' },
  ];

  const isContentActive = pathname?.startsWith(`/${locale}/admin/articles`) || pathname?.startsWith(`/${locale}/admin/sectors`);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const syncSidebar = (event: MediaQueryListEvent | MediaQueryList) => {
      setSidebarOpen(event.matches);
    };

    syncSidebar(mediaQuery);
    mediaQuery.addEventListener('change', syncSidebar);

    return () => {
      mediaQuery.removeEventListener('change', syncSidebar);
    };
  }, [mounted]);

  useEffect(() => {
    if (isContentActive) {
      setContentOpen(true);
    }
  }, [isContentActive]);

  useEffect(() => {
    if (!mounted) return;
    
    setDebugInfo(`mounted: ${mounted}, isAuth: ${isAuthenticated}, user: ${JSON.stringify(user)}, token: ${accessToken ? 'exists' : 'null'}`);
    
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    // Check roles case-insensitively - backend uses uppercase (ADMIN, MANAGER)
    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'];
    const userRoles = (user?.roles || []).map((r: string) => r.toUpperCase());
    const hasAdminRole = adminRoles.some(r => userRoles.includes(r));
    
    if (!hasAdminRole) {
      router.push(`/${locale}`);
    }
  }, [isAuthenticated, user, locale, mounted, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-500 mb-2">{t('loading')}</p>
          <p className="text-xs text-gray-400 font-mono bg-gray-100 p-2 rounded">{debugInfo}</p>
        </div>
      </div>
    );
  }

  // Backend uses uppercase roles, frontend was checking for title case
  const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'];
  const userRoles = (user?.roles || []).map((r: string) => r.toUpperCase());
  const hasAdminRole = adminRoles.some(r => userRoles.includes(r));
  
  if (!hasAdminRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-gray-600 mb-2">{t('noPermission')}</p>
          <p className="text-xs text-gray-400 font-mono bg-gray-100 p-2 rounded mb-4">Roles: {JSON.stringify(userRoles)}</p>
          <a href={`/${locale}`} className="text-primary-600 hover:underline mt-2 inline-block">{locale === 'vi' ? 'Quay về trang chủ' : 'Back to Home'}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">GL</span>
              </div>
              <span className="hidden sm:inline font-bold text-lg">{t('admin')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href={`/${locale}`}
              target="_blank"
              className="hidden sm:inline text-sm text-gray-500 hover:text-primary-600"
            >
              {locale === 'vi' ? 'Xem website' : 'View Website'}
            </Link>
            <div className="text-sm text-right">
              <span className="font-medium block">{user.name}</span>
              <span className="hidden md:inline text-gray-500">{user.roles?.join(', ')}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 top-[60px] bg-black/30 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`bg-white shadow-sm transition-all duration-300 fixed left-0 top-[60px] h-[calc(100vh-60px)] z-50 transform lg:static lg:top-0 lg:h-auto lg:transform-none lg:z-auto ${
            sidebarOpen
              ? 'w-64 translate-x-0 lg:w-64'
              : 'w-64 -translate-x-full lg:w-0'
          } lg:overflow-hidden`}
        >
          <nav className="p-4 space-y-1">
            <Link
              href={`/${locale}/admin`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeMenu === 'dashboard'
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              {t('dashboard')}
            </Link>

            <button
              onClick={() => setContentOpen(!contentOpen)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                isContentActive ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                {locale === 'vi' ? 'Quản lí nội dung' : 'Content Management'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${contentOpen ? 'rotate-180' : ''}`} />
            </button>

            {contentOpen && (
              <div className="ml-4 space-y-1">
                {contentMenuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/admin${item.href}`}
                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                      pathname === `/${locale}/admin${item.href}`
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}/admin${item.href}`}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === item.id
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
