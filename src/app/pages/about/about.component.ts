import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { SiteConfigService } from '../../core/config/site-config.service';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  readonly siteConfig = inject(SiteConfigService);
}