import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="py-5">
      <p class="text-uppercase text-primary fw-semibold small mb-3">Welcome to Novan</p>
      <h1 class="display-4 mb-3">Build a clearer digital presence.</h1>
      <p class="lead col-lg-8 mb-4">A thoughtful Angular foundation for your next site, product, or idea.</p>
      <a class="btn btn-primary" routerLink="/about">Explore Novan</a>
    </section>
  `,
})
export class HomeComponent {}