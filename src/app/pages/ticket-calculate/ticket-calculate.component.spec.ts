import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCalculateComponent } from './ticket-calculate.component';

describe('TicketCalculateComponent', () => {
  let component: TicketCalculateComponent;
  let fixture: ComponentFixture<TicketCalculateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketCalculateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketCalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
