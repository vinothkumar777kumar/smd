import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponReportViewComponent } from './coupon-report-view.component';

describe('CouponReportViewComponent', () => {
  let component: CouponReportViewComponent;
  let fixture: ComponentFixture<CouponReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponReportViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
