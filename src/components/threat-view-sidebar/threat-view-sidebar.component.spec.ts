import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ThreatViewSidebarComponent} from './threat-view-sidebar.component';

describe('ThreatViewSidebarComponent', () => {
  let component: ThreatViewSidebarComponent;
  let fixture: ComponentFixture<ThreatViewSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThreatViewSidebarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatViewSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
