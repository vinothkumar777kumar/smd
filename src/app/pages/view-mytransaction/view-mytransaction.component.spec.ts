import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMytransactionComponent } from './view-mytransaction.component';

describe('ViewMytransactionComponent', () => {
  let component: ViewMytransactionComponent;
  let fixture: ComponentFixture<ViewMytransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMytransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMytransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
