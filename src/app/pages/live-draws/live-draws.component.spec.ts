import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDrawsComponent } from './live-draws.component';

describe('LiveDrawsComponent', () => {
  let component: LiveDrawsComponent;
  let fixture: ComponentFixture<LiveDrawsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveDrawsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveDrawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
