import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainOptionComponent} from './main-option.component';

describe('MainOptionComponent', () => {
  let component: MainOptionComponent;
  let fixture: ComponentFixture<MainOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainOptionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
