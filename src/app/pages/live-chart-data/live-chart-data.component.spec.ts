import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChartDataComponent } from './live-chart-data.component';

describe('LiveChartDataComponent', () => {
  let component: LiveChartDataComponent;
  let fixture: ComponentFixture<LiveChartDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveChartDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveChartDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
