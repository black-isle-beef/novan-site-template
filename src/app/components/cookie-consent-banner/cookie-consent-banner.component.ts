import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteConfigService } from '../../core/config/site-config.service';
import { CookieConsentService } from '../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  templateUrl: './cookie-consent-banner.component.html',
  styles: [],
})
export class CookieConsentBannerComponent {
  private siteConfigService = inject(SiteConfigService);
  private cookieConsentService = inject(CookieConsentService);

  readonly showBanner = signal(false);

  private readonly consent = toSignal(this.cookieConsentService.consent$, {
    initialValue: this.cookieConsentService.getConsent(),
  });

  constructor() {
    effect(() => {
      this.consent();
      if (!this.siteConfigService.cookieBannerEnabled || this.cookieConsentService.hasUserConsented()) {
        this.showBanner.set(false);
      } else {
        this.showBanner.set(true);
      }
    });
  }

  acceptAll(): void {
    this.cookieConsentService.acceptAll();
  }

  rejectAll(): void {
    this.cookieConsentService.rejectAll();
  }

  managePreferences(): void {
    this.cookieConsentService.showModal();
  }
}
