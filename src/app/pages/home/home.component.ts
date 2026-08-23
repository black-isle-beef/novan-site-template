import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SiteConfigService } from '../../core/config/site-config.service';

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly siteConfig = inject(SiteConfigService);
}