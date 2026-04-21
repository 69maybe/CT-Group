import { create } from 'zustand';
import { api } from '@/lib/api';
import { COMPANY, type CompanySocialLink } from '@/config/company';

export type SiteSettings = {
  logoPath?: string | null;
  bannerPath?: string | null;
  bannerImages?: string[] | null;
  featuredImages?: string[] | null;
  phone?: string | null;
  email?: string | null;
  addressVi?: string | null;
  addressEn?: string | null;
  introTitle?: string | null;
  introSloganVi?: string | null;
  introSloganEn?: string | null;
  introDescriptionVi?: string | null;
  introDescriptionEn?: string | null;
  introDescription2Vi?: string | null;
  introDescription2En?: string | null;
  introDescription3Vi?: string | null;
  introDescription3En?: string | null;
  introContentVi?: string | null;
  introContentEn?: string | null;
  socialLinks?: CompanySocialLink[] | null;
};

function sanitizeSocialLinks(input: any): CompanySocialLink[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((s) => ({
      href: typeof s?.href === 'string' ? s.href.trim() : '',
      icon: typeof s?.icon === 'string' ? s.icon.trim() : '',
      label: typeof s?.label === 'string' ? s.label.trim() : '',
    }))
    .filter((s) => s.href && s.icon);
}

export function resolveCompanyRuntime(settings?: SiteSettings | null) {
  const s = settings || {};
  const bannerImages =
    Array.isArray(s.bannerImages) && s.bannerImages.length
      ? s.bannerImages.map((x) => String(x || '').trim()).filter(Boolean)
        : [];
  const bannerPath = bannerImages[0] || s.bannerPath?.trim() || COMPANY.bannerPath;

  const featuredImages =
    Array.isArray(s.featuredImages) && s.featuredImages.length
      ? s.featuredImages.map((x) => String(x || '').trim()).filter(Boolean)
      : [];

  const company = {
    ...COMPANY,
    logoPath: s.logoPath?.trim() || COMPANY.logoPath,
    bannerPath,
    phoneDisplay: s.phone?.trim() || COMPANY.phoneDisplay,
    phoneHref: `tel:${(s.phone?.trim() || COMPANY.phoneDisplay).replace(/\s+/g, '')}`,
    email: s.email?.trim() || COMPANY.email,
    emailHref: `mailto:${s.email?.trim() || COMPANY.email}`,
    addressVi: s.addressVi?.trim() || COMPANY.addressVi,
    addressEn: s.addressEn?.trim() || COMPANY.addressEn,
  };

  const socialLinks = sanitizeSocialLinks(s.socialLinks) || [];
  return {
    company,
    socialLinks,
    bannerImages,
    featuredImages,
  };
}

type State = {
  settings: SiteSettings | null;
  loaded: boolean;
  loading: boolean;
  error: string | null;
  loadPublic: () => Promise<void>;
  setLocal: (settings: SiteSettings) => void;
};

export const useSiteSettingsStore = create<State>((set, get) => ({
  settings: null,
  loaded: false,
  loading: false,
  error: null,
  setLocal: (settings) => set({ settings }),
  loadPublic: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const data = await api.getPublicSiteSettings();
      set({
        settings: {
          logoPath: data.logoPath ?? null,
          bannerPath: data.bannerPath ?? null,
          bannerImages: Array.isArray(data.bannerImages) ? data.bannerImages : null,
          featuredImages: Array.isArray((data as any).featuredImages) ? (data as any).featuredImages : null,
          phone: data.phone ?? null,
          email: data.email ?? null,
          addressVi: data.addressVi ?? null,
          addressEn: data.addressEn ?? null,
          introTitle: data.introTitle ?? null,
          introSloganVi: data.introSloganVi ?? null,
          introSloganEn: data.introSloganEn ?? null,
          introDescriptionVi: data.introDescriptionVi ?? null,
          introDescriptionEn: data.introDescriptionEn ?? null,
          introDescription2Vi: data.introDescription2Vi ?? null,
          introDescription2En: data.introDescription2En ?? null,
          introDescription3Vi: data.introDescription3Vi ?? null,
          introDescription3En: data.introDescription3En ?? null,
          introContentVi: data.introContentVi ?? null,
          introContentEn: data.introContentEn ?? null,
          socialLinks: sanitizeSocialLinks(data.socialLinks),
        },
        loaded: true,
        loading: false,
      });
    } catch (e) {
      set({
        loaded: true,
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load site settings',
      });
    }
  },
}));

