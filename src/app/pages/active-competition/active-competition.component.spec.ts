import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCompetitionComponent } from './active-competition.component';

describe('ActiveCompetitionComponent', () => {
  let component: ActiveCompetitionComponent;
  let fixture: ComponentFixture<ActiveCompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveCompetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
