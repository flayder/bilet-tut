import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { FORM_ERRORS, HTTP_PROTOCOL, SITE_URL } from 'src/app/exports/constans';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: '[data-app-photo-component]',
  templateUrl: './photo-component.component.html',
  styleUrls: ['./photo-component.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PhotoComponentComponent),
    multi: true
  }]
})
export class PhotoComponentComponent implements AfterContentInit, AfterViewInit {

  @Input() defaultValue = new Subject()
  @Input() inputErrors = new Subject()
  @Input() submitSubject: Subject<any> = new Subject()

  @Input() formControlName: string
  @Input() multiple: boolean = false
  @Output() onFile = new EventEmitter()
  @Output() onDelete = new EventEmitter()
  @ViewChild('element') selectRef: ElementRef
  @Input() c: FormControl = new FormControl()
  @Input() value: any = []
  disabled: boolean = false
  private innerValue: any = []
  errors: Array<any> = []

  $id = RandomStringFunction()

  constructor(
    private message$: MessageService,
    private dom$: DomSanitizer
  ) { }

  ngAfterContentInit(): void {
    // if(this.innerValue != this.value) {
    //   this.innerValue = this.value
    //   this.propagateChange(this.value)
    // }
  }

  ngAfterViewInit(): void {
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
        something[this.formControlName]
      ) {
        const file = something[this.formControlName]
        if(typeof file == "object") {
          this.update([file])
        } else if(Array.isArray(file)) {
          if(!this.multiple) {
            this.update([file[0]])
          } else {
            this.update(file)
          }
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

  fileCorrector(file: any) {
    if(file.hasOwnProperty('small')) {
      this.update(file)
    } else if(
      file.hasOwnProperty('image') && 
      typeof file.image == "object" &&
      file.image.hasOwnProperty('small')
    ) {
      this.update(file.image.small)
    }
  }

  change(file: any) {
    this.fileHandler(file.target.files)
  }

  delete(key: any) {
    if(this.value[key] != undefined) {
      const val = this.value
      const deleted = val[key]
      val.splice(key, 1)
      this.value = val
      this.onDelete.emit(deleted)
    }
    
  }

  dragover(event: any) {
    event.preventDefault()
    event.stopPropagation()
    // console.log('dragover', event.dataTransfer.files)
  }

  drop(event: any) {
    event.preventDefault()
    event.stopPropagation()
    this.fileHandler(event.dataTransfer.files)
  }

  isPhotoExist() {
    return Array.isArray(this.value) && this.value.length > 0
  }

  fileHandler(file: File[]) {
    if(file.length > 0) {
      let correct = true
      let i = 0
      let values = []
      if(this.multiple) {
        values = this.value
      }
      while(file[i] != undefined) {
        if(!ErrorHandlerClass.fileErrors(file[i], this.message$)) {
          values.push(file[i])
        } else
        correct = false
        i++
      }
      if(correct) {
        this.value = values
        this.update(this.value)
      }
    }
  }

  getUrl(file: any) {
    
    if(file instanceof File)
      return this.dom$.bypassSecurityTrustUrl(new String((window.URL ? URL : webkitURL).createObjectURL(file)).replace(HTTP_PROTOCOL + SITE_URL, "null"))
    else if(typeof file == "object") {
      if(file.hasOwnProperty('image') && typeof file.image == "object" && file.image.hasOwnProperty('small')) {
        return file.image.small
      } else if(file.hasOwnProperty('small')) {
        return file.small
      } else
        return ''
    } else if (file.indexOf('http') !== -1) {
      return file
    }

    return ''
  }

  getParam(value: any, name: string) {
    if(value[name] != undefined)
      return value[name]
    
    return ''
  }

  update(value: any) {
    this.innerValue = value
    this.value = value
    if(!this.multiple && Array.isArray(value)) {
      this.propagateChange(value[0])
      this.onFile.emit(value[0])
    } else {
      this.propagateChange(value)
      this.onFile.emit(value)
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
