import { formatDate } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IDateItem } from 'src/app/exports/interfaces/IDateItem';

declare var $: any

@Component({
  selector: '[data-app-date-buy]',
  templateUrl: './date-buy.component.html',
  styleUrls: ['./date-buy.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DateBuyComponent implements AfterContentInit {

  format = 'yyyy-MM-dd'
  time = 'HH:mm'
  locale = 'en-US' 

  id$ = RandomStringFunction()
  @Input() items: IDateItem[] = []
  @Input() select_date: IDateItem
  @Output() data = new EventEmitter()

  constructor() { }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.init()
    }, 10)
  }

  init() {
    /* Датапикер */
    $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        currentText: 'Сегодня',
        prevText: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="#7A828A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        nextText: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 16L13 10L7 4" stroke="#7A828A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekHeader: 'Не',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);
    const datepicker: any = $(`#${this.id$}`)
    datepicker.datepicker({
        showOtherMonths: true,
        minDate: 0,
        beforeShowDay: (date: Date) => {
          if(this.items.filter((item: IDateItem) => formatDate(item.start_date, this.format, this.locale) == formatDate(date, this.format, this.locale)).length > 0) {
            return [true, 'selectable']
          }
            
          return [false, '']
        }
    }).on('change', (el:any) => {
      this.data.emit(el.currentTarget.value)
    })
    
    if(this.select_date) {
      datepicker.datepicker('setDate', new Date(this.select_date.start_date))
    } 
  }

}
