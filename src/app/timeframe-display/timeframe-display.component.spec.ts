import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeframeDisplayComponent } from './timeframe-display.component';

describe('TimeframeDisplayComponent', () => {
  let component: TimeframeDisplayComponent;
  let fixture: ComponentFixture<TimeframeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeframeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeframeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
