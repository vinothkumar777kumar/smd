import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsalediscountComponent } from './viewsalediscount.component';

describe('ViewsalediscountComponent', () => {
  let component: ViewsalediscountComponent;
  let fixture: ComponentFixture<ViewsalediscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsalediscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsalediscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
