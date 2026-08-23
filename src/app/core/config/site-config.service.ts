import { Injectable } from '@angular/core';

import { SITE_CONFIG, SiteConfig } from './site-config';

@Injectable({ providedIn: 'root' })
export class SiteConfigService {
  readonly config: SiteConfig = SITE_CONFIG;
  readonly currentYear = new Date().getFullYear();

  get companyName(): string {
    return this.config.companyName;
  }

  get brandTagline(): string {
    return this.config.brandTagline;
  }

  get cookieBannerEnabled(): boolean {
    return this.config.cookieBannerEnabled;
  }

  get socialLinks(): SiteConfig['socialLinks'] {
    return this.config.socialLinks;
  }

  get contactEmail(): string {
    return this.config.contactEmail;
  }

  get copyrightNotice(): string {
    const yearRange =
      this.config.copyrightStartYear === this.currentYear
        ? `${this.currentYear}`
        : `${this.config.copyrightStartYear} - ${this.currentYear}`;

    return `© ${yearRange} ${this.companyName}. All rights reserved.`;
  }
}
