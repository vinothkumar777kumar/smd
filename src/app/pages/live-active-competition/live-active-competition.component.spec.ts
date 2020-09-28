import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveActiveCompetitionComponent } from './live-active-competition.component';

describe('LiveActiveCompetitionComponent', () => {
  let component: LiveActiveCompetitionComponent;
  let fixture: ComponentFixture<LiveActiveCompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveActiveCompetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveActiveCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
