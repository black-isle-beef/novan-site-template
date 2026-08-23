import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  CookieConsentService,
  CookieCategory,
  CookieConsent,
} from '../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CookiePolicyComponent implements OnInit {
  private cookieConsentService = inject(CookieConsentService);

  categories: CookieCategory[] = [];
  currentConsent: CookieConsent = { necessary: true, performance: false, analytics: false };
  isModalVisible = false;

  ngOnInit(): void {
    this.categories = this.cookieConsentService.getCookieCategories();
    this.currentConsent = this.cookieConsentService.getConsent();

    this.cookieConsentService.isModalVisible().subscribe((visible) => {
      this.isModalVisible = visible;
      setTimeout(() => {
        const dialog = document.querySelector('dialog[class="cookie-modal"]') as HTMLDialogElement;
        if (visible && dialog) {
          dialog.showModal();
        } else if (dialog && dialog.open) {
          dialog.close();
        }
      }, 0);
    });
  }

  onDialogCancel(event: Event): void {
    // Prevent closing the dialog by clicking the backdrop
    event.preventDefault();
  }

  getConsentValue(categoryId: string): boolean {
    const key = categoryId as keyof CookieConsent;
    return this.currentConsent[key] ?? false;
  }

  updateConsent(categoryId: string, value: boolean): void {
    const key = categoryId as keyof CookieConsent;
    this.currentConsent[key] = value;
  }

  acceptAll(): void {
    this.currentConsent = { necessary: true, performance: true, analytics: true };
    this.cookieConsentService.acceptAll();
  }

  rejectAll(): void {
    this.currentConsent = { necessary: true, performance: false, analytics: false };
    this.cookieConsentService.rejectAll();
  }

  saveSelection(): void {
    this.cookieConsentService.saveSelection(this.currentConsent);
  }

  closeModal(): void {
    this.cookieConsentService.closeModal();
  }
}