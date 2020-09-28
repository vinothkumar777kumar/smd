import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFreeticketsComponent } from './add-freetickets.component';

describe('AddFreeticketsComponent', () => {
  let component: AddFreeticketsComponent;
  let fixture: ComponentFixture<AddFreeticketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFreeticketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFreeticketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
