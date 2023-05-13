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
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-modal-account-price]',
  templateUrl: './modal-account-price.component.html',
  styleUrls: ['./modal-account-price.component.css']
})
export class ModalAccountPriceComponent implements OnInit {

  @Output() data = new EventEmitter<ModalType>()
  @Input() params: IModalTypeParams

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
    color: new FormControl<string>(''),
    up_price: new FormControl<boolean>(false),
    raising: new FormControl<number>(0),
    date_to: new FormControl<string>('')
  })

  getColor(color: any) {
    this.form.controls.color.setValue(color)
    this.color = color
  }

  constructor(
    private event$: EventService,
    private message$: MessageService,
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
    if(this.params.type == "account-price-tiny") {
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
        this.event$.getPriceDetail(this.params.params.id)
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
        const params: any = this.form.value

        if(!params.raising) 
          params.raising = 0

        this.event$.updatePrice(this.id, params).subscribe(response => {
          this.message$.handle('Цена успешно обновлена', 'success')
          this.data.emit('account-price-tiny')
          this.event$.getPrice({event__pk: this.event})
        })
      } else {
        const params: any = this.form.value

        if(this.event > 0) {
          params.event = this.event
        }

        this.event$.addPrice(params).subscribe(response => {
          this.message$.handle('Цена успешно добавлена', 'success')
          this.data.emit('account-price-tiny')
          this.event$.getPrice({event__pk: this.event})
        })
      }
    }
  }

  close(event: any) {
    event.preventDefault()
    this.data.emit('account-price-tiny')
  }

}
