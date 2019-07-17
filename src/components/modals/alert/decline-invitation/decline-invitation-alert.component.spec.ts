import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclineInvitationAlertComponent } from './decline-invitation-alert.component';

describe('DeclineInvitationAlertComponent', () => {
  let component: DeclineInvitationAlertComponent;
  let fixture: ComponentFixture<DeclineInvitationAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclineInvitationAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclineInvitationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
