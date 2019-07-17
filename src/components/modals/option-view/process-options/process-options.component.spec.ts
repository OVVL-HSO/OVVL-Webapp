import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProcessOptionsComponent} from './process-options.component';

describe('ProcessOptionsComponent', () => {
  let component: ProcessOptionsComponent;
  let fixture: ComponentFixture<ProcessOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessOptionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
