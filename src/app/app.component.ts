import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  imports: [FooterComponent, HeaderComponent, RouterOutlet],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <app-header />
    <main id="main-content" class="container py-4 flex-grow-1" tabindex="-1"><router-outlet /></main>
    <app-footer />
  `,
})
export class AppComponent {}