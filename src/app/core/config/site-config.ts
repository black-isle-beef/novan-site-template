export interface SocialLinks {
  readonly instagram: string;
  readonly linkedin: string;
  readonly x: string;
  readonly facebook: string;
}

export interface SiteConfig {
  readonly companyName: string;
  readonly brandTagline: string;
  readonly copyrightStartYear: number;
  readonly cookieBannerEnabled: boolean;
  readonly socialLinks: SocialLinks;
  readonly contactEmail: string;
}

export const SITE_CONFIG: SiteConfig = {
  companyName: 'Novan web services',
  brandTagline: 'Thoughtful digital foundations for growing teams.',
  copyrightStartYear: 2026,
  cookieBannerEnabled: false,
  socialLinks: {
    instagram: 'https://www.instagram.com',
    linkedin: 'https://www.linkedin.com',
    x: 'https://x.com',
    facebook: 'https://www.facebook.com',
  },
  contactEmail: 'hello@novan.example',
};
