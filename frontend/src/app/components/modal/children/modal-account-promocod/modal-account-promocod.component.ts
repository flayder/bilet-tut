import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { GetEventLocalStorageData } from 'src/app/exports/functions/GetEventLocalStorageData';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IModalTypeParams } from 'src/app/exports/interfaces/IModalTypeParams';
import { ModalType } from 'src/app/exports/types/ModalType';
import { BaoService } from 'src/app/services/bao.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-modal-account-promocod]',
  templateUrl: './modal-account-promocod.component.html',
  styleUrls: ['./modal-account-promocod.component.css']
})
export class ModalAccountPromocodComponent implements OnInit {

  @Output() data = new EventEmitter<ModalType>()
  @Input() params: IModalTypeParams

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  color: string = ""
  id: number = 0
  event: any = false

  form = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required
    ]),
    start_date: new FormControl<string>('', [
      Validators.required
    ]),
    finish_date: new FormControl<string>('', [
      Validators.required
    ]),
    count: new FormControl<number>(0, [
      Validators.required
    ]),
    value: new FormControl<number>(0, [
      Validators.required
    ]),
    point: new FormControl<string>('cash', [
      Validators.required
    ]),
  })

  constructor(
    private bao$: BaoService,
    private message$: MessageService,
    private user$: UserService
  ) { }

  changePoint(type: string) {
    this.form.controls.point.setValue(type)
  }

  ngOnInit(): void {
    if(this.params.type == "account-promocod-tiny") {
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
        this.bao$.getDiscount(this.params.params.id)
          .subscribe((response: IHttpResponse) => {
            if(response.results) {
              if(typeof response.results == "object") {
                for(let key in response.results) {
                  const control = this.form.get(key)
                  if(control) {
                    control.setValue(response.results[key])
                  }

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

      this.bao$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      const user: any = typeof this.user$.currentUser == "object" ? this.user$.currentUser : {}

      if(
        typeof this.params.params && 
        this.params.params.hasOwnProperty('edit') &&
        this.params.params.edit
      ) {
        this.bao$.updateDiscount(this.id, this.form.value).subscribe(response => {
          this.message$.handle('Промокод успешно обновлен', 'success')
          this.data.emit('account-promocod-tiny')
          this.bao$.getDiscounts({event__pk: this.event, user: user.id})
        })
      } else {
        const params: any = this.form.value

        if(this.event > 0) {
          params.event = this.event
        }

        this.bao$.addDiscount(params).subscribe(response => {
          this.message$.handle('Промокод успешно добавлен', 'success')
          this.data.emit('account-promocod-tiny')
          this.bao$.getDiscounts({event__pk: this.event, user: user.id})
        })
      }
    }
  }

  close(event: any) {
    event.preventDefault()
    this.data.emit('account-promocod-tiny')
  }

}
