import {Component, ElementRef, forwardRef, ViewChild, Input, AfterViewInit, AfterContentInit, AfterViewChecked, OnInit, Output, EventEmitter} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl} from "@angular/forms";
import {FORM_ERRORS} from "../../exports/constans";
import {Subject} from "rxjs";
import {ErrorHandlerClass} from "../../exports/classes/ErrorHandlerClass";
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';

declare var $: any
declare var jcf: any

@Component({
  selector: 'div[data-app-input-checkbox]',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputCheckboxComponent),
    multi: true
  }]
})
export class InputCheckboxComponent implements ControlValueAccessor, AfterContentInit, AfterViewInit {

  @Input() dateIsOpen = false
  @Input() defaultValue: Subject<any> = new Subject()
  @Input() submitSubject: Subject<any> = new Subject()
  @Input() disabled: boolean = false
  @Input() type: string = 'checkbox'
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
    if(this.innerValue != this.value) {
      this.innerValue = this.value
      this.propagateChange(!!this.value)
    }
    
    this.defaultValue.subscribe((something: any) => {
      if(
        typeof something == "object" &&
        something.hasOwnProperty(this.formControlName)
      ) {
        this.update(something[this.formControlName])
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
    this.submitSubject.subscribe(click => {
      let value
      if(this.innerValue != "")
        value = this.innerValue
      else
        value = this.value
      this.update(value)
    })
  }

  update(value: any) {
    value = !!value
    this.innerValue = value
    this.value = value
    this.propagateChange(value)
    this.data.emit(value)
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
