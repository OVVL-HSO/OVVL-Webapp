import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DataStoreOptionsComponent} from './data-store-options.component';

describe('DataStoreOptionsComponent', () => {
  let component: DataStoreOptionsComponent;
  let fixture: ComponentFixture<DataStoreOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataStoreOptionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataStoreOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
