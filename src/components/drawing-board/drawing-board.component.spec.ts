import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DrawingBoardComponent} from './drawing-board.component';

describe('DrawingBoardComponent', () => {
  let component: DrawingBoardComponent;
  let fixture: ComponentFixture<DrawingBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrawingBoardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
