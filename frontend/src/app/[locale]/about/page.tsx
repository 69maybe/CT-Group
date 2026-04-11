'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const tHome = useTranslations('home');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 font-heading mb-6">
                {locale === 'vi' ? 'Câu chuyện của chúng tôi' : 'Our Story'}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {t('mission')}
                </p>
                <p>
                  {t('whyChooseUs')}
                </p>
                <p>
                  {locale === 'vi'
                    ? 'Tất cả nguyên liệu của chúng tôi được chọn lọc kỹ càng từ các nguồn uy tín, đảm bảo tươi ngon và an toàn cho sức khỏe.'
                    : 'All our ingredients are carefully selected from reputable sources, ensuring freshness and safety for your health.'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-100 rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
                <p className="text-gray-600">{locale === 'vi' ? 'Nguyên liệu tươi' : 'Fresh Ingredients'}</p>
              </div>
              <div className="bg-orange-100 rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">5000+</div>
                <p className="text-gray-600">{t('customers')}</p>
              </div>
              <div className="bg-green-100 rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">30 {locale === 'vi' ? 'phút' : 'min'}</div>
                <p className="text-gray-600">{t('delivery')}</p>
              </div>
              <div className="bg-purple-100 rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                <p className="text-gray-600">{locale === 'vi' ? 'Món ăn' : 'Dishes'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 font-heading text-center mb-12">
            {locale === 'vi' ? 'Giá trị cốt lõi' : 'Our Core Values'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{locale === 'vi' ? 'Tươi & Sạch' : 'Fresh & Clean'}</h3>
              <p className="text-gray-600">
                {locale === 'vi' ? '100% nguyên liệu tươi, organic, được chọn lọc kỹ càng mỗi ngày.' : '100% fresh, organic ingredients, carefully selected every day.'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍳</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{locale === 'vi' ? 'Chất lượng' : 'Quality'}</h3>
              <p className="text-gray-600">
                {locale === 'vi' ? 'Đầu bếp chuyên nghiệp, công thức độc đáo, đảm bảo hương vị tuyệt vời.' : 'Professional chefs, unique recipes, ensuring excellent taste.'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{locale === 'vi' ? 'Tiện lợi' : 'Convenience'}</h3>
              <p className="text-gray-600">
                {t('deliveryDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary-500 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold font-heading mb-4">
              {locale === 'vi' ? 'Liên hệ với chúng tôi' : 'Contact Us'}
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              {t('contactCta')}
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>0901 234 567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>contact@greenlifefood.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{locale === 'vi' ? '123 Đường ABC, Quận 1, TP.HCM' : '123 ABC Street, District 1, HCMC'}</span>
              </div>
            </div>
            <Link
              href={`/${locale}/contact`}
              className="inline-block px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              {locale === 'vi' ? 'Liên hệ ngay' : 'Contact Now'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
