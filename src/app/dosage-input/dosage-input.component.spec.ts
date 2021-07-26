import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosageInputComponent } from './dosage-input.component';

describe('DosageInputComponent', () => {
  let component: DosageInputComponent;
  let fixture: ComponentFixture<DosageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DosageInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DosageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
