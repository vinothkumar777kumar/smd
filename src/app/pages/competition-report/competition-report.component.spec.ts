import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionReportComponent } from './competition-report.component';

describe('CompetitionReportComponent', () => {
  let component: CompetitionReportComponent;
  let fixture: ComponentFixture<CompetitionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
