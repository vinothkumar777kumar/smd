import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddtestimonialslistComponent } from './admin-addtestimonialslist.component';

describe('AdminAddtestimonialslistComponent', () => {
  let component: AdminAddtestimonialslistComponent;
  let fixture: ComponentFixture<AdminAddtestimonialslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAddtestimonialslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddtestimonialslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
