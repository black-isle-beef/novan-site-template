import { TestBed } from '@angular/core/testing';

import { PrivacyComponent } from './privacy.component';

describe('PrivacyComponent', () => {
  it('creates', async () => {
    await TestBed.configureTestingModule({ imports: [PrivacyComponent] }).compileComponents();

    const fixture = TestBed.createComponent(PrivacyComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});