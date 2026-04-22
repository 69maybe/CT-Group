export type CompanySocialLink = {
  href: string;
  icon: string; // file name under /images/ctgroup/
  label: string;
};

export const COMPANY = {
  name: 'SYSMAC JSC',
  logoPath: '/images/ctgroup/logo.webp',
  bannerPath: '',

  phoneDisplay: '0845550555',
  phoneHref: 'tel:0845550555',

  email: 'sysmac.vn@gmail.com',
  emailHref: 'mailto:sysmac.vn@gmail.com',

  addressVi: '261/15/18/34A Đình Phong Phú, P. Tăng Nhơn Phú B, Q. 9, TP. Hồ Chí Minh, Việt Nam',
  addressEn:
    '261/15/18/34A Dinh Phong Phu St., Tang Nhon Phu B Ward, District 9, Ho Chi Minh City, Vietnam',
} as const;

/**
 * Đổi link social tại đây (Header/Footer/Contact page sẽ tự cập nhật).
 * Lưu ý: `icon` là file trong `/images/ctgroup/` (vd: facebook.png).
 */
export const COMPANY_SOCIAL_LINKS: CompanySocialLink[] = [
  // Social links are managed from Admin -> Site Settings.
];

