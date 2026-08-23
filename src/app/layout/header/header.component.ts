import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly menuOpen = signal(false);
  readonly darkMode = signal(false);
  readonly navigationLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.darkMode.set(this.getTheme() === 'dark');
    this.applyTheme();
    this.watchSystemTheme();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closeMenu());
  }

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleTheme(): void {
    this.darkMode.update((isDarkMode) => !isDarkMode);
    this.applyTheme();
    localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
  }

  private getTheme(): 'dark' | 'light' {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    return this.getSystemTheme();
  }

  private getSystemTheme(): 'dark' | 'light' {
    return this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private watchSystemTheme(): void {
    const mediaQueryList = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQueryList) {
      return;
    }

    const updateTheme = (): void => {
      if (localStorage.getItem('theme')) {
        return;
      }

      this.darkMode.set(this.getSystemTheme() === 'dark');
      this.applyTheme();
    };

    mediaQueryList.addEventListener('change', updateTheme);
    this.destroyRef.onDestroy(() => mediaQueryList.removeEventListener('change', updateTheme));
  }

  private applyTheme(): void {
    this.document.documentElement.setAttribute('data-bs-theme', this.darkMode() ? 'dark' : 'light');
  }
}