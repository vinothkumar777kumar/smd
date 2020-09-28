import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFreeticketusersComponent } from './view-freeticketusers.component';

describe('ViewFreeticketusersComponent', () => {
  let component: ViewFreeticketusersComponent;
  let fixture: ComponentFixture<ViewFreeticketusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFreeticketusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFreeticketusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
