import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserdetailReportComponent } from './view-userdetail-report.component';

describe('ViewUserdetailReportComponent', () => {
  let component: ViewUserdetailReportComponent;
  let fixture: ComponentFixture<ViewUserdetailReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserdetailReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserdetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
