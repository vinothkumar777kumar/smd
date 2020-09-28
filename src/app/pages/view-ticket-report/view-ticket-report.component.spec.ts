import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTicketReportComponent } from './view-ticket-report.component';

describe('ViewTicketReportComponent', () => {
  let component: ViewTicketReportComponent;
  let fixture: ComponentFixture<ViewTicketReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTicketReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTicketReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
