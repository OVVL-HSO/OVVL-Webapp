import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CpeListComponent} from './cpe-list.component';

describe('CpeListComponent', () => {
  let component: CpeListComponent;
  let fixture: ComponentFixture<CpeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CpeListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
