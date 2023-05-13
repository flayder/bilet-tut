import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { BaoService } from 'src/app/services/bao.service';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-add-promocode-page]',
  templateUrl: './wrap-add-promocode-page.component.html',
  styleUrls: ['./wrap-add-promocode-page.component.css']
})
export class WrapAddPromocodePageComponent implements AfterContentInit {

  events: ISelectValue[] = []
  user: IUserItem

  type: ISelectValue[] = [
    {
      name: "Процент",
      value: "percent"
    },
    {
      name: "Точная сумма",
      value: "cash"
    },
  ]

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  id: number = 0
  event: IEventItem

  form = new FormGroup({
    event: new FormControl<number>(0, [
      Validators.required
    ]),
    name: new FormControl<string>('', [
      Validators.required
    ]),
    active: new FormControl<boolean>(true),
    start_date: new FormControl<string>('', [
      Validators.required
    ]),
    finish_date: new FormControl<string>('', [
      Validators.required
    ]),
    count: new FormControl<string>(''),
    value: new FormControl<string>(''),
    point: new FormControl<string>(''),
  })


  constructor(
    private event$: EventService,
    private bao$: BaoService,
    private user$: UserService,
    private message$: MessageService,
    private router$: Router,
    private activate$: ActivatedRoute,
    private modal$: ModalService
  ) { 
    this.activate$.params.subscribe(params => {
      if(params.hasOwnProperty('id') && params.id > 0) {
        this.id = params.id
        this.bao$.getDiscount(this.id).subscribe((response: IHttpResponse) => {
          if(response.results) {
            this.event = response.results

            for(let key in response.results) {
              const control = this.form.get(key)
              if(control) {
                control.setValue(response.results[key])
              }
            }
            setTimeout(() => {
              this.defaultValue.next(this.event)
            }, 1000)
          }
        })
      }
    })
    this.user$.user.subscribe((user: any) => {
      if(user) {
        this.user = user
        this.event$.getList({user: user.id}).subscribe((response: IHttpResponse) => {
          if(Array.isArray(response.results)) {
            const events: IEventItem[] = response.results
            const arr: ISelectValue[] = []
            events.map(item => {
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
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.defaultValue.next({active: true})
    }, 500)
  }

  delete() {
    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == id$) {
        this.bao$.deleteDiscount(this.id).subscribe(respoense => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.bao$.getDiscounts()
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Промокод успешно удален'
            })
          }, 200)
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: id$,
      type: 'delete',
      text: 'Вы действительно хотите удалить промокод?',
      buttonText: 'Удалить'
    })
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('fieldsDefault', this.form)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      if(this.id <= 0) {
        this.bao$.addDiscount(this.form.value).subscribe(response => {
          this.message$.handle("Промокод успешно добавлен", "success")
          this.router$.navigateByUrl("/account/promocode")
        })
      } else {
        this.bao$.updateDiscount(this.id, this.form.value).subscribe(response => {
          this.message$.handle("Промокод успешно обновлен", "success")
          this.router$.navigateByUrl("/account/promocode")
        })
      }
    }
  }

}
