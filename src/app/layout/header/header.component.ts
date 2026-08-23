import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header>
      <nav class="navbar navbar-expand-lg bg-white border-bottom" aria-label="Main navigation">
        <div class="container">
          <a class="navbar-brand fw-semibold" routerLink="/" (click)="closeMenu()">
            NOVAN
          </a>
          <button
            class="navbar-toggler"
            type="button"
            aria-controls="main-navigation"
            [attr.aria-expanded]="menuOpen()"
            aria-label="Toggle navigation"
            (click)="toggleMenu()"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div id="main-navigation" class="collapse navbar-collapse" [class.show]="menuOpen()">
            <ul class="navbar-nav ms-auto gap-lg-2">
              @for (link of navigationLinks; track link.path) {
                <li class="nav-item">
                  <a
                    class="nav-link"
                    [routerLink]="link.path"
                    routerLinkActive="active"
                    [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                    (click)="closeMenu()"
                  >
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `,
})
export class HeaderComponent {
  readonly menuOpen = signal(false);
  readonly navigationLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
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
}