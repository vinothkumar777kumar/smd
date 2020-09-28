import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCheckoutComponent } from './post-checkout.component';

describe('PostCheckoutComponent', () => {
  let component: PostCheckoutComponent;
  let fixture: ComponentFixture<PostCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
