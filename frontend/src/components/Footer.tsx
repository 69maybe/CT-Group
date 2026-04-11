'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">GL</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">GreenLife Food</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {t('tagline')}
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{locale === 'vi' ? 'Liên kết nhanh' : 'Quick Links'}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/products`} className="hover:text-primary-400">{tNav('products')}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-primary-400">{tNav('about')}</Link></li>
              <li><Link href={`/${locale}/news`} className="hover:text-primary-400">{tNav('news')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-primary-400">{tNav('contact')}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">{tNav('categories')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/products?category=salad`} className="hover:text-primary-400">Salad</Link></li>
              <li><Link href={`/${locale}/products?category=nuoc-ep`} className="hover:text-primary-400">{locale === 'vi' ? 'Nước ép' : 'Juice'}</Link></li>
              <li><Link href={`/${locale}/products?category=com-eat-clean`} className="hover:text-primary-400">{locale === 'vi' ? 'Cơm Eat-Clean' : 'Eat-Clean Rice'}</Link></li>
              <li><Link href={`/${locale}/products?category=bowl`} className="hover:text-primary-400">Bowl</Link></li>
              <li><Link href={`/${locale}/products?category=smoothie`} className="hover:text-primary-400">Smoothie</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>{locale === 'vi' ? 'Số 12 ngõ 120 Yên Lãng, Phường Thịnh Quang, Quận Đống Đa, Hà Nội, Việt Nam' : '120/12 Yen Lang Street, Phường Thịnh Quang, Quận Đống Đa, Hanoi, Vietnam'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>0987654321</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>contact@greenlifefood.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-400" />
                <span>{locale === 'vi' ? '7:00 - 21:00 (Thứ 2 - CN)' : '7:00 AM - 9:00 PM (Mon - Sun)'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-500 text-center">
          <p>{t('copyright')}</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href={`/${locale}/privacy`} className="hover:text-primary-400">{t('privacy')}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-primary-400">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
