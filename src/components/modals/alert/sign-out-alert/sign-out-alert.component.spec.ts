import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOutAlertComponent } from './sign-out-alert.component';

describe('SignOutAlertComponent', () => {
  let component: SignOutAlertComponent;
  let fixture: ComponentFixture<SignOutAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignOutAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignOutAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
