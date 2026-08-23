import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { SiteConfigService } from './site-config.service';

@Injectable()
export class SiteTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly siteConfig = inject(SiteConfigService);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(routerState);
    this.title.setTitle(
      pageTitle ? `${pageTitle} | ${this.siteConfig.companyName}` : this.siteConfig.companyName,
    );
  }
}
