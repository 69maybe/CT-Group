'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { Globe } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { resolveCompanyRuntime, useSiteSettingsStore, type SiteSettings } from '@/store/siteSettingsStore';

type SocialLink = { href: string; icon: string; label: string };
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const ICON_CHOICES: Array<{ label: string; icon: string; aliases: string[] }> = [
  { label: 'Facebook', icon: 'facebook.png', aliases: ['facebook', 'fb'] },
  { label: 'Zalo', icon: 'zalo.png', aliases: ['zalo'] },
  { label: 'YouTube', icon: 'youtube.png', aliases: ['youtube', 'yt'] },
  { label: 'LinkedIn', icon: 'linkedin.png', aliases: ['linkedin'] },
  { label: 'Instagram', icon: 'instagram.png', aliases: ['instagram', 'ig'] },
  { label: 'TikTok', icon: 'tiktok.png', aliases: ['tiktok'] },
  { label: 'X/Twitter', icon: 'twitter.png', aliases: ['twitter', 'x'] },
  { label: 'Website', icon: 'website', aliases: ['website', 'web', 'site'] },
  { label: 'Email', icon: 'email.png', aliases: ['email', 'mail', 'gmail'] },
];

function guessIconFromLabel(label: string): string | null {
  const raw = (label || '').trim().toLowerCase();
  if (!raw) return null;
  for (const c of ICON_CHOICES) {
    if (c.aliases.some((a) => raw.includes(a))) return c.icon;
  }
  return null;
}

function normalizeLinks(links: any): SocialLink[] {
  if (!Array.isArray(links)) return [];
  return links
    .map((s) => ({
      href: typeof s?.href === 'string' ? s.href : '',
      icon: typeof s?.icon === 'string' ? s.icon : '',
      label: typeof s?.label === 'string' ? s.label : '',
    }));
}

function sanitizeLinksForSave(links: SocialLink[]): SocialLink[] {
  return links
    .map((s) => ({
      href: String(s.href ?? '').trim(),
      icon: String(s.icon ?? '').trim(),
      label: String(s.label ?? '').trim(),
    }))
    .filter((s) => s.href && s.icon);
}

