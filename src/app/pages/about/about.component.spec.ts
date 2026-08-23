import { TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  it('creates', async () => {
    await TestBed.configureTestingModule({ imports: [AboutComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AboutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});