import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWinnerComponent } from './add-winner.component';

describe('AddWinnerComponent', () => {
  let component: AddWinnerComponent;
  let fixture: ComponentFixture<AddWinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
