import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-spinner-small',
  templateUrl: './spinner-small.component.html',
  styleUrls: ['./spinner-small.component.scss']
})
export class SpinnerSmallComponent implements OnInit {

  marginFromTop: number;

  constructor() {
  }

  @Input()
  set marginTop(marginTop: number) {
    this.marginFromTop = marginTop;
  }

  ngOnInit() {
  }

}
