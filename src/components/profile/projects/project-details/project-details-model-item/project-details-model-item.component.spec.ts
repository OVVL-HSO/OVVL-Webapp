import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsModelItemComponent } from './project-details-model-item.component';

describe('ProjectDetailsModelItemComponent', () => {
  let component: ProjectDetailsModelItemComponent;
  let fixture: ComponentFixture<ProjectDetailsModelItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDetailsModelItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailsModelItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
