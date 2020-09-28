import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserReportComponent } from './view-user-report.component';

describe('ViewUserReportComponent', () => {
  let component: ViewUserReportComponent;
  let fixture: ComponentFixture<ViewUserReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
