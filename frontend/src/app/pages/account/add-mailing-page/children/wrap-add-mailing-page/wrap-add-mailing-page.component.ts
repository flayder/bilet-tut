import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { TIME_LIST } from 'src/app/exports/constans';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { BaoService } from 'src/app/services/bao.service';
import { EventService } from 'src/app/services/event.service';
import { MailingService } from 'src/app/services/mailing.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-add-mailing-page]',
  templateUrl: './wrap-add-mailing-page.component.html',
  styleUrls: ['./wrap-add-mailing-page.component.css']
})
export class WrapAddMailingPageComponent implements AfterContentInit {

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()

  user: IUserItem
  users: ISelectValue[] = []

  time: ISelectValue[] = TIME_LIST
  events: ISelectValue[] = []
  toeveryone: boolean = false

  type: ISelectValue[] = [
    {
      name: "SMS",
      value: "sms"
    },
    {
      name: "Email",
      value: "email"
    }
  ]

  form = new FormGroup({
    date: new FormControl<string>('', [
      Validators.required
    ]),
    time: new FormControl<string>('', [
      Validators.required
    ]),
    events: new FormControl<Array<number>>([], [
      Validators.required
    ]),
    type: new FormControl<number>(0, [
      Validators.required
    ]),
    toeveryone: new FormControl<boolean>(false),
    text: new FormControl<string>('', [
      Validators.required
    ]),
    files: new FormControl<Array<File>>([]),
    user_list: new FormControl<Array<number>>([]),
  })

  constructor(
    private event$: EventService,
    private user$: UserService,
    private bao$: BaoService,
    private mailing$: MailingService,
    private message$: MessageService,
    private modal$: ModalService,
    private router$: Router
  ) { 
    this.user$.user.subscribe((user: any) => {
      if(typeof user == "object" && !this.user) {
        this.user = user
        this.event$.getList({
          user: user.id
        }).subscribe((results: IHttpResponse) => {
          if(Array.isArray(results.results)) {
            const arr: ISelectValue[] = []
            results.results.map((item: IEventItem) => {
              arr.push({
                name: item.name,
                value: item.id
              })
            })
            this.events = arr
          }
        })
      }
    })

    this.form.controls.toeveryone.valueChanges.subscribe(value => {
      if(value) {
        // console.log('v', value)
        // this.form.controls.user_list.setValidators([])
        this.toeveryone = true
      } else {
        this.toeveryone = false
      }
    })

    this.form.controls.events.valueChanges.subscribe((items: any) => {
      items.map((item: any, key: number) => {
        items[key] = parseInt(item)
      })
      this.bao$.getOrdersInfo(items).subscribe((response: IHttpResponse) => {
        if(Array.isArray(response.results) && response.results.length > 0) {
          const orders: IBasketItem[] = response.results
          const arr: ISelectValue[] = []
          orders.map((item: IBasketItem) => {
            if(item.user) {
              arr.push({
                name: `${item.user.email ? item.user.email : ''} ${item.user.phone ? item.user.phone : ''}`,
                value: item.user.id
              })
            }
          })

          this.users = arr
        } else {
          this.message$.handle("Список получателей пуст, по выбранным мероприятиям покупатели не найдены")
        }
      })
    })
  }

  ngAfterContentInit(): void {
    
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('fieldsDefault', this.form)
    if(!this.toeveryone && this.form.value.user_list && this.form.value.user_list.length == 0 || !this.toeveryone && !this.form.value.user_list) {
      this.message$.handle('Вы не выбрали отправителя')
      return
    }
    
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const form: any = this.form.value
      this.event$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })
      const data = new FormData
      for(let k in form) {
        if(k == "files") {
          if(Array.isArray(form[k])) {
            form[k].map((item: any, key: any) => {
              data.append(k + key, item)
            })
          }
        } else {
          if(Array.isArray(form[k])) {
            data.append(k, JSON.stringify(form[k]))
          } else {
            data.append(k, form[k])
          }
        }
      }

      this.mailing$.addMailing(data).subscribe(response => {
        this.modal$.open('notification-tiny', {
          type: 'success',
          text: 'Рассылка успешно создана'
        })
        //this.message$.handle("", "success")
        this.router$.navigateByUrl("/account/mailing")
        this.mailing$.getMailings()
      })

    }
  }

}
