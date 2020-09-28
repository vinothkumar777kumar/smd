import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTicketReportComponent } from './free-ticket-report.component';

describe('FreeTicketReportComponent', () => {
  let component: FreeTicketReportComponent;
  let fixture: ComponentFixture<FreeTicketReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeTicketReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTicketReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
