'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { ctgroupOfficeOsmEmbedSrc } from '@/lib/ctgroupOfficeMap';

export default function ContactPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject || undefined,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {locale === 'vi' ? 'Gửi thành công!' : 'Sent Successfully!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'vi'
              ? 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
              : 'Thank you for contacting us. We will respond as soon as possible.'
            }
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-ct-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {locale === 'vi' ? 'Gửi tin nhắn khác' : 'Send Another Message'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-ct-blue to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === 'vi' ? 'LIÊN HỆ' : 'CONTACT'}
            </h1>
            <p className="text-xl opacity-90">
              {locale === 'vi'
                ? 'Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn'
                : 'We are always ready to listen and support you'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {locale === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ct-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-ct-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {locale === 'vi' ? 'Điện thoại' : 'Phone'}
                    </h3>
                    <p className="text-gray-600">
                      (+84) 911 807 668<br />
                      (+84) 911 807 667<br />
                      (+84 28) 6297 1999
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ct-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-ct-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@ctgroupvietnam.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ct-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-ct-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {locale === 'vi' ? 'Địa chỉ' : 'Address'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'vi'
                        ? 'Tòa nhà Léman, 20 Trương Định, Quận 3, TP. Hồ Chí Minh'
                        : 'Léman Building, 20 Truong Dinh St., District 3, Ho Chi Minh City'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ct-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-ct-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {locale === 'vi' ? 'Giờ làm việc' : 'Working Hours'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'vi'
                        ? 'Thứ 2 - Thứ 6: 8:00 - 17:30'
                        : 'Monday - Friday: 8:00 AM - 5:30 PM'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {locale === 'vi' ? 'Kết nối với chúng tôi' : 'Connect with us'}
                </h3>
                <div className="flex gap-3">
                  {[
                    { icon: 'facebook.png', href: 'https://www.facebook.com/CTgroupVN', label: 'Facebook' },
                    { icon: 'linkedin.png', href: 'https://www.linkedin.com/company/tập-đoàn-c.t-group/', label: 'LinkedIn' },
                    { icon: 'youtube.png', href: 'https://www.youtube.com/channel/UC-iFhtlJaIhlyp_GGFvpRMg', label: 'YouTube' },
                    { icon: 'zalo.png', href: 'https://zalo.me/1371516702089438441', label: 'Zalo' },
                  ].map((social) => (
                    <a
                      key={social.icon}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                      title={social.label}
                    >
                      <Image
                        src={`/images/ctgroup/${social.icon}`}
                        alt={social.label}
                        width={24}
                        height={24}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {locale === 'vi' ? 'Gửi tin nhắn' : 'Send a Message'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'vi' ? 'Họ và tên' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ct-blue focus:border-transparent transition-colors"
                    placeholder={locale === 'vi' ? 'Nhập họ và tên' : 'Enter your name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ct-blue focus:border-transparent transition-colors"
                    placeholder={locale === 'vi' ? 'Nhập email' : 'Enter your email'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ct-blue focus:border-transparent transition-colors"
                    placeholder={locale === 'vi' ? 'Nhập số điện thoại' : 'Enter your phone number'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'vi' ? 'Chủ đề' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ct-blue focus:border-transparent transition-colors"
                    placeholder={locale === 'vi' ? 'Nhập chủ đề' : 'Enter subject'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'vi' ? 'Nội dung' : 'Message'} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ct-blue focus:border-transparent transition-colors resize-none"
                    placeholder={locale === 'vi' ? 'Nhập nội dung tin nhắn' : 'Enter your message'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-ct-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {locale === 'vi' ? 'Đang gửi...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {locale === 'vi' ? 'Gửi tin nhắn' : 'Send Message'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map — OpenStreetMap (tránh Google embed?pb= bị Invalid pb) */}
      <section className="h-96 bg-gray-200">
        <iframe
          src={ctgroupOfficeOsmEmbedSrc()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="CT GROUP Vietnam — Léman, 20 Truong Dinh, District 3, HCMC"
        />
      </section>
    </div>
  );
}
