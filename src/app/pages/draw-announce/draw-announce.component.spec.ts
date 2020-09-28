import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAnnounceComponent } from './draw-announce.component';

describe('DrawAnnounceComponent', () => {
  let component: DrawAnnounceComponent;
  let fixture: ComponentFixture<DrawAnnounceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawAnnounceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawAnnounceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
