import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadModelAlertComponent } from './load-model-alert.component';

describe('LoadModelAlertComponent', () => {
  let component: LoadModelAlertComponent;
  let fixture: ComponentFixture<LoadModelAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadModelAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadModelAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
