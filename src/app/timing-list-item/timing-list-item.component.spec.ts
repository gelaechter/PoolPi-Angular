import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimingListItemComponent } from './timing-list-item.component';

describe('TimingListItemComponent', () => {
  let component: TimingListItemComponent;
  let fixture: ComponentFixture<TimingListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimingListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimingListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
