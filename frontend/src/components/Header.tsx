'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const navLinks = [
    { href: `/${locale}`, label: locale === 'vi' ? 'Trang chủ' : 'Home' },
    { href: `/${locale}/introduction`, label: locale === 'vi' ? 'Giới thiệu' : 'Introduction' },
    { href: `/${locale}/business-sector`, label: locale === 'vi' ? 'Lĩnh vực' : 'Business Sector' },
    { href: `/${locale}/news`, label: locale === 'vi' ? 'Tin tức' : 'News' },
    { href: `/${locale}/contact`, label: locale === 'vi' ? 'Liên hệ' : 'Contact' },
  ];

  const socialLinks = [
    { href: 'https://www.facebook.com/CTgroupVN', icon: 'facebook', label: 'Facebook' },
    { href: 'https://zalo.me/1371516702089438441', icon: 'zalo', label: 'Zalo' },
  ];

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
              <Image
                src={`/images/ctgroup/${social.icon}.png`}
                alt={social.label}
                width={24}
                height={24}
                className="w-6 h-6"
              />
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
              src="/images/ctgroup/logo.png"
              alt="CT GROUP VIETNAM"
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
