'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS_SECTOR_DETAILS as businessSectors } from '@/data/business-sectors';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const COLORS = [
  '#1b86c8', '#e82429', '#28a745', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c',
  '#6610f2', '#17a2b8', '#28a745', '#007bff', '#6c757d', '#343a40', '#dc3545', '#ffc107',
];

export default function BusinessSectorPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [sectors, setSectors] = useState(() =>
    businessSectors.map((sector, index) => ({
      id: sector.id,
      number: sector.number || String(index + 1).padStart(2, '0'),
      title: sector.title,
      subtitle: sector.subTitle,
      description: locale === 'vi' ? sector.description.vi : sector.description.en,
      image: sector.image,
      href: sector.href,
      color: sector.color || COLORS[index % COLORS.length],
    }))
  );

  useEffect(() => {
    let cancelled = false;
    api
      .getBusinessSectors(locale)
      .then((list) => {
        if (cancelled || !Array.isArray(list) || list.length === 0) return;
        setSectors(
          list.map((s) => ({
            id: s.slug,
            number: String(s.sortOrder).padStart(2, '0'),
            title: s.title,
            subtitle: s.subtitle || '',
            description: s.description || '',
            image: s.imagePath,
            href: `/business-sector/${s.slug}`,
            color: COLORS[(s.sortOrder - 1) % COLORS.length],
          }))
        );
      })
      .catch(() => {
        // keep fallback
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-ct-blue to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === 'vi' ? 'LĨNH VỰC KINH DOANH' : 'BUSINESS SECTORS'}
            </h1>
            <p className="text-xl opacity-90">
              {locale === 'vi'
                ? '20 lĩnh vực kinh doanh đa dạng từ công nghệ cao đến phát triển bền vững'
                : '20 diverse business sectors from high technology to sustainable development'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Sectors List */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {sectors.map((sector) => (
              <div
                key={sector.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="grid md:grid-cols-3">
                  <div className="relative h-48 md:h-auto">
                    <Image
                      src={sector.image}
                      alt={sector.title}
                      fill
                      className="object-cover"
                    />
                    <div
                      className="absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: sector.color }}
                    >
                      {sector.number}
                    </div>
                  </div>
                  <div className="md:col-span-2 p-6">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: sector.color }}>
                      {sector.title}
                    </h3>
                    <p className="text-gray-500 mb-4">{sector.subtitle}</p>
                    <p className="text-gray-600 mb-4">
                      {sector.description}
                    </p>
                    <Link
                      href={`/${locale}${sector.href}`}
                      className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
                      style={{ color: sector.color }}
                    >
                      {locale === 'vi' ? 'Tìm hiểu thêm' : 'Learn More'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ct-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {locale === 'vi' ? 'Liên hệ với chúng tôi' : 'Contact Us'}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {locale === 'vi'
              ? 'Để biết thêm thông tin về các lĩnh vực kinh doanh của CT GROUP'
              : 'For more information about CT GROUP business sectors'
            }
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-ct-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            {locale === 'vi' ? 'Liên hệ ngay' : 'Contact Now'}
          </Link>
        </div>
      </section>
    </div>
  );
}
