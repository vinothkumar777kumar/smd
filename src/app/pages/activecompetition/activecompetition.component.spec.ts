import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivecompetitionComponent } from './activecompetition.component';

describe('ActivecompetitionComponent', () => {
  let component: ActivecompetitionComponent;
  let fixture: ComponentFixture<ActivecompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivecompetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivecompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
