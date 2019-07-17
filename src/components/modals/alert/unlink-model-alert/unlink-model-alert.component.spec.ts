import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlinkModelAlertComponent } from './unlink-model-alert.component';

describe('UnlinkModelAlertComponent', () => {
  let component: UnlinkModelAlertComponent;
  let fixture: ComponentFixture<UnlinkModelAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlinkModelAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlinkModelAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
