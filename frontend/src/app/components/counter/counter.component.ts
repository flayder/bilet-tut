import {Component, ElementRef, forwardRef, ViewChild, Input, AfterContentInit, Output, EventEmitter} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl} from "@angular/forms";
import {FORM_ERRORS} from "../../exports/constans";
import {Subject} from "rxjs";
import {ErrorHandlerClass} from "../../exports/classes/ErrorHandlerClass";
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';

declare var $: any
declare var jcf: any

@Component({
  selector: '[data-app-counter]',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CounterComponent),
    multi: true
  }]
})

export class CounterComponent implements ControlValueAccessor, AfterContentInit {

  @Input() submitSubject: Subject<any> = new Subject()
  @Input() defaultValue: Subject<any> = new Subject()
  @Input() disabled: boolean = false
  @Input() setClass: string
  @Input() placeholder: string = ''
  @Input() formControlName: string
  @Input() c: FormControl = new FormControl()
  @Input() value: number = 1
  @Input() min_length: number = 0
  @Input() max_length: number = 200
  @Input() setErrors = new Subject()
  @Input() inputErrors: Subject<object> = new Subject()
  @Output() data = new EventEmitter()
  selectedSuggestion: ISelectValue
  is_chosen: boolean = false
  initiat: boolean = false

  @ViewChild('input') inputRef: ElementRef

  private innerValue: any = ""
  errors: Array<any> = []
  $id = RandomStringFunction()

  constructor() { }

  ngAfterContentInit() {
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

    this.defaultValue.subscribe((something: any) => {
      if(
        typeof something == "object" &&
        something.hasOwnProperty(this.formControlName) &&
        something[this.formControlName] && 
        something[this.formControlName] != null &&
        something[this.formControlName] != 'null'
      ) {
        this.update(something[this.formControlName])
      }
    })

    this.submitSubject.subscribe(click => {
      let value
      if(this.innerValue != "")
        value = this.innerValue
      else
        value = this.value

      if(!this.is_chosen)
        this.update(value)
    })

    this.setErrors.subscribe((items: any) => {
      setTimeout(() => {
        if(Array.isArray(items)) {
          this.errors = items
        }
      }, 100)
    })
    if(this.innerValue != this.value) {
      this.innerValue = this.value
      this.propagateChange(this.value)
      this.data.emit(this.value)
    }
    setTimeout(() => {
      
      this.init()
    }, 500)
  }

  init() {
    jcf.setOptions('Number', {
      fakeStructure: '<span class="jcf-number"><span class="jcf-btn-dec"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13" 0000000 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="jcf-btn-inc"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13" stroke="#7A828A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 8H13"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>',
    });

    jcf.replace($(`#${this.$id}`)[0])

    $(`#${this.$id}`).on('change', (el: any) => {
      const value = el.currentTarget.value
      
      if(value <= this.max_length)
        this.update(value)
      else
        $(el.currentTarget).val((value > this.max_length) ? this.max_length : 1)
    })

    this.initiat = true
  }

  update(value: any, event: any = null) {
    if(value > this.max_length) {
      $(`#${this.$id}`).val(this.max_length)
      return
    }

    if(value < this.min_length) {
      $(`#${this.$id}`).val(this.min_length)
      return
    }

    if(value < 0) {
      value = value * -1
    }

    if(event instanceof KeyboardEvent || value instanceof String || value instanceof Number || !value) {
      this.errors = ErrorHandlerClass.process(this.c.errors, FORM_ERRORS)
    }

    value = parseInt(value)

    this.propagateChange(value)
    this.data.emit(value)
    this.value = value
    this.innerValue = value
  
    if(event instanceof KeyboardEvent || value instanceof String || value instanceof Number || !value) {
      this.errors = ErrorHandlerClass.process(this.c.errors, FORM_ERRORS)
    }

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
