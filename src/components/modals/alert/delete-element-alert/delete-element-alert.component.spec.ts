import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteElementAlertComponent } from './delete-element-alert.component';

describe('DeleteElementAlertComponent', () => {
  let component: DeleteElementAlertComponent;
  let fixture: ComponentFixture<DeleteElementAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteElementAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteElementAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
