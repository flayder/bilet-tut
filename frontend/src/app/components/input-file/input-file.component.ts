import {Component, ElementRef, forwardRef, ViewChild, Input, AfterContentInit, Output, EventEmitter} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, FormGroup} from "@angular/forms";
import {FORM_ERRORS} from "../../exports/constans";
import {Subject} from "rxjs";
import {ErrorHandlerClass} from "../../exports/classes/ErrorHandlerClass";
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { MessageService } from 'src/app/services/message.service';

declare var $: any

@Component({
  selector: 'div[data-app-input-file]',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputFileComponent),
    multi: true
  }]
})

export class InputFileComponent implements ControlValueAccessor, AfterContentInit {

  @Input() form: FormGroup
  @Input() submitSubject: Subject<any> = new Subject()
  @Input() disabled: boolean = false
  @Input() class: string
  @Input() formControlName: string
  @Input() c: FormControl = new FormControl()
  @Input() inputErrors = new Subject()
  @Output() data = new EventEmitter()
  @Input() defaultValue: Subject<any> = new Subject()
  @Input() value: any = null

  //@ViewChild('input') inputRef: ElementRef

  $id = RandomStringFunction()

  private innerValue: any = ""
  errors: Array<any> = []

  constructor(
    private message$: MessageService
  ) { }

  ngAfterContentInit() {
    this.inputErrors.subscribe((errors: any) => {
      for(let err in errors) {
        if(err == this.formControlName) {
          if(Array.isArray(errors[err])) {
            errors[err].map((strErr: string) => {
              this.message$.handle(strErr, "error")
            })
          } else if(errors[err]) {
            this.message$.handle(errors[err], "error")
          }
        }
      }
    })
    this.defaultValue.subscribe((something: any) => {
      if(
        typeof something == "object" &&
        something.hasOwnProperty(this.formControlName)
      )
        this.update(something[this.formControlName])
    })
    this.submitSubject.subscribe(click => {
      this.update(this.value)
    })
  }

  update(value: any) {
    if(this.form && value) {
      console.log('value', value)
      const file: any = {}
      file[this.formControlName] = value
      this.form.patchValue(file)
      this.data.emit(value)
    }
    

    this.errors = ErrorHandlerClass.process(this.c.errors, FORM_ERRORS)
  }

  setFile(files: any) {
    this.update(files.target.files[0])
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
