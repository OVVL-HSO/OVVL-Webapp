import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavingWorkareaAlertComponent } from './leaving-workarea-alert.component';

describe('LeavingWorkareaAlertComponent', () => {
  let component: LeavingWorkareaAlertComponent;
  let fixture: ComponentFixture<LeavingWorkareaAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavingWorkareaAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavingWorkareaAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
