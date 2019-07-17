import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustBoundaryOptionsComponent } from './trust-boundary-options.component';

describe('TrustBoundaryOptionsComponent', () => {
  let component: TrustBoundaryOptionsComponent;
  let fixture: ComponentFixture<TrustBoundaryOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustBoundaryOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustBoundaryOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
