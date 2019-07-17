import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredInviteComponent } from './stored-invite.component';

describe('StoredInviteComponent', () => {
  let component: StoredInviteComponent;
  let fixture: ComponentFixture<StoredInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoredInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
