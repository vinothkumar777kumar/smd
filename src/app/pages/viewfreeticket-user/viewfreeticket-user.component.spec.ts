import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfreeticketUserComponent } from './viewfreeticket-user.component';

describe('ViewfreeticketUserComponent', () => {
  let component: ViewfreeticketUserComponent;
  let fixture: ComponentFixture<ViewfreeticketUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewfreeticketUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewfreeticketUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
