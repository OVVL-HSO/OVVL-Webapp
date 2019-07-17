import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectModelListComponent} from './project-model-list.component';

describe('ProjectModelListComponent', () => {
  let component: ProjectModelListComponent;
  let fixture: ComponentFixture<ProjectModelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectModelListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
