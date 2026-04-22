'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import { resolveCompanyRuntime, useSiteSettingsStore } from '@/store/siteSettingsStore';

export default function Footer() {
  const t = useTranslations('footer');
  const params = useParams();
  const locale = params.locale as string;

  const settings = useSiteSettingsStore((s) => s.settings);
  const { company, socialLinks: socials } = resolveCompanyRuntime(settings);

  const socialLinks = socials;

  const businessLinks = {
    highTech: [
      { label: locale === 'vi' ? 'Máy bay không người lái' : 'Unmanned Aerial Vehicles', href: `/${locale}/business-sector/uav` },
      { label: locale === 'vi' ? 'Drone (UAV)' : 'Drone (UAV)', href: `/${locale}/business-sector/drone-uav` },
      { label: locale === 'vi' ? 'IoT' : 'IoT', href: `/${locale}/business-sector/iot` },
      { label: locale === 'vi' ? 'Chatbot AI' : 'Chatbot AI', href: `/${locale}/business-sector/chatbot-ai` },
      { label: locale === 'vi' ? 'Controller CNC' : 'CNC Controller', href: `/${locale}/business-sector/cnc-controller` },
      { label: locale === 'vi' ? 'Robot công nghiệp' : 'Industrial Robot', href: `/${locale}/business-sector/industrial-robot` },
      { label: locale === 'vi' ? 'Kinh tế hàng không thấp' : 'Low Altitude Economy', href: `/${locale}/low-altitude-economy` },
      { label: locale === 'vi' ? 'Mô hình số 15 tầng' : '15-Layer Digital Twin', href: `/${locale}/business-sector/digital-twin` },
      { label: locale === 'vi' ? 'Nhà Robot' : 'Robotic House', href: `/${locale}/business-sector/robotic` },
      { label: locale === 'vi' ? 'Công nghệ sinh học' : 'Biotechnology', href: `/${locale}/business-sector/biotechnology` },
      { label: locale === 'vi' ? 'CT Innovation Hub 4.0' : 'CT Innovation Hub 4.0', href: `/${locale}/business-sector/innovation-hub` },
      { label: locale === 'vi' ? 'Tín chỉ Carbon' : 'Carbon Credits', href: `/${locale}/carbon-credits` },
      { label: locale === 'vi' ? 'Chip bán dẫn' : 'Semiconductor Chip', href: `/${locale}/business-sector/semiconductor` },
      { label: locale === 'vi' ? 'Công nghệ không gian' : 'Space Technology', href: `/${locale}/business-sector/space` },
    ],
    sustainable: [
      { label: locale === 'vi' ? 'Thành phố thông minh' : 'Smart City', href: `/${locale}/business-sector/smart-city` },
      { label: locale === 'vi' ? 'Hạ tầng giao thông' : 'Transportation Infrastructure', href: `/${locale}/business-sector/infrastructure` },
      { label: locale === 'vi' ? 'Thực phẩm sạch & Y tế' : 'Clean Food & Healthcare', href: `/${locale}/business-sector/clean-food` },
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Social */}
          <div className="space-y-6">
            <Image
              src={company.logoPath}
              alt={company.name}
              width={150}
              height={75}
              className="h-16 w-auto"
            />
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  title={social.label}
                >
                  {social.icon === 'website' ? (
                    <Globe className="w-7 h-7" />
                  ) : (
                    <Image
                      src={`/images/ctgroup/${social.icon.replace(/\.(png|webp)$/i, '')}.webp`}
                      alt={social.label}
                      width={28}
                      height={28}
                      className="w-7 h-7"
                    />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Business - High Tech */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('business')}</h3>
            <h4 className="text-gray-400 text-sm mb-3">{t('highTech')}</h4>
            <ul className="space-y-2 text-sm">
              {businessLinks.highTech.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business - Sustainable */}
          <div>
            <h4 className="text-white font-semibold mb-4">&nbsp;</h4>
            <h4 className="text-gray-400 text-sm mb-3">{t('sustainable')}</h4>
            <ul className="space-y-2 text-sm">
              {businessLinks.sustainable.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-ct-blue flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
                </svg>
                <div className="text-gray-400">
                  <a href={company.phoneHref} className="hover:text-white transition-colors">
                    {company.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-ct-blue flex-shrink-0" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M160 448c-25.6 0-51.2-22.4-64-32-64-44.8-83.2-60.8-96-70.4V480c0 17.67 14.33 32 32 32h256c17.67 0 32-14.33 32-32V345.6c-12.8 9.6-32 25.6-96 70.4-12.8 9.6-38.4 32-64 32z"/>
                </svg>
                <a href={company.emailHref} className="text-gray-400 hover:text-white transition-colors">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-ct-blue flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 384 512">
                  <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
                </svg>
                <span className="text-gray-400 text-sm">
                  {locale === 'vi' ? company.addressVi : company.addressEn}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">{t('copyright')}</p>
            <Link href={`/${locale}/privacy`} className="text-gray-500 text-sm hover:text-white transition-colors">
              {t('privacy')}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-ct-blue text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-50"
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}
