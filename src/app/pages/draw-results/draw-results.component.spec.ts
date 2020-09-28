import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawResultsComponent } from './draw-results.component';

describe('DrawResultsComponent', () => {
  let component: DrawResultsComponent;
  let fixture: ComponentFixture<DrawResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
