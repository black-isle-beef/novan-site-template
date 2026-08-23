import { TestBed } from '@angular/core/testing';

import { CookiePolicyComponent } from './cookie-policy.component';

describe('CookiePolicyComponent', () => {
  it('creates', async () => {
    await TestBed.configureTestingModule({ imports: [CookiePolicyComponent] }).compileComponents();

    const fixture = TestBed.createComponent(CookiePolicyComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});