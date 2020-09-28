import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestimonialslistComponent } from './admin-testimonialslist.component';

describe('AdminTestimonialslistComponent', () => {
  let component: AdminTestimonialslistComponent;
  let fixture: ComponentFixture<AdminTestimonialslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTestimonialslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTestimonialslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
