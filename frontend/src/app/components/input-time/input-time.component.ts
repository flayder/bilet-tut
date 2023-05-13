import {Component, ElementRef, forwardRef, ViewChild, Input, AfterContentInit, Output, EventEmitter} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl} from "@angular/forms";
import {FORM_ERRORS} from "../../exports/constans";
import {Subject} from "rxjs";
import {ErrorHandlerClass} from "../../exports/classes/ErrorHandlerClass";
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';

declare var $: any

@Component({
  selector: 'div[data-app-input-time]',
  templateUrl: './input-time.component.html',
  styleUrls: ['./input-time.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputTimeComponent),
    multi: true
  }]
})

export class InputTimeComponent implements ControlValueAccessor, AfterContentInit {

  @Input() submitSubject: Subject<any> = new Subject()
  @Input() disabled: boolean = false
  @Input() type: string = 'text'
  @Input() setClass: string
  @Input() placeholder: string = "Введите данные"
  @Input() formControlName: string
  @Input() c: FormControl = new FormControl()
  @Input() value: any = ""
  @Input() sugg_url: string = ""
  @Input() sugg_params: object = {}
  @Input() get_data: ISelectValue
  @Input() inputErrors = new Subject()
  @Output() data = new EventEmitter()
  @Input() defaultValue: Subject<any> = new Subject()

  @ViewChild('input') inputRef: ElementRef

  $id = RandomStringFunction()

  private innerValue: any = ""
  errors: Array<any> = []

  constructor() { 
    $.mask.definitions['H'] = "[0-2]"
    $.mask.definitions['h'] = "[0-9]"
    $.mask.definitions['M'] = "[0-5]"
    $.mask.definitions['m'] = "[0-9]"
  }

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
        something.hasOwnProperty(this.formControlName)
      ) {
        this.update(something[this.formControlName])
        this.init()
      }
        
    })
    this.init()
    this.submitSubject.subscribe(click => {
      let value
      if(this.innerValue != "")
        value = this.innerValue
      else
        value = this.value
      this.update(value)
    })
    if(this.innerValue != this.value) {
      this.innerValue = this.value
      this.propagateChange(this.value)
    }
  }

  init() {
    const $this = this
    setTimeout(() => {
      const elem: any = $(`#${this.$id}`)
      elem.mask("Hh:Mm", {
        completed: function() {
          var currentMask = $(this).mask();
          if (isNaN(parseInt(currentMask))) {
              $(this).val("")
          } else if (parseInt(currentMask) > 2359) {
              $(this).val("23:59")
          }

          $this.update(elem.val())
        }
      })

      if(elem.val()) 
        this.update(elem.val())
        
    }, 200)
  }

  update(value: any) {
    if(event instanceof KeyboardEvent || value instanceof String || value instanceof Number || !value) {
      this.errors = ErrorHandlerClass.process(this.c.errors, FORM_ERRORS)
    }
    
    this.innerValue = value
    this.value = value
    this.propagateChange(value)
    this.data.emit(value)

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
