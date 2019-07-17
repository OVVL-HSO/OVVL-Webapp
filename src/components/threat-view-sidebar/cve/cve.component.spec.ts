import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CveComponent} from './cve.component';

describe('CveComponent', () => {
  let component: CveComponent;
  let fixture: ComponentFixture<CveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
