import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CookieConsentBannerComponent } from './components/cookie-consent-banner/cookie-consent-banner.component';
import { CookiePolicyComponent } from './pages/cookie-policy/cookie-policy.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CookieConsentBannerComponent, CookiePolicyComponent, FooterComponent, HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {}