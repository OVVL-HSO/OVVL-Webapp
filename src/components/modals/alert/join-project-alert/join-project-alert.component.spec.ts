import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinProjectAlertComponent } from './join-project-alert.component';

describe('JoinProjectAlertComponent', () => {
  let component: JoinProjectAlertComponent;
  let fixture: ComponentFixture<JoinProjectAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinProjectAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinProjectAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
