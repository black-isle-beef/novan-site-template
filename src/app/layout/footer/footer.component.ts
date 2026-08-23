import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SiteConfigService } from '../../core/config/site-config.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly siteConfig = inject(SiteConfigService);
}