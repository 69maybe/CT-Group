'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSiteSettingsStore } from '@/store/siteSettingsStore';
import { COMPANY } from '@/config/company';

export default function IntroductionPage() {
  const params = useParams();
  const locale = params.locale as string;
  const settings = useSiteSettingsStore((s) => s.settings);

  const introTitle = settings?.introTitle?.trim() || COMPANY.name;
  const introSlogan =
    locale === 'vi'
      ? settings?.introSloganVi?.trim() || 'Đổi mới công nghệ - Kiến tạo tương lai'
      : settings?.introSloganEn?.trim() || 'Technology Innovation - Building The Future';
  const introDescription1 =
    locale === 'vi'
      ? settings?.introDescriptionVi?.trim() ||
        'SYSMAC SJC là doanh nghiệp công nghệ tại Việt Nam, chuyên nghiên cứu và phát triển các giải pháp công nghệ tiên tiến.'
      : settings?.introDescriptionEn?.trim() ||
        'SYSMAC SJC is a technology company in Vietnam, specializing in research and development of advanced technology solutions.';

  const introContentHtml =
    locale === 'vi'
      ? settings?.introContentVi?.trim() || ''
      : settings?.introContentEn?.trim() || '';

  const highlights = [
    { number: '20+', label: locale === 'vi' ? 'Lĩnh vực kinh doanh' : 'Business Sectors' },
    { number: '20+', label: locale === 'vi' ? 'Năm kinh nghiệm' : 'Years Experience' },
    { number: '100+', label: locale === 'vi' ? 'Dự án hoàn thành' : 'Projects Completed' },
    { number: '500+', label: locale === 'vi' ? 'Khách hàng' : 'Customers' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-ct-blue to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">{introTitle}</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              {introSlogan}
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {locale === 'vi' ? `Giới thiệu về ${introTitle}` : `About ${introTitle}`}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              {introContentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: introContentHtml }} />
              ) : (
                <>
                  <p className="mb-4">{introDescription1}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {highlights.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-ct-blue mb-2">{item.number}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-16 bg-ct-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {locale === 'vi' ? 'Khám phá các lĩnh vực kinh doanh' : 'Explore Our Business Sectors'}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {locale === 'vi'
                ? `Tìm hiểu về các lĩnh vực kinh doanh đa dạng của ${introTitle}`
                : `Learn about ${introTitle}'s diverse business sectors`
            }
          </p>
          <Link
            href={`/${locale}/business-sector`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-ct-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            {locale === 'vi' ? 'Xem ngay' : 'View Now'}
          </Link>
        </div>
      </section>
    </div>
  );
}
