import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompetitionsComponent } from './add-competitions.component';

describe('AddCompetitionsComponent', () => {
  let component: AddCompetitionsComponent;
  let fixture: ComponentFixture<AddCompetitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompetitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompetitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
