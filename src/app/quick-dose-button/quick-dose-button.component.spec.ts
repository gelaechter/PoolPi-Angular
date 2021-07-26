import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickDoseButtonComponent } from './quick-dose-button.component';

describe('QuickDoseButtonComponent', () => {
  let component: QuickDoseButtonComponent;
  let fixture: ComponentFixture<QuickDoseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickDoseButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickDoseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
