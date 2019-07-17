import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StoredProjectComponent} from './stored-project.component';

describe('StoredProjectComponent', () => {
  let component: StoredProjectComponent;
  let fixture: ComponentFixture<StoredProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StoredProjectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
