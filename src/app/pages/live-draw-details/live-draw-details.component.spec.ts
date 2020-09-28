import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDrawDetailsComponent } from './live-draw-details.component';

describe('LiveDrawDetailsComponent', () => {
  let component: LiveDrawDetailsComponent;
  let fixture: ComponentFixture<LiveDrawDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveDrawDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveDrawDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
