import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  CookieConsentService,
  CookieCategory,
  CookieConsent,
} from '../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styles: [],
  standalone: true,
  imports: [FormsModule],
})
export class CookiePolicyComponent {
  private cookieConsentService = inject(CookieConsentService);
  private document = inject(DOCUMENT);
  private router = inject(Router);

  readonly categories = signal<CookieCategory[]>(this.cookieConsentService.getCookieCategories());
  readonly currentConsent = signal<CookieConsent>(this.cookieConsentService.getConsent());
  readonly isModalVisible = toSignal(this.cookieConsentService.modalVisible$, {
    initialValue: false,
  });

  isPolicyRoute(): boolean {
    return this.router.url === '/cookie-policy';
  }

  constructor() {
    effect(() => {
      const dialog = this.document.querySelector<HTMLDialogElement>('dialog.cookie-modal');
      if (!dialog) {
        return;
      }

      if (this.isModalVisible() && !dialog.open) {
        dialog.showModal();
      } else if (!this.isModalVisible() && dialog.open) {
        dialog.close();
      }
    });
  }

  onDialogCancel(event: Event): void {
    // Prevent closing the dialog by clicking the backdrop
    event.preventDefault();
  }

  getConsentValue(categoryId: string): boolean {
    const key = categoryId as keyof CookieConsent;
    return this.currentConsent()[key] ?? false;
  }

  updateConsent(categoryId: string, value: boolean): void {
    const key = categoryId as keyof CookieConsent;
    this.currentConsent.update((consent) => ({ ...consent, [key]: value }));
  }

  onCategoryToggle(categoryId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateConsent(categoryId, target.checked);
  }

  acceptAll(): void {
    this.currentConsent.set({ necessary: true, performance: true, analytics: true });
    this.cookieConsentService.acceptAll();
  }

  rejectAll(): void {
    this.currentConsent.set({ necessary: true, performance: false, analytics: false });
    this.cookieConsentService.rejectAll();
  }

  saveSelection(): void {
    this.cookieConsentService.saveSelection(this.currentConsent());
  }

  closeModal(): void {
    this.cookieConsentService.closeModal();
  }
}