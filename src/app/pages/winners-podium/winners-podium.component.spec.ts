import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnersPodiumComponent } from './winners-podium.component';

describe('WinnersPodiumComponent', () => {
  let component: WinnersPodiumComponent;
  let fixture: ComponentFixture<WinnersPodiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinnersPodiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinnersPodiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
