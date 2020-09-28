import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaunchCouponComponent } from './relaunch-coupon.component';

describe('RelaunchCouponComponent', () => {
  let component: RelaunchCouponComponent;
  let fixture: ComponentFixture<RelaunchCouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelaunchCouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelaunchCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
