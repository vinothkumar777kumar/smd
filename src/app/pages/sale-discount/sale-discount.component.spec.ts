import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDiscountComponent } from './sale-discount.component';

describe('SaleDiscountComponent', () => {
  let component: SaleDiscountComponent;
  let fixture: ComponentFixture<SaleDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
