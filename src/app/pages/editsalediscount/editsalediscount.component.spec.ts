import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsalediscountComponent } from './editsalediscount.component';

describe('EditsalediscountComponent', () => {
  let component: EditsalediscountComponent;
  let fixture: ComponentFixture<EditsalediscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditsalediscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditsalediscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
