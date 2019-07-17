import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-sign-out-alert',
  templateUrl: './sign-out-alert.component.html',
  styleUrls: ['./sign-out-alert.component.scss']
})
export class SignOutAlertComponent implements OnInit {

  @Output()
  signOut = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.signOutFromOVVL();
    }
  }

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.cancel.emit();
  }

  signOutFromOVVL() {
    this.signOut.emit();
  }
}
