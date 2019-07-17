import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveProjectAlertComponent } from './leave-project-alert.component';

describe('LeaveProjectAlertComponent', () => {
  let component: LeaveProjectAlertComponent;
  let fixture: ComponentFixture<LeaveProjectAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveProjectAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveProjectAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