export default function AdminSiteSettingsPage() {
  const { accessToken } = useAuthStore();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const tab = searchParams.get('tab') || 'home';

  const publicSettings = useSiteSettingsStore((s) => s.settings);
  const setPublicLocal = useSiteSettingsStore((s) => s.setLocal);

  const { company: fallbackCompany, socialLinks: fallbackSocials } = useMemo(
    () => resolveCompanyRuntime(publicSettings),
    [publicSettings]
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'logo' | 'bannerList' | 'featuredList' | null>(null);

  const [form, setForm] = useState<SiteSettings>({
    logoPath: null,
    bannerPath: null,
    bannerImages: null,
    featuredImages: null,
    phone: null,
    email: null,
    addressVi: null,
    addressEn: null,
    introTitle: null,
    introSloganVi: null,
    introSloganEn: null,
    introDescriptionVi: null,
    introDescriptionEn: null,
    introDescription2Vi: null,
    introDescription2En: null,
    introDescription3Vi: null,
    introDescription3En: null,
    introContentVi: null,
    introContentEn: null,
    socialLinks: null,
  });

  const [socialDraft, setSocialDraft] = useState<SocialLink[]>(() => normalizeLinks(fallbackSocials));

  const socialLinks = socialDraft;

  const [bannerDraft, setBannerDraft] = useState<string[]>([]);
  const [featuredDraft, setFeaturedDraft] = useState<string[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.getAdminSiteSettings(accessToken);
        setForm({
          logoPath: data.logoPath ?? null,
          bannerPath: data.bannerPath ?? null,
          bannerImages: Array.isArray((data as any).bannerImages) ? (data as any).bannerImages : null,
          featuredImages: Array.isArray((data as any).featuredImages) ? (data as any).featuredImages : null,
          phone: data.phone ?? null,
          email: data.email ?? null,
          addressVi: data.addressVi ?? null,
          addressEn: data.addressEn ?? null,
          introTitle: (data as any).introTitle ?? null,
          introSloganVi: (data as any).introSloganVi ?? null,
          introSloganEn: (data as any).introSloganEn ?? null,
          introDescriptionVi: (data as any).introDescriptionVi ?? null,
          introDescriptionEn: (data as any).introDescriptionEn ?? null,
          introDescription2Vi: (data as any).introDescription2Vi ?? null,
          introDescription2En: (data as any).introDescription2En ?? null,
          introDescription3Vi: (data as any).introDescription3Vi ?? null,
          introDescription3En: (data as any).introDescription3En ?? null,
          introContentVi: (data as any).introContentVi ?? null,
          introContentEn: (data as any).introContentEn ?? null,
          socialLinks: normalizeLinks(data.socialLinks),
        });
        setSocialDraft(normalizeLinks(data.socialLinks));
        const list = Array.isArray((data as any).bannerImages) ? (data as any).bannerImages : [];
        if (list.length) {
          setBannerDraft(list.map((x: any) => String(x || '').trim()).filter(Boolean));
        } else if (data.bannerPath) {
          setBannerDraft([String(data.bannerPath)]);
        } else {
          setBannerDraft([]);
        }

        const featuredList = Array.isArray((data as any).featuredImages) ? (data as any).featuredImages : [];
        if (featuredList.length) {
          setFeaturedDraft(featuredList.map((x: any) => String(x || '').trim()).filter(Boolean));
        } else {
          setFeaturedDraft([]);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [accessToken]);

  const companyPreview = useMemo(() => resolveCompanyRuntime(form), [form]);

  const pickFile = async (kind: 'logo', file: File) => {
    if (!accessToken) return;
    setUploading(kind);
    try {
      const up = await api.uploadAdminImage(accessToken, file);
      const path = (up as any)?.path || (up as any)?.url;
      if (!path) throw new Error('Upload returned empty path');
      setForm((prev) => ({
        ...prev,
        logoPath: kind === 'logo' ? String(path) : prev.logoPath,
      }));
      toast.success(locale === 'vi' ? 'Tải ảnh lên thành công' : 'Upload successful');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const pickBannerFile = async (index: number, file: File) => {
    if (!accessToken) return;
    setUploading('bannerList');
    try {
      const up = await api.uploadAdminImage(accessToken, file);
      const path = (up as any)?.path || (up as any)?.url;
      if (!path) throw new Error('Upload returned empty path');
      setBannerDraft((prev) => prev.map((p, i) => (i === index ? String(path) : p)));
      toast.success(locale === 'vi' ? 'Tải ảnh lên thành công' : 'Upload successful');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const pickFeaturedFile = async (index: number, file: File) => {
    if (!accessToken) return;
    setUploading('featuredList');
    try {
      const up = await api.uploadAdminImage(accessToken, file);
      const path = (up as any)?.path || (up as any)?.url;
      if (!path) throw new Error('Upload returned empty path');
      setFeaturedDraft((prev) => prev.map((p, i) => (i === index ? String(path) : p)));
      toast.success(locale === 'vi' ? 'Tải ảnh lên thành công' : 'Upload successful');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    if (!accessToken) return;
    setSaving(true);
    try {
      const socialLinks = sanitizeLinksForSave(socialDraft);
      const bannerImages = bannerDraft.map((x) => String(x || '').trim()).filter(Boolean);
      const featuredImages = featuredDraft.map((x) => String(x || '').trim()).filter(Boolean);
      const payload = {
        logoPath: form.logoPath ?? null,
        bannerPath: form.bannerPath ?? null,
        bannerImages,
        featuredImages,
        phone: form.phone ?? null,
        email: form.email ?? null,
        addressVi: form.addressVi ?? null,
        addressEn: form.addressEn ?? null,
        introTitle: form.introTitle ?? null,
        introSloganVi: form.introSloganVi ?? null,
        introSloganEn: form.introSloganEn ?? null,
        introDescriptionVi: form.introDescriptionVi ?? null,
        introDescriptionEn: form.introDescriptionEn ?? null,
        introDescription2Vi: form.introDescription2Vi ?? null,
        introDescription2En: form.introDescription2En ?? null,
        introDescription3Vi: form.introDescription3Vi ?? null,
        introDescription3En: form.introDescription3En ?? null,
        introContentVi: form.introContentVi ?? null,
        introContentEn: form.introContentEn ?? null,
        socialLinks,
      };
      const saved = await api.updateAdminSiteSettings(accessToken, payload);
      setForm({
        logoPath: saved.logoPath ?? payload.logoPath,
        bannerPath: saved.bannerPath ?? payload.bannerPath,
        bannerImages: Array.isArray((saved as any)?.bannerImages) ? (saved as any).bannerImages : payload.bannerImages,
        featuredImages: Array.isArray((saved as any)?.featuredImages) ? (saved as any).featuredImages : payload.featuredImages,
        phone: saved.phone ?? payload.phone,
        email: saved.email ?? payload.email,
        addressVi: saved.addressVi ?? payload.addressVi,
        addressEn: saved.addressEn ?? payload.addressEn,
        introTitle: (saved as any).introTitle ?? payload.introTitle,
        introSloganVi: (saved as any).introSloganVi ?? payload.introSloganVi,
        introSloganEn: (saved as any).introSloganEn ?? payload.introSloganEn,
        introDescriptionVi: (saved as any).introDescriptionVi ?? payload.introDescriptionVi,
        introDescriptionEn: (saved as any).introDescriptionEn ?? payload.introDescriptionEn,
        introDescription2Vi: (saved as any).introDescription2Vi ?? payload.introDescription2Vi,
        introDescription2En: (saved as any).introDescription2En ?? payload.introDescription2En,
        introDescription3Vi: (saved as any).introDescription3Vi ?? payload.introDescription3Vi,
        introDescription3En: (saved as any).introDescription3En ?? payload.introDescription3En,
        introContentVi: (saved as any).introContentVi ?? payload.introContentVi,
        introContentEn: (saved as any).introContentEn ?? payload.introContentEn,
        socialLinks: normalizeLinks(saved.socialLinks ?? payload.socialLinks),
      });
      setSocialDraft(normalizeLinks(saved.socialLinks ?? payload.socialLinks));
      setBannerDraft(Array.isArray((saved as any)?.bannerImages) ? (saved as any).bannerImages : payload.bannerImages);
      setFeaturedDraft(Array.isArray((saved as any)?.featuredImages) ? (saved as any).featuredImages : payload.featuredImages);

      // sync public store locally so Header/Footer update instantly on this tab
      setPublicLocal({
        logoPath: payload.logoPath,
        bannerPath: payload.bannerPath,
        bannerImages: payload.bannerImages,
        featuredImages: payload.featuredImages,
        phone: payload.phone,
        email: payload.email,
        addressVi: payload.addressVi,
        addressEn: payload.addressEn,
        introTitle: payload.introTitle,
        introSloganVi: payload.introSloganVi,
        introSloganEn: payload.introSloganEn,
        introDescriptionVi: payload.introDescriptionVi,
        introDescriptionEn: payload.introDescriptionEn,
        introDescription2Vi: payload.introDescription2Vi,
        introDescription2En: payload.introDescription2En,
        introDescription3Vi: payload.introDescription3Vi,
        introDescription3En: payload.introDescription3En,
        introContentVi: payload.introContentVi,
        introContentEn: payload.introContentEn,
        socialLinks: payload.socialLinks,
      });

      toast.success(locale === 'vi' ? 'Đã lưu cấu hình' : 'Saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addSocial = () => {
    setSocialDraft((prev) => [...prev, { href: '', icon: 'facebook.png', label: '' }]);
  };

  const updateSocial = (idx: number, patch: Partial<SocialLink>) => {
    setSocialDraft((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const removeSocial = (idx: number) => {
    setSocialDraft((prev) => prev.filter((_, i) => i !== idx));
  };

  const addBanner = () => {
    setBannerDraft((prev) => [...prev, '']);
  };

  const removeBanner = (idx: number) => {
    setBannerDraft((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveBannerUp = (idx: number) => {
    if (idx <= 0) return;
    setBannerDraft((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveBannerDown = (idx: number) => {
    setBannerDraft((prev) => {
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const addFeatured = () => {
    setFeaturedDraft((prev) => [...prev, '']);
  };

  const removeFeatured = (idx: number) => {
    setFeaturedDraft((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveFeaturedUp = (idx: number) => {
    if (idx <= 0) return;
    setFeaturedDraft((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveFeaturedDown = (idx: number) => {
    setFeaturedDraft((prev) => {
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-64" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {tab === 'home' && (locale === 'vi' ? 'Cấu hình Trang chủ' : 'Home Settings')}
          {tab === 'about' && (locale === 'vi' ? 'Cấu hình Giới thiệu' : 'About Settings')}
          {tab === 'contact' && (locale === 'vi' ? 'Cấu hình Liên hệ' : 'Contact Settings')}
        </h1>
        <p className="text-gray-500 mt-1">
          {tab === 'home' && (locale === 'vi' ? 'Cập nhật Logo và Banner.' : 'Update Logo and Banner.')}
          {tab === 'about' && (locale === 'vi' ? 'Cập nhật tiêu đề, nội dung phần Giới thiệu.' : 'Update title and content of About section.')}
          {tab === 'contact' && (locale === 'vi' ? 'Cập nhật email, hotline, địa chỉ, và mạng xã hội.' : 'Update email, hotline, address, and social links.')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          {tab === 'home' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900">{locale === 'vi' ? 'Logo' : 'Logo'}</h2>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-16 relative bg-gray-50 rounded-lg border overflow-hidden">
                    <Image
                      src={companyPreview.company.logoPath || fallbackCompany.logoPath}
                      alt="logo"
                      fill
                      className="object-contain p-2"
                      sizes="112px"
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) pickFile('logo', f);
                        e.currentTarget.value = '';
                      }}
                      disabled={uploading !== null}
                    />
                    {uploading === 'logo'
                      ? locale === 'vi'
                        ? 'Đang tải...'
                        : 'Uploading...'
                      : locale === 'vi'
                        ? 'Tải logo'
                        : 'Upload logo'}
                  </label>
                </div>
                <input
                  value={form.logoPath ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, logoPath: e.target.value }))}
                  placeholder="/uploads/... hoặc https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900">{locale === 'vi' ? 'Banner (nhiều ảnh)' : 'Banner (multiple images)'}</h2>
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{locale === 'vi' ? 'Danh sách ảnh banner' : 'Banner images list'}</span>
                    <button
                      type="button"
                      onClick={addBanner}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                    >
                      + {locale === 'vi' ? 'Thêm ảnh' : 'Add image'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {bannerDraft.map((path, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-7 text-center text-xs text-gray-500 font-medium">{idx + 1}</div>
                        <div className="w-16 h-10 relative bg-gray-50 rounded border overflow-hidden shrink-0">
                          {path ? (
                            <Image src={path} alt={`banner-${idx}`} fill className="object-cover" sizes="64px" />
                          ) : null}
                        </div>
                        <input
                          value={path}
                          onChange={(e) => setBannerDraft((prev) => prev.map((p, i) => (i === idx ? e.target.value : p)))}
                          placeholder="/uploads/... hoặc https://..."
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg"
                        />
                        <label className="px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) pickBannerFile(idx, f);
                              e.currentTarget.value = '';
                            }}
                            disabled={uploading !== null}
                          />
                          {locale === 'vi' ? 'Upload' : 'Upload'}
                        </label>
                        <button
                          type="button"
                          onClick={() => moveBannerUp(idx)}
                          disabled={idx === 0}
                          className="px-2.5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          title={locale === 'vi' ? 'Đưa lên' : 'Move up'}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBannerDown(idx)}
                          disabled={idx === bannerDraft.length - 1}
                          className="px-2.5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          title={locale === 'vi' ? 'Đưa xuống' : 'Move down'}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBanner(idx)}
                          className="px-3 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          title={locale === 'vi' ? 'Xóa' : 'Remove'}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {bannerDraft.length === 0 ? (
                      <p className="text-sm text-gray-500">{locale === 'vi' ? 'Chưa có ảnh banner.' : 'No banner images yet.'}</p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        {locale === 'vi'
                          ? 'Thứ tự từ trên xuống dưới sẽ là thứ tự hiển thị trên slider.'
                          : 'Top-to-bottom order is the display order in the slider.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h2 className="font-semibold text-gray-900 border-b pb-2">{locale === 'vi' ? 'Mô tả ngắn (Trang chủ)' : 'Short Description (Home)'}</h2>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Đoạn 1 (VI)' : 'Paragraph 1 (VI)'}</label>
                  <textarea
                    rows={3}
                    value={form.introDescriptionVi ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, introDescriptionVi: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Đoạn 1 (EN)' : 'Paragraph 1 (EN)'}</label>
                  <textarea
                    rows={3}
                    value={form.introDescriptionEn ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, introDescriptionEn: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Đoạn 2 (VI)' : 'Paragraph 2 (VI)'}</label>
                  <textarea
                    rows={3}
                    value={form.introDescription2Vi ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, introDescription2Vi: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Đoạn 2 (EN)' : 'Paragraph 2 (EN)'}</label>
                  <textarea
                    rows={3}
                    value={form.introDescription2En ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, introDescription2En: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h2 className="font-semibold text-gray-900">{locale === 'vi' ? 'Hình ảnh nổi bật' : 'Featured Images'}</h2>
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{locale === 'vi' ? 'Danh sách hình ảnh' : 'Images list'}</span>
                    <button
                      type="button"
                      onClick={addFeatured}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                    >
                      + {locale === 'vi' ? 'Thêm ảnh' : 'Add image'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {featuredDraft.map((path, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-7 text-center text-xs text-gray-500 font-medium">{idx + 1}</div>
                        <div className="w-16 h-10 relative bg-gray-50 rounded border overflow-hidden shrink-0">
                          {path ? (
                            <Image src={path} alt={`featured-${idx}`} fill className="object-cover" sizes="64px" />
                          ) : null}
                        </div>
                        <input
                          value={path}
                          onChange={(e) => setFeaturedDraft((prev) => prev.map((p, i) => (i === idx ? e.target.value : p)))}
                          placeholder="/uploads/... hoặc https://..."
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg"
                        />
                        <label className="px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) pickFeaturedFile(idx, f);
                              e.currentTarget.value = '';
                            }}
                            disabled={uploading !== null}
                          />
                          Upload
                        </label>
                        <button
                          type="button"
                          onClick={() => moveFeaturedUp(idx)}
                          disabled={idx === 0}
                          className="px-2.5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFeaturedDown(idx)}
                          disabled={idx === featuredDraft.length - 1}
                          className="px-2.5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFeatured(idx)}
                          className="px-3 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {featuredDraft.length === 0 ? (
                      <p className="text-sm text-gray-500">{locale === 'vi' ? 'Chưa có ảnh.' : 'No images yet.'}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'SĐT' : 'Phone'}</label>
                <input
                  value={form.phone ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  value={form.email ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Địa chỉ (VI)' : 'Address (VI)'}</label>
                <input
                  value={form.addressVi ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, addressVi: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Địa chỉ (EN)' : 'Address (EN)'}</label>
                <input
                  value={form.addressEn ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, addressEn: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {tab === 'about' && (
            <div className="space-y-3">
              <h2 className="font-semibold text-gray-900">{locale === 'vi' ? 'Thông tin giới thiệu' : 'Introduction information'}</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Tiêu đề' : 'Title'}</label>
                <input
                  value={form.introTitle ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, introTitle: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Slogan (VI)' : 'Slogan (VI)'}</label>
                <input
                  value={form.introSloganVi ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, introSloganVi: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Slogan (EN)' : 'Slogan (EN)'}</label>
                <input
                  value={form.introSloganEn ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, introSloganEn: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'vi' ? 'Nội dung giới thiệu (VI)' : 'Introduction content (VI)'}
                </label>
                <ReactQuill
                  value={form.introContentVi ?? ''}
                  onChange={(value) => setForm((p) => ({ ...p, introContentVi: value }))}
                  theme="snow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'vi' ? 'Nội dung giới thiệu (EN)' : 'Introduction content (EN)'}
                </label>
                <ReactQuill
                  value={form.introContentEn ?? ''}
                  onChange={(value) => setForm((p) => ({ ...p, introContentEn: value }))}
                  theme="snow"
                />
              </div>
            </div>
          )}

          {tab === 'contact' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-gray-900">{locale === 'vi' ? 'Link Social' : 'Social Links'}</h2>
                <button
                  type="button"
                  onClick={addSocial}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  {locale === 'vi' ? 'Thêm' : 'Add'}
                </button>
              </div>
              <div className="space-y-3">
                {socialLinks.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <input
                      value={s.label}
                      onChange={(e) => {
                        const label = e.target.value;
                        const guessed = guessIconFromLabel(label);
                        updateSocial(idx, {
                          label,
                          icon: (s.icon || '').trim() ? s.icon : (guessed ?? s.icon),
                        });
                      }}
                      placeholder={locale === 'vi' ? 'Nhãn (vd: Facebook)' : 'Label (e.g. Facebook)'}
                      className="md:col-span-3 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <select
                      value={s.icon || guessIconFromLabel(s.label || '') || 'facebook.png'}
                      onChange={(e) => updateSocial(idx, { icon: e.target.value })}
                      className="md:col-span-3 px-4 py-3 border border-gray-300 rounded-lg bg-white"
                    >
                      {ICON_CHOICES.map((c) => (
                        <option key={c.icon} value={c.icon}>
                          {c.label} ({c.icon})
                        </option>
                      ))}
                    </select>
                    <input
                      value={s.href}
                      onChange={(e) => updateSocial(idx, { href: e.target.value })}
                      placeholder="https://..."
                      className="md:col-span-5 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocial(idx)}
                      className="md:col-span-1 px-3 py-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      title={locale === 'vi' ? 'Xóa' : 'Remove'}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {socialDraft.length === 0 ? (
                  <p className="text-sm text-gray-500">{locale === 'vi' ? 'Chưa có link social.' : 'No social links yet.'}</p>
                ) : null}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-ct-blue text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (locale === 'vi' ? 'Đang lưu...' : 'Saving...') : locale === 'vi' ? 'Lưu' : 'Save'}
            </button>
          </div>
        </div>


      </div>
    </div>
  );
}

