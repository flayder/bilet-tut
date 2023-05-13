import {Component, ElementRef, forwardRef, ViewChild, Input, AfterContentInit, Output, EventEmitter} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl} from "@angular/forms";
import {FORM_ERRORS} from "../../exports/constans";
import {Subject} from "rxjs";
import {ErrorHandlerClass} from "../../exports/classes/ErrorHandlerClass";
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { BilethttpService } from 'src/app/services/bilethttp.service';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';

declare var $: any

@Component({
  selector: '[data-app-input]',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})

export class InputComponent implements ControlValueAccessor, AfterContentInit {

  @Input() submitSubject: Subject<any> = new Subject()
  @Input() defaultValue: Subject<any> = new Subject()
  @Input() disabled: boolean = false
  @Input() type: string = 'text'
  @Input() setClass: string
  @Input() placeholder: string = ''
  @Input() formControlName: string
  @Input() c: FormControl = new FormControl()
  @Input() value: any = ""
  @Input() setErrors = new Subject()
  @Input() sugg_url: string = ""
  @Input() sugg_params: object = {}
  @Input() get_data: ISelectValue
  @Input() get_data_default: string = ''
  @Input() inputErrors: Subject<object> = new Subject()
  @Output() data = new EventEmitter()
  @Output() getSugg = new EventEmitter()
  selectedSuggestion: ISelectValue
  is_chosen: boolean = false

  @ViewChild('input') inputRef: ElementRef

  private innerValue: any = ""
  errors: Array<any> = []
  passwordShowing: boolean = false
  suggestions: Array<ISelectValue> = []
  $id = RandomStringFunction()

  constructor(
    private http: BilethttpService
  ) { }

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
        something[this.formControlName] != 'null' &&
        something[this.formControlName] != this.value
      ) {
        const value = something[this.formControlName]
        this.propagateChange(value)
        this.data.emit(value)
        this.value = value
        this.innerValue = value
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
    
    setTimeout(() => {
      if(this.innerValue != this.value) {
        this.innerValue = this.value
        this.propagateChange(this.value)
        this.data.emit(this.value)
      }
    }, 500)
  }

  getSuggestion(val: any) {
    //this.selectedSuggestion = val
    this.value = val.name
    this.innerValue = val.name
    this.is_chosen = true
    
    this.propagateChange(val.value)
    this.data.emit(val.value)
    this.getSugg.emit(val.value)
    this.suggestions = []

  }

  showPassword(is: boolean) {
    this.passwordShowing = is
  }

  setBlur(event: any) {
    setTimeout(() => {
      this.suggestions = []
    }, 200)
  }

  update(value: any, event: any = null) {
    if(event instanceof KeyboardEvent || value instanceof String || value instanceof Number || !value) {
      this.errors = ErrorHandlerClass.process(this.c.errors, FORM_ERRORS)
    }

    this.propagateChange(value)
    this.data.emit(value)
    this.value = value
    this.innerValue = value
  
    if(event instanceof KeyboardEvent || value instanceof String || value instanceof Number || !value) {
      this.errors = ErrorHandlerClass.process(this.c.errors, FORM_ERRORS)
    }

    this.setSuggestion()
  }

  setSuggestion() {
    if(this.sugg_url.length > 0 && this.errors.length == 0 && this.innerValue.length > 2) {
      const elements: any = []

      this.http.get(this.sugg_url, {
        search: this.innerValue,
        ...this.sugg_params
      }).subscribe((response: IHttpResponse) => {
        if(Array.isArray(response.results)) {
          response.results.map((item: any): void => {
            if(item.hasOwnProperty(this.get_data.name) && item.hasOwnProperty(this.get_data.value)) {
              elements.push({
                name: item[this.get_data.name],
                value: item[this.get_data.value]
              })
            }
          })
          if(elements.length) {
            this.suggestions = elements
          }
        }

        if(elements.length == 0 && this.suggestions.length > 0)
          this.suggestions = []
      })
    } else if(this.suggestions.length > 0)
      this.suggestions = []
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
