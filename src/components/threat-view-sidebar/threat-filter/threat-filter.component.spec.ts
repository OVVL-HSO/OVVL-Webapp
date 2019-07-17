import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ThreatFilterComponent} from './threat-filter.component';

describe('ThreatFilterComponent', () => {
  let component: ThreatFilterComponent;
  let fixture: ComponentFixture<ThreatFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThreatFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
