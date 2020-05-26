import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CweComponent} from './cwe.component';

describe('CweComponent', () => {
  let component: CweComponent;
  let fixture: ComponentFixture<CweComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CweComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CweComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
