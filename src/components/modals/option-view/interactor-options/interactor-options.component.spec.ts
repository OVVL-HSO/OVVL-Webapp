import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InteractorOptionsComponent} from './interactor-options.component';

describe('InteractorOptionsComponent', () => {
  let component: InteractorOptionsComponent;
  let fixture: ComponentFixture<InteractorOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InteractorOptionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractorOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
