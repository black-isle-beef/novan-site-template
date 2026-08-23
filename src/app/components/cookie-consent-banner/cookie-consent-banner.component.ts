import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { skip } from 'rxjs';
import { SiteConfigService } from '../../core/config/site-config.service';
import { CookieConsentService } from '../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent-banner.component.html',
  styleUrls: ['./cookie-consent-banner.component.scss'],
})
export class CookieConsentBannerComponent implements OnInit {
  private siteConfigService = inject(SiteConfigService);
  private cookieConsentService = inject(CookieConsentService);

  showBanner = false;

  ngOnInit(): void {
    if (!this.siteConfigService.cookieBannerEnabled) {
      return;
    }

    // Show banner only if user hasn't consented yet
    if (!this.cookieConsentService.hasUserConsented()) {
      this.showBanner = true;
    }

    // Hide banner when user makes a consent choice (skip first emission from BehaviorSubject)
    this.cookieConsentService.consent$
      .pipe(skip(1))
      .subscribe(() => {
        this.showBanner = false;
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
