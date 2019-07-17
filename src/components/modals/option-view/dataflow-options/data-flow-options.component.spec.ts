import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DataFlowOptionsComponent} from './data-flow-options.component';

describe('DataFlowOptionsComponent', () => {
  let component: DataFlowOptionsComponent;
  let fixture: ComponentFixture<DataFlowOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowOptionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
