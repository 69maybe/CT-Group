'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Menu, X, User, Globe } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { resolveCompanyRuntime, useSiteSettingsStore } from '@/store/siteSettingsStore';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const navLinks = [
    { href: `/${locale}`, label: locale === 'vi' ? 'Trang chủ' : 'Home' },
    { href: `/${locale}/introduction`, label: locale === 'vi' ? 'Giới thiệu' : 'Introduction' },
    { href: `/${locale}/business-sector`, label: locale === 'vi' ? 'Lĩnh vực' : 'Business Sector' },
    { href: `/${locale}/news`, label: locale === 'vi' ? 'Tin tức' : 'News' },
    { href: `/${locale}/contact`, label: locale === 'vi' ? 'Liên hệ' : 'Contact' },
  ];

  const settings = useSiteSettingsStore((s) => s.settings);
  const { company, socialLinks: socials } = resolveCompanyRuntime(settings);

  const socialLinks = socials.map((s) => ({
    href: s.href,
    icon: s.icon,
    label: s.label,
  }));

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setLangMenuOpen(false);
  };

  return (
    <header className="relative bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-ct-dark text-white py-2">
        <div className="container mx-auto px-4 flex justify-end items-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.icon}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label={social.label}
            >
              {social.icon === 'website' ? (
                <Globe className="w-6 h-6" />
              ) : (
                <Image
                  src={`/images/ctgroup/${social.icon.replace(/\.png$/i, '')}.png`}
                  alt={social.label}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              )}
            </a>
          ))}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-1 hover:bg-white/10 rounded transition-colors"
            >
              <span className="text-sm font-medium">
                {locale === 'vi' ? 'VI' : 'EN'}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => handleLanguageChange('vi')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${locale === 'vi' ? 'text-ct-blue font-medium' : 'text-gray-700'}`}
                >
                  Tiếng Việt
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${locale === 'en' ? 'text-ct-blue font-medium' : 'text-gray-700'}`}
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src={company.logoPath}
              alt={company.name}
              width={120}
              height={60}
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-ct-blue font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-ct-blue transition-all group-hover:w-full"></span>
              </Link>
            ))}
            {isAuthenticated && user ? (
              <Link
                href={`/${locale}/account`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors max-w-[220px]"
                title={locale === 'vi' ? 'Mở hồ sơ tài khoản' : 'Open profile'}
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate font-medium">{user.name}</span>
              </Link>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {locale === 'vi' ? 'Đăng nhập' : 'Login'}
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t animate-slide-in">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-ct-blue font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user ? (
              <Link
                href={`/${locale}/account`}
                className="flex items-center gap-2 py-2 text-primary-700 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                {user.name}
              </Link>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="block py-2 text-gray-700 hover:text-ct-blue font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {locale === 'vi' ? 'Đăng nhập' : 'Login'}
              </Link>
            )}
            <div className="flex gap-4 pt-4 border-t">
              <button
                onClick={() => handleLanguageChange('vi')}
                className={`px-3 py-1 rounded ${locale === 'vi' ? 'bg-ct-blue text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                VI
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded ${locale === 'en' ? 'bg-ct-blue text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
