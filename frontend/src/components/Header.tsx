'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Menu, X, User, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useParams, useRouter } from 'next/navigation';
import { locales } from '@/i18n/config';

export default function Header() {
  const t = useTranslations('nav');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated, user, logout } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push(`/${locale}`);
  };

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const isAdmin = user?.roles?.some(r => ['Super Admin', 'Admin', 'Manager'].includes(r));

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">GL</span>
            </div>
            <span className="font-heading font-bold text-xl text-primary-600">
              GreenLife
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <select
                value={locale}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-transparent border border-gray-200 rounded-md px-2 py-1 text-sm pr-6 cursor-pointer hover:border-primary-300"
              >
                {locales.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {mounted && isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 animate-slide-in border border-gray-100">
                    <Link
                      href={`/${locale}/account`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('account')}
                    </Link>
                    {isAdmin && (
                      <Link
                        href={`/${locale}/admin`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t('admin')}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : mounted && (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href={`/${locale}/login`}
                  className="px-4 py-2 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-600 hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  href={`/${locale}/login`}
                  className="block px-4 py-2 border-2 border-primary-500 text-primary-600 text-center rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="block px-4 py-2 bg-primary-500 text-white text-center rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
