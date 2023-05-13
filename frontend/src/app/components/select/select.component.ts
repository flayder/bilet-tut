import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { FORM_ERRORS } from 'src/app/exports/constans';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { BilethttpService } from 'src/app/services/bilethttp.service';

declare var $: any
declare var jcf: any

@Component({
  selector: 'div[data-app-select]',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }]
})
export class SelectComponent implements AfterContentInit, AfterViewInit {

  @Input() defaultValue = new Subject()
  @Input() inputErrors = new Subject()
  @Input() submitSubject: Subject<any> = new Subject()
  @Input() disabled: boolean = false
  @Input() formControlName: string
  @Input() values: Array<ISelectValue> = []
  @ViewChild('select') selectRef: ElementRef
  @Input() c: FormControl = new FormControl()
  @Input() value: any = ""
  @Input() placeholder: string = ""
  @Input() multiple: boolean = false
  @Output() data = new EventEmitter<any>()

  @Input() sugg_url: string = ""
  @Input() sugg_params: object = {}
  @Input() get_data: ISelectValue

  $id = RandomStringFunction()

  errors: Array<any> = []

  private innerValue: any = ""

  constructor(
    private http$: BilethttpService
  ) { }

  ngAfterContentInit(): void {
    if(this.value && this.innerValue != this.value) {
      // this.innerValue = this.value
      // this.propagateChange(this.value)
      // this.data.emit(this.value)
      this.update(this.value)
      this.refresh()
    }
    if(!this.placeholder && !this.innerValue && this.values.length > 0) {
      const val: any = this.values[0].value
      this.innerValue = val
      this.propagateChange(val)
      this.data.emit(val)
      //this.refresh()
    }

    if(this.sugg_url) {
      this.http$.get(this.sugg_url, this.sugg_params).subscribe((response: IHttpResponse) => {
        const elements: ISelectValue[] = []
        
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
            this.values = elements
            if(!this.placeholder) {
              this.update(this.values[0].value)
              this.refresh()
            }
          }
        }
      })
    }
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
        something.hasOwnProperty(this.formControlName)
      ) {
        let value = something[this.formControlName]

        if(value && typeof value == "object" && value.hasOwnProperty('id')) {
          value = value.id
        }
        
        this.update(value)
        this.refresh()
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

    this.refresh()
  }

  refresh() {
    setTimeout(() => {
      const elem = $(`#${this.$id}`)
      const params: any = {
        wrapNative: false,
        wrapNativeOnMobile: false,
        fakeDropInBody: false,
        maxVisibleItems: 5
      }
      if(this.multiple) {
        elem.attr('multiple', true)
        params.multipleCompactStyle = this.multiple
      }
      jcf.setOptions('Select', params)

      if(this.value) {
        if(this.value === true || this.value === false) 
          this.update(this.value ? 1 : 0)

        elem.val(this.value)
      }

      const inst = jcf.getInstance(elem[0])
      if(inst !== undefined) {
        inst.refresh()
      } else {
        jcf.replace(elem[0])
      }
    }, 200)
  }

  clearArr(arr: Array<any>) {
    const array: any = []
    arr.map(item => {
      if(item)
        array.push(item)
    })

    return array
  }

  change(event: any) {
    const el: any = $(`#${this.$id}`)
    let value: any = ''
    
    if(this.multiple) {
      value = this.clearArr(el.val())
    } else
      value = el.val()

    this.update(value)
  }

  update(value: any) {
    this.innerValue = value
    this.value = value
    this.propagateChange(value)
    this.data.emit(value)
    this.errors = ErrorHandlerClass.process(this.c.errors, FORM_ERRORS)
  }

  setValue(item: ISelectValue) {
    if(this.multiple && Array.isArray(this.value)) {
      if(this.value.includes(""+item.value)) {
        return true
      }
    }

    if(!this.multiple) {
      if(item.value == this.value)
        return true
    }

    return false
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
