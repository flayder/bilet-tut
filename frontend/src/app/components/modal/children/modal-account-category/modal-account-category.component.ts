import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { GetEventLocalStorageData } from 'src/app/exports/functions/GetEventLocalStorageData';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IModalTypeParams } from 'src/app/exports/interfaces/IModalTypeParams';
import { ModalType } from 'src/app/exports/types/ModalType';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: '[data-app-modal-account-category]',
  templateUrl: './modal-account-category.component.html',
  styleUrls: ['./modal-account-category.component.css']
})
export class ModalAccountCategoryComponent implements OnInit {

  @Output() data = new EventEmitter<ModalType>()
  @Input() params: IModalTypeParams
  modalName: any = 'account-category-tiny'
  loader = true

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  color: string = ""
  id: number = 0
  event: any = false

  form = new FormGroup({
    price: new FormControl<number>(0, [
      Validators.required
    ]),
    name: new FormControl<string>('', [
      Validators.required
    ]),
    description: new FormControl<string>(''),
    color: new FormControl<string>(''),
    active: new FormControl<boolean>(false),
    count: new FormControl<number>(0, [
      Validators.required
    ])
  })

  getColor(color: any) {
    this.form.controls.color.setValue(color)
    this.color = color
  }

  constructor(
    private event$: EventService,
    private message$: MessageService
  ) { }

  ngOnInit(): void {
    if(this.params.type == this.modalName) {
      const items: any = GetEventLocalStorageData()

      if(
        typeof items == "object" &&
        items.id > 0 &&
        this.event != items.id
      )
        this.event = items.id

      if(
        typeof this.params.params && 
        this.params.params.hasOwnProperty('edit') &&
        this.params.params.edit
      )
      {
        this.event$.getAreaCategoryDetail(this.params.params.id)
          .subscribe((response: IHttpResponse) => {
            if(response.results) {
              if(typeof response.results == "object") {
                for(let key in response.results) {
                  const control = this.form.get(key)
                  if(control) {
                    control.setValue(response.results[key])
                  }
                  if(key == 'color')
                    this.color = response.results[key]

                  if(key == 'id')
                    this.id = response.results[key]
                }
              }
              setTimeout(() => {
                this.defaultValue.next(response.results)
              }, 300)
            }
        })
      }
    }

    
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('fieldsDefault', this.form)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {

      this.event$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      if(
        typeof this.params.params && 
        this.params.params.hasOwnProperty('edit') &&
        this.params.params.edit
      ) {
        this.event$.updateAreaCategory(this.id, this.form.value).subscribe(response => {
          this.message$.handle('Категория цен успешно обновлена', 'success')
          this.data.emit(this.modalName)
          this.event$.getAreaCategories({event__pk: this.event})
        })
      } else {
        const params: any = this.form.value

        if(this.event > 0)
          params.event = this.event

        this.event$.addAreaCategory(params).subscribe(response => {
          this.message$.handle('Категория цен добавлена', 'success')
          this.data.emit(this.modalName)
          this.event$.getAreaCategories({event__pk: this.event})
        })
      }
    }
  }

  close(event: any) {
    event.preventDefault()
    this.data.emit(this.modalName)
  }

}
