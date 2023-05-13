import { Component, OnInit } from '@angular/core';
import { TIME_LIST } from 'src/app/exports/constans';
import { ILoggingItem } from 'src/app/exports/interfaces/ILoggingItem';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: '[data-app-wrap-logging-page]',
  templateUrl: './wrap-logging-page.component.html',
  styleUrls: ['./wrap-logging-page.component.css']
})
export class WrapLoggingPageComponent implements OnInit {

  items: ILoggingItem[] = []

  times: ISelectValue[] = TIME_LIST
  positions: ISelectValue[] = [
    {
      name: 'Администратор',
      value: 'admin'
    },
    {
      name: 'Организатор',
      value: 'manager'
    },
    {
      name: 'Пользователь',
      value: 'viewer'
    }
  ]

  date_from: string = ''
  date_to: string = ''
  time: string = ''
  position: string = ''

  constructor(
    private logging$: LoggingService
  ) { 
    this.logging$.items.subscribe(items => {
      this.items = items
    })
  }

  getRequest() {
    this.logging$.getList({
      date_from: this.date_from,
      date_to: this.date_to,
      time: this.time,
      user__role: this.position
    })
  }

  ngOnInit(): void {
    this.getRequest()
  }

  getDateFrom(date: string) {
    this.date_from = date
    this.getRequest()
  }

  getDateTo(date: string) {
    this.date_to = date
    this.getRequest()
  }

  getTime(time: string) {
    this.time = time
    this.getRequest()
  }

  getPosition(position: string) {
    this.position = position
    this.getRequest()
  }

}
