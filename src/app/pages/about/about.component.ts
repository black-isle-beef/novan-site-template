import { Component, inject } from '@angular/core';

import { SiteConfigService } from '../../core/config/site-config.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
})
export class AboutComponent {
  readonly siteConfig = inject(SiteConfigService);
}