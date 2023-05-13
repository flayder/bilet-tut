import { formatDate } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { TIME_LIST } from 'src/app/exports/constans';
import { IDateItem } from 'src/app/exports/interfaces/IDateItem';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: '[data-app-date-tab-item]',
  templateUrl: './date-tab-item.component.html',
  styleUrls: ['./date-tab-item.component.css']
})
export class DateTabItemComponent implements AfterContentInit {

  @Input() item: IDateItem
  @Input() key: any
  @Output() data = new EventEmitter<IDateItem>()
  @Output() deleted = new EventEmitter()

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  times: ISelectValue[] = TIME_LIST
  start_date: any = ''
  start_time: any = ''
  finish_date: any = ''
  finish_time: any = ''
  

  form = new FormGroup({
    start_date: new FormControl(null, [
      Validators.required
    ]),
    finish_date: new FormControl(null, [
      Validators.required
    ]),
    start_time: new FormControl(null, [
      Validators.required
    ]),
    finish_time: new FormControl(null, [
      Validators.required
    ]),
  })

  private init: boolean = false

  constructor(
    private event$: EventService,
    private message$: MessageService
  ) { 
    for(let field in this.form.value) {
      const control = this.form.get(field)
      if(control) {
        control.valueChanges.subscribe((value: any) => {
          if(value) {
            const errors = ErrorHandlerClass.AnyErrors(this.form)
            if(!errors) {
              setTimeout(() => {
                const format = 'yyyy-MM-dd'
                const time = 'HH:mm'
                const locale = 'en-US' 
      
                const start_date = `${this.form.value.start_date} ${this.form.value.start_time}`
                const finish_date = `${this.form.value.finish_date} ${this.form.value.finish_time}`
                const item_start_date = (this.item.start_date) ? `${formatDate(this.item.start_date, format, locale)} ${formatDate(this.item.start_date, time, locale)}` : ''
                const item_finish_date = (this.item.finish_date) ? `${formatDate(this.item.finish_date, format, locale)} ${formatDate(this.item.finish_date, time, locale)}`: ''
               
                if(
                  item_start_date != start_date ||
                  item_finish_date != finish_date
                ) {
                  const params: any = {
                    start_date,
                    finish_date
                  }
                  if(this.item.id) {
                    params.id = this.item.id
                  }
                  const event: any = {key: this.key, item: params}
                  this.data.emit(event)

                }
              }, 200)
            }
          }
        })
      }
    }
  }

  ngAfterContentInit(): void {
    this.initiation()
    this.init = true
  }

  initiation() {
    if(this.item && this.item.start_date && this.item.finish_date) {
      const format = 'yyyy-MM-dd'
      const time = 'HH:mm'
      const locale = 'en-US'

      const start_date: any = formatDate(this.item.start_date, format, locale)
      const start_time: any = formatDate(this.item.start_date, time, locale)
      
      const finish_date: any = formatDate(this.item.finish_date, format, locale)
      const finish_time: any = formatDate(this.item.finish_date, time, locale)

      if(start_date && start_date != this.start_date)
        this.start_date = start_date
      
      if(start_time && start_time != this.start_time)
        this.start_time = start_time

      if(finish_date && finish_date != this.finish_date)
        this.finish_date = finish_date

      if(finish_time && finish_time != this.finish_time)
        this.finish_time = finish_time

      // console.log('this.item.start_date', this.item.start_date)
      // console.log('this.item.finish_date', this.item.finish_date)
      // console.log('this.start_date', this.start_date)
      // console.log('this.finish_date', this.finish_date)
      // this.form.controls.start_date.setValue(start_date)
      // this.form.controls.start_time.setValue(start_time)
      // this.form.controls.finish_date.setValue(finish_date)
      // this.form.controls.finish_time.setValue(finish_time)
      const t = (!this.init) ? 500: 0
      setTimeout(() => {
        this.defaultValue.next({
          start_date,
          start_time,
          finish_date,
          finish_time
        })
        
      }, t)

    }
  }

  getTime() {
    return TIME_LIST
  }

  delete() {
    this.deleted.emit(this.item)
  }

}
