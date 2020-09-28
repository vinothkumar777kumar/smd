import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponReportComponent } from './coupon-report.component';

describe('CouponReportComponent', () => {
  let component: CouponReportComponent;
  let fixture: ComponentFixture<CouponReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
