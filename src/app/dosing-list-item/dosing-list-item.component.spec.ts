import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosingListItemComponent } from './dosing-list-item.component';

describe('DosingListItemComponent', () => {
  let component: DosingListItemComponent;
  let fixture: ComponentFixture<DosingListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DosingListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DosingListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
