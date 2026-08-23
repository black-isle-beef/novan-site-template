import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SiteConfigService } from '../../core/config/site-config.service';
import { CookieConsentService } from '../../core/services/cookie-consent.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly siteConfig = inject(SiteConfigService);
  private cookieConsentService = inject(CookieConsentService);

  showCookiePreferences(): void {
    this.cookieConsentService.showModal();
  }
}