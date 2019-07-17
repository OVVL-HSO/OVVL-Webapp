import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewModelAlertComponent } from './new-model-alert.component';

describe('NewModelAlertComponent', () => {
  let component: NewModelAlertComponent;
  let fixture: ComponentFixture<NewModelAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewModelAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewModelAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
