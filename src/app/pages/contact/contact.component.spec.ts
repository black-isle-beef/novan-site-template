import { TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  it('creates', async () => {
    await TestBed.configureTestingModule({ imports: [ContactComponent] }).compileComponents();

    const fixture = TestBed.createComponent(ContactComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});