import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CookieConsent {
  necessary: boolean;
  performance: boolean;
  analytics: boolean;
}

export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  cookies: CookieInfo[];
}

export interface CookieInfo {
  name: string;
  duration: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  private readonly STORAGE_KEY = 'cookie_consent_preferences';
  private readonly DEFAULT_CONSENT: CookieConsent = {
    necessary: true,
    performance: false,
    analytics: false,
  };

  private modalVisibleSubject = new BehaviorSubject<boolean>(false);
  private consentSubject = new BehaviorSubject<CookieConsent>(
    this.loadConsent(),
  );

  readonly modalVisible$ = this.modalVisibleSubject.asObservable();
  readonly consent$ = this.consentSubject.asObservable();

  private cookieCategories: CookieCategory[] = [
    {
      id: 'necessary',
      name: 'Necessary Cookies',
      description:
        'These cookies are essential for the website to function properly. They enable core functionality such as security, authentication, and page navigation.',
      required: true,
      cookies: [
        {
          name: '_session_id',
          duration: 'Session',
          description: 'Maintains user session during browsing',
        },
        {
          name: '_csrf_token',
          duration: 'Session',
          description: 'Security token for CSRF protection',
        },
        {
          name: '_ga_consent',
          duration: '2 years',
          description: 'Records cookie consent preferences',
        },
      ],
    },
    {
      id: 'performance',
      name: 'Performance Cookies',
      description:
        'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      required: false,
      cookies: [
        {
          name: '_ga',
          duration: '2 years',
          description:
            'Registers a unique ID used to generate statistical data on how the visitor uses the website',
        },
        {
          name: '_ga_<property-id>',
          duration: '2 years',
          description: 'Used to distinguish individual users by means of designation of a randomly generated number as client identifier',
        },
        {
          name: 'gid',
          duration: '24 hours',
          description: 'Registers a unique ID used to generate statistical data on how the visitor uses the website',
        },
      ],
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description:
        'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
      required: false,
      cookies: [
        {
          name: '_gat',
          duration: '1 minute',
          description: 'Used by Google Analytics to throttle request rate',
        },
        {
          name: '_gid',
          duration: '24 hours',
          description: 'Stores user ID for analytics tracking',
        },
        {
          name: 'collect',
          duration: 'Session',
          description: 'Used to send data to Google Analytics about the visitor\'s device and behavior',
        },
      ],
    },
  ];

  constructor() {}

  getCookieCategories(): CookieCategory[] {
    return this.cookieCategories;
  }

  showModal(): void {
    this.modalVisibleSubject.next(true);
  }

  closeModal(): void {
    this.modalVisibleSubject.next(false);
  }

  isModalVisible(): Observable<boolean> {
    return this.modalVisible$;
  }

  getConsent(): CookieConsent {
    return this.consentSubject.value;
  }

  acceptAll(): void {
    const consent: CookieConsent = {
      necessary: true,
      performance: true,
      analytics: true,
    };
    this.saveConsent(consent);
  }

  rejectAll(): void {
    const consent: CookieConsent = {
      necessary: true,
      performance: false,
      analytics: false,
    };
    this.saveConsent(consent);
  }

  saveSelection(consent: CookieConsent): void {
    this.saveConsent(consent);
  }

  private saveConsent(consent: CookieConsent): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consent));
    this.consentSubject.next(consent);
    this.closeModal();
  }

  private loadConsent(): CookieConsent {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.DEFAULT_CONSENT;
  }

  hasUserConsented(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }
}
