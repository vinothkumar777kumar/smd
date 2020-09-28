import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalediscountreportComponent } from './view-salediscountreport.component';

describe('ViewSalediscountreportComponent', () => {
  let component: ViewSalediscountreportComponent;
  let fixture: ComponentFixture<ViewSalediscountreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSalediscountreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalediscountreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
