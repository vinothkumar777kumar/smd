import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFreeticketsComponent } from './my-freetickets.component';

describe('MyFreeticketsComponent', () => {
  let component: MyFreeticketsComponent;
  let fixture: ComponentFixture<MyFreeticketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFreeticketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFreeticketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
