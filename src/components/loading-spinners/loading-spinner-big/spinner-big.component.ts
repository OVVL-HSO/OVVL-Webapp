import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-spinner-big',
  templateUrl: './spinner-big.component.html',
  styleUrls: ['./spinner-big.component.scss']
})
export class SpinnerBigComponent implements OnInit {

  isChrome: boolean;

  constructor() {
  }

  ngOnInit() {
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  }

}
