import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginHeaderComponent } from './admin-login-header.component';

describe('AdminLoginHeaderComponent', () => {
  let component: AdminLoginHeaderComponent;
  let fixture: ComponentFixture<AdminLoginHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLoginHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLoginHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
