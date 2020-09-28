import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyticketsComponent } from './view-mytickets.component';

describe('ViewMyticketsComponent', () => {
  let component: ViewMyticketsComponent;
  let fixture: ComponentFixture<ViewMyticketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMyticketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMyticketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
