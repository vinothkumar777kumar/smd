import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTicketComponent } from './free-ticket.component';

describe('FreeTicketComponent', () => {
  let component: FreeTicketComponent;
  let fixture: ComponentFixture<FreeTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
