import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { timeInterval } from 'rxjs';

@Component({
  selector: '[data-app-sms-repeat]',
  templateUrl: './sms-repeat.component.html',
  styleUrls: ['./sms-repeat.component.css']
})
export class SmsRepeatComponent implements OnInit {

  @Output() submit = new EventEmitter()
  @Output() repeat = new EventEmitter()
  code: any = ""
  timer: number = 60

  constructor() { }

  ngOnInit(): void {
    this.startTimer()
  }

  startTimer() {
    if(this.timer != 60) {
      this.timer = 60
    }
    const interval = setInterval(() => {
      this.timer -= 1
      if(this.timer == 0) {
        clearInterval(interval)
      }
    }, 1000)
  }

  setCode(val: any) {
    const value: any = val.target.value
    if(value != "Enter") {
      this.code = value
    } else {
      this.send()
    }
  }

  send() {
    this.submit.emit(this.code)
  }

  sendAgain() {
    this.repeat.emit(true)
    this.startTimer()
  }

}
