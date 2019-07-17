import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpinnerBigComponent} from './spinner-big.component';

describe('SpinnerBigComponent', () => {
  let component: SpinnerBigComponent;
  let fixture: ComponentFixture<SpinnerBigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpinnerBigComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
