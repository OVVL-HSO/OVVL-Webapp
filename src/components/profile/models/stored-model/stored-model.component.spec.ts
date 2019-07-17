import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StoredModelComponent} from './stored-model.component';

describe('StoredModelComponent', () => {
  let component: StoredModelComponent;
  let fixture: ComponentFixture<StoredModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StoredModelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
