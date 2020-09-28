import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolloverNotificationComponent } from './rollover-notification.component';

describe('RolloverNotificationComponent', () => {
  let component: RolloverNotificationComponent;
  let fixture: ComponentFixture<RolloverNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolloverNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolloverNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
