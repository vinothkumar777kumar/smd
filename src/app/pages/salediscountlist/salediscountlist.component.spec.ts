import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalediscountlistComponent } from './salediscountlist.component';

describe('SalediscountlistComponent', () => {
  let component: SalediscountlistComponent;
  let fixture: ComponentFixture<SalediscountlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalediscountlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalediscountlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
