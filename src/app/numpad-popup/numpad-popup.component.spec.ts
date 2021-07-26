import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumpadPopupComponent } from './numpad-popup.component';

describe('NumpadPopupComponent', () => {
  let component: NumpadPopupComponent;
  let fixture: ComponentFixture<NumpadPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumpadPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumpadPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
