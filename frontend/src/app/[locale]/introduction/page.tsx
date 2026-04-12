'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function IntroductionPage() {
  const params = useParams();
  const locale = params.locale as string;

  const highlights = [
    { number: '15+', label: locale === 'vi' ? 'Lĩnh vực kinh doanh' : 'Business Sectors' },
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
              <span className="text-white">CT GROUP</span>{' '}
              <span className="text-white/90">VIETNAM</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              {locale === 'vi'
                ? 'Đổi mới công nghệ - Kiến tạo tương lai'
                : 'Technology Innovation - Building The Future'
              }
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {locale === 'vi' ? 'Giới thiệu về CT GROUP' : 'About CT GROUP'}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                {locale === 'vi'
                  ? 'CT GROUP VIETNAM là tập đoàn công nghệ hàng đầu Việt Nam, được thành lập với tầm nhìn trở thành một trong những công ty công nghệ tiên phong trong việc nghiên cứu và phát triển các giải pháp công nghệ tiên tiến.'
                  : 'CT GROUP VIETNAM is a leading technology corporation in Vietnam, established with the vision of becoming one of the pioneering technology companies in research and development of advanced technological solutions.'
                }
              </p>
              <p className="mb-4">
                {locale === 'vi'
                  ? 'Với hơn 20 năm kinh nghiệm, CT GROUP đã và đang phát triển 15 lĩnh vực kinh doanh đa dạng, từ công nghệ hàng không, trí tuệ nhân tạo, đến năng lượng xanh và hạ tầng thông minh.'
                  : 'With over 20 years of experience, CT GROUP has been developing 15 diverse business sectors, from aviation technology, artificial intelligence, to green energy and smart infrastructure.'
                }
              </p>
              <p>
                {locale === 'vi'
                  ? 'Chúng tôi cam kết mang đến những giải pháp công nghệ tốt nhất, góp phần xây dựng một tương lai bền vững cho cộng đồng và xã hội.'
                  : 'We are committed to providing the best technology solutions, contributing to building a sustainable future for the community and society.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {highlights.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-ct-blue mb-2">{item.number}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'vi' ? 'Tầm nhìn' : 'Vision'}
              </h3>
              <p className="text-gray-600">
                {locale === 'vi'
                  ? 'Trở thành tập đoàn công nghệ hàng đầu khu vực, tiên phong trong việc nghiên cứu và ứng dụng các công nghệ tiên tiến nhất.'
                  : 'Become a leading technology corporation in the region, pioneering in research and application of the most advanced technologies.'
                }
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'vi' ? 'Sứ mệnh' : 'Mission'}
              </h3>
              <p className="text-gray-600">
                {locale === 'vi'
                  ? 'Nghiên cứu, phát triển và cung cấp các giải pháp công nghệ tiên tiến, góp phần nâng cao chất lượng cuộc sống và phát triển bền vững.'
                  : 'Research, develop and provide advanced technological solutions, contributing to improving quality of life and sustainable development.'
                }
              </p>
            </div>
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
              ? 'Tìm hiểu về 15 lĩnh vực kinh doanh đa dạng của CT GROUP'
              : 'Learn about CT GROUP 15 diverse business sectors'
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
