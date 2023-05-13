import {Component, ElementRef, forwardRef, ViewChild, Input, AfterViewInit, AfterContentInit, AfterViewChecked, OnInit, Output, EventEmitter} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl} from "@angular/forms";
import {FORM_ERRORS} from "../../exports/constans";
import {Subject} from "rxjs";
import {ErrorHandlerClass} from "../../exports/classes/ErrorHandlerClass";
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';

declare var $: any
declare var jcf: any

@Component({
  selector: 'div[data-app-input-date]',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputDateComponent),
    multi: true
  }]
})
export class InputDateComponent implements ControlValueAccessor, AfterContentInit, AfterViewInit {

  @Input() dateIsOpen = false
  @Input() defaultValue: Subject<any> = new Subject()
  @Input() submitSubject: Subject<any> = new Subject()
  @Input() disabled: boolean = false
  @Input() type: string = 'text'
  @Input() is_count: boolean = false
  @Input() setClass: string
  @Input() placeholder: string = "ДД.ММ.ГГГГ"
  @Input() formControlName: string
  @Input() c: FormControl = new FormControl()
  @Input() value: any = null
  @Input() inputErrors: Subject<object> = new Subject()
  @Output() data = new EventEmitter()

  @ViewChild('input') inputRef:ElementRef

  $id = RandomStringFunction()

  private innerValue: any

  errors: Array<any> = []

  constructor() { }

  ngAfterContentInit(): void {
    if(this.innerValue && this.value && this.innerValue != this.value) {
      this.innerValue = this.value
      this.propagateChange(this.value)
    }
    
    this.defaultValue.subscribe((something: any) => {
      if(
        typeof something == "object" &&
        something.hasOwnProperty(this.formControlName) &&
        something[this.formControlName] && 
        something[this.formControlName] != null &&
        something[this.formControlName] != 'null'
      ) {
        this.update(something[this.formControlName])
        $(`#${this.$id}`).val(this.correctFormat(something[this.formControlName]))
      }
    })
  }

  ngAfterViewInit() {
    this.inputErrors.subscribe((errors: any) => {
      for(let err in errors) {
        if(err == this.formControlName) {
          const e = []
          if(Array.isArray(errors[err])) {
            errors[err].map((strErr: string) => {
              e.push(strErr)
            })
          } else if(errors[err]) {
            e.push(errors[err])
          }
          this.errors = e
        }
      }
    })
    if ($(`#${this.$id}`).length) {
      if(!this.is_count)
        this.datepickerInit()
      else {
        setTimeout(() => {
          jcf.setOptions('Number', {
            fakeStructure: '<span class="jcf-number"><span class="jcf-btn-dec"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13" 0000000 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="jcf-btn-inc"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13" stroke="#7A828A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 8H13"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>',
          });
  
          jcf.replace($(`#${this.$id}`)[0])
          $(`#${this.$id}`).val(this.value)
          $(`#${this.$id}`).on('change', (el: any) => {
            this.update(el.currentTarget.value)
          })
        }, 200)
      }
    }
    this.submitSubject.subscribe(click => {
      let value
      if(this.innerValue != "")
        value = this.innerValue
      else
        value = this.value
      this.update(value)
    })
  }

  datepickerInit() {
    const $this = this
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
      showMonthAfterYear: this.dateIsOpen,
      yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);
    const data: any = {
      showOtherMonths: true
    }
    if(!this.dateIsOpen)
      data['minDate'] = 0
    else {
      data['changeYear'] = true
      data['changeMonth'] = true
      data['viewMode'] = 'years'
      //data['showButtonPanel'] = true
      data['yearRange'] = "-100:+0"
    }
    /* Датапикер Одиночный*/
    $(`#${this.$id}`).datepicker(data)
      .on('change', (el:any) => {
        const value = $this.getValue()
        if(el.currentTarget.value) {
          $this.update(value)
        } else {
          $this.update('')
        }
      })
    
    const defaultValue = $(`#${this.$id}`).datepicker('getDate')
    if(this.value && defaultValue != this.value) {
      $this.setValue(this.value)
    }
  }

  focus() {
    if(this.dateIsOpen) {
      setTimeout(() => {
        $('#ui-datepicker-div').addClass('open-year')
      }, 200)
    }
  }

  correctFormat(date: any, format = false) {
    const today = new Date(date)
    const yyyy = today.getFullYear()
    let mm: any = today.getMonth() + 1
    let dd: any = today.getDate()
    if(dd < 10) {
      dd = '0' + dd
    }

    if(mm < 10) {
      mm = '0' + mm
    }
      
    if(!format)
      return `${dd}.${mm}.${yyyy}`
    else
      return `${yyyy}-${mm}-${dd}`
  }

  setValue(value: any) {
    const date: any = this.correctFormat(value)
    $(`#${this.$id}`).datepicker('setDate', date)
  }

  getValue() {
    const val = $(`#${this.$id}`).datepicker('getDate')
    const value: any = this.correctFormat(val, true)
    return value    
  }

  update(value: any) {
    this.innerValue = value
    this.value = value
    this.propagateChange(value)
    this.data.emit(value)
    const val = this.getValue()
    if(val != this.value) {
      this.setValue(this.value)
    }
    this.errors = ErrorHandlerClass.process(this.c.errors, FORM_ERRORS)
    
  }

  //propagate changes into the custom form control
  propagateChange = (_: any) => { }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    this.innerValue = value;
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {

  }

}
