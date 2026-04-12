'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const COLORS = [
  '#1b86c8', '#e82429', '#28a745', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c',
  '#6610f2', '#17a2b8', '#28a745', '#007bff', '#6c757d', '#343a40', '#dc3545', '#ffc107',
];

/** Fallback nếu API chưa chạy hoặc lỗi mạng */
const STATIC_SECTORS = [
  { id: 'smart-city', number: '01', title: 'Smart City', subTitle: 'city', image: '/images/ctgroup/KV_Nganh-1.png', href: '/business-sector/smart-city', color: '#1b86c8' },
  { id: 'infrastructure', number: '02', title: 'Infrastructure', subTitle: 'Transportation', image: '/images/ctgroup/KV_Nganh-2.png', href: '/business-sector/infrastructure', color: '#e82429' },
  { id: 'clean-food', number: '03', title: 'Clean Food', subTitle: '& Healthcare', image: '/images/ctgroup/KV_Nganh-3.png', href: '/business-sector/clean-food', color: '#28a745' },
  { id: 'uav', number: '04', title: 'Unmanned Aerial', subTitle: 'Vehicles', image: '/images/ctgroup/KV_Nganh-4.png', href: '/business-sector/uav', color: '#6f42c1' },
  { id: 'lae', number: '05', title: 'Low Altitude', subTitle: 'Economy - LAE', image: '/images/ctgroup/KV_Nganh-5.png', href: '/low-altitude-economy', color: '#fd7e14' },
  { id: 'digital-twin', number: '06', title: '15-Layer', subTitle: 'National Digital Twin', image: '/images/ctgroup/KV_Nganh-6.png', href: '/business-sector/digital-twin', color: '#20c997' },
  { id: 'robotic', number: '07', title: 'Robotic', subTitle: 'House', image: '/images/ctgroup/KV_Nganh-7.png', href: '/business-sector/robotic', color: '#e83e8c' },
  { id: 'biotechnology', number: '08', title: 'Bio', subTitle: 'technology', image: '/images/ctgroup/KV_Nganh-8-TA.png', href: '/business-sector/biotechnology', color: '#6610f2' },
  { id: 'innovation-hub', number: '09', title: 'CT Innovation', subTitle: 'Hub 4.0', image: '/images/ctgroup/KV_Nganh-9.png', href: '/business-sector/innovation-hub', color: '#17a2b8' },
  { id: 'carbon-credits', number: '10', title: 'Carbon', subTitle: 'Credits', image: '/images/ctgroup/KV_Nganh-10.png', href: '/carbon-credits', color: '#28a745' },
  { id: 'semiconductor', number: '11', title: 'Semi', subTitle: 'conductor', image: '/images/ctgroup/KV_Nganh-11.png', href: '/business-sector/semiconductor', color: '#007bff' },
  { id: 'space-tech', number: '12', title: 'Space', subTitle: 'Technology', image: '/images/ctgroup/KV_Nganh-12.png', href: '/business-sector/space', color: '#6c757d' },
  { id: 'autonomous', number: '13', title: 'Autonomous', subTitle: 'Vehicle', image: '/images/ctgroup/KV_Nganh-1.png', href: '/business-sector/autonomous', color: '#343a40' },
  { id: 'ai', number: '14', title: 'Artificial', subTitle: 'Intelligence', image: '/images/ctgroup/KV_Nganh-2.png', href: '/business-sector/ai', color: '#dc3545' },
  { id: 'crypto', number: '15', title: 'Green', subTitle: 'Cryptocurrency', image: '/images/ctgroup/KV_Nganh-3.png', href: '/business-sector/crypto', color: '#ffc107' },
];

type SectorRow = {
  id: string;
  number: string;
  title: string;
  subTitle: string;
  image: string;
  href: string;
  color: string;
};

export default function BusinessSectors() {
  const params = useParams();
  const locale = params.locale as string;
  const [sectors, setSectors] = useState<SectorRow[]>(STATIC_SECTORS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api.getBusinessSectors(locale);
        if (!list?.length || cancelled) return;
        const mapped: SectorRow[] = list.map((s, i) => ({
          id: s.slug,
          number: String(s.sortOrder).padStart(2, '0'),
          title: s.title,
          subTitle: s.subtitle || '',
          image: s.imagePath,
          href: s.detailHref.startsWith('/') ? s.detailHref : `/${s.detailHref}`,
          color: COLORS[(s.sortOrder - 1) % COLORS.length],
        }));
        setSectors(mapped);
      } catch {
        /* giữ STATIC_SECTORS */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const count = sectors.length;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-ct-blue font-bold text-5xl">CT</span>
            <span className="text-ct-red font-bold text-5xl">GROUP</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {locale === 'vi' ? 'LĨNH VỰC KINH DOANH' : 'BUSINESS SECTOR'}
          </h2>
          <p className="text-gray-600">
            {locale === 'vi' ? `${count} lĩnh vực kinh doanh đa dạng` : `${count} diverse business sectors`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {sectors.map((sector) => (
            <Link
              key={sector.id}
              href={`/${locale}${sector.href.startsWith('/') ? sector.href : `/${sector.href}`}`}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={sector.image}
                  alt={sector.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div
                  className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: sector.color }}
                >
                  {sector.number}
                </div>
              </div>

              <div className="p-4 text-center">
                <h3
                  className="font-bold text-lg mb-1 group-hover:text-white transition-colors line-clamp-2"
                  style={{ color: sector.color }}
                >
                  {sector.title}
                </h3>
                <p className="text-gray-500 text-sm group-hover:text-white/80 transition-colors line-clamp-2">
                  {sector.subTitle}
                </p>
              </div>

              <div
                className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-current transition-colors pointer-events-none"
                style={{ borderColor: 'transparent' }}
              />
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-lg">
            <span className="text-4xl font-bold text-ct-blue">{count}</span>
            <div className="text-left">
              <span className="block text-gray-600 text-sm">
                {locale === 'vi' ? 'TỔNG CỘNG' : 'TOTAL'}
              </span>
              <span className="block text-gray-500 text-xs">
                {locale === 'vi' ? 'LĨNH VỰC' : 'SECTORS'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
