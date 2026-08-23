import { Routes } from '@angular/router';

import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CookiePolicyComponent } from './pages/cookie-policy/cookie-policy.component';
import { HomeComponent } from './pages/home/home.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home | Novan' },
  { path: 'about', component: AboutComponent, title: 'About | Novan' },
  { path: 'contact', component: ContactComponent, title: 'Contact | Novan' },
  { path: 'privacy', component: PrivacyComponent, title: 'Privacy Policy | Novan' },
  {
    path: 'cookie-policy',
    component: CookiePolicyComponent,
    title: 'Cookie Policy | Novan',
  },
  { path: '**', redirectTo: '' },
];