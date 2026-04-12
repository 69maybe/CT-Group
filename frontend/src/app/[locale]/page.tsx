'use client';

import { useParams } from 'next/navigation';
import HeroSlider from '@/components/HeroSlider';
import BusinessSectors from '@/components/BusinessSectors';
import Link from 'next/link';

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Business Sectors */}
      <BusinessSectors />

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                <span className="text-ct-blue">CT</span>{' '}
                <span className="text-ct-red">GROUP</span>{' '}
                <span className="text-gray-800">VIETNAM</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {locale === 'vi' 
                  ? 'CT GROUP VIETNAM là tập đoàn công nghệ hàng đầu Việt Nam, chuyên nghiên cứu và phát triển các giải pháp công nghệ tiên tiến trong nhiều lĩnh vực khác nhau.'
                  : 'CT GROUP VIETNAM is a leading technology corporation in Vietnam, specializing in research and development of advanced technology solutions across various sectors.'
                }
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {locale === 'vi'
                  ? 'Với sứ mệnh kiến tạo tương lai công nghệ, chúng tôi không ngừng đổi mới và sáng tạo, mang đến những sản phẩm và dịch vụ chất lượng cao cho cộng đồng.'
                  : 'With the mission of building the future of technology, we continuously innovate and create, bringing high-quality products and services to the community.'
                }
              </p>
              <Link
                href={`/${locale}/introduction`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-ct-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {locale === 'vi' ? 'Tìm hiểu thêm' : 'Learn More'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-ct-blue mb-2">15+</div>
                <div className="text-gray-600 text-sm">
                  {locale === 'vi' ? 'Lĩnh vực kinh doanh' : 'Business Sectors'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-ct-red mb-2">20+</div>
                <div className="text-gray-600 text-sm">
                  {locale === 'vi' ? 'Năm kinh nghiệm' : 'Years Experience'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
                <div className="text-gray-600 text-sm">
                  {locale === 'vi' ? 'Dự án hoàn thành' : 'Projects Completed'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600 text-sm">
                  {locale === 'vi' ? 'Khách hàng' : 'Customers'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-ct-blue to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {locale === 'vi' ? 'Khám phá các lĩnh vực kinh doanh của CT GROUP' : 'Explore CT GROUP Business Sectors'}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {locale === 'vi'
              ? 'Từ công nghệ hàng không đến năng lượng xanh, khám phá các giải pháp sáng tạo của chúng tôi.'
              : 'From aviation technology to green energy, explore our innovative solutions.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/business-sector`}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-ct-blue rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              {locale === 'vi' ? 'Xem tất cả lĩnh vực' : 'View All Sectors'}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              {locale === 'vi' ? 'Liên hệ ngay' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Images Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            {locale === 'vi' ? 'Hình ảnh nổi bật' : 'Featured Images'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative h-48 rounded-xl overflow-hidden group">
              <img
                src="/images/ctgroup/CT-Land.jpg"
                alt="CT Land"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative h-48 rounded-xl overflow-hidden group">
              <img
                src="/images/ctgroup/Logiin.jpg"
                alt="Innovation"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative h-48 rounded-xl overflow-hidden group">
              <img
                src="/images/ctgroup/Bon-14.jpg"
                alt="Business"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative h-48 rounded-xl overflow-hidden group">
              <img
                src="/images/ctgroup/KD1.png"
                alt="Technology"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
