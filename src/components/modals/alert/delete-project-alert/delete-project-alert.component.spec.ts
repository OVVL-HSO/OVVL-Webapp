import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProjectAlertComponent } from './delete-project-alert.component';

describe('DeleteProjectAlertComponent', () => {
  let component: DeleteProjectAlertComponent;
  let fixture: ComponentFixture<DeleteProjectAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteProjectAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProjectAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
