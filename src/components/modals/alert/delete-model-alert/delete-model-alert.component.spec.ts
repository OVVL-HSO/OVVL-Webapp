import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModelAlertComponent } from './delete-model-alert.component';

describe('DeleteModelAlertComponent', () => {
  let component: DeleteModelAlertComponent;
  let fixture: ComponentFixture<DeleteModelAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteModelAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteModelAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
