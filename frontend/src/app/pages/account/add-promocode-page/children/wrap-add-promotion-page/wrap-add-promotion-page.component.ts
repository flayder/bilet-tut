import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IPromotionItem } from 'src/app/exports/interfaces/IPromotionItem';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-add-promotion-page]',
  templateUrl: './wrap-add-promotion-page.component.html',
  styleUrls: ['./wrap-add-promotion-page.component.css']
})
export class WrapAddPromotionPageComponent implements OnInit {

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  id: number = 0
  events: ISelectValue[] = []
  user: IUserItem
  element: IPromotionItem
  event_id: number = 0
  init = false

  form = new FormGroup({
    event: new FormControl<number>(0, [
      Validators.required
    ]),
    name: new FormControl<string>('', [
      Validators.required
    ]),
    type: new FormControl<string>('TEMPLATE', [
      Validators.required
    ]),
    start_date: new FormControl<string>('', [
      Validators.required
    ]),
    finish_date: new FormControl<string>('', [
      Validators.required
    ]),
    template: new FormControl<string>('TWONE'),
    template_descr: new FormControl<string>(''),
    fix_sum: new FormControl<string>(''),
    fix_count: new FormControl(''),
    dynamic_sum: new FormControl<string>(''),
    dynamic_count: new FormControl(''),
  })

  constructor(
    private event$: EventService,
    private user$: UserService,
    private message$: MessageService,
    private activate$: ActivatedRoute,
    private router$: Router,
    private modal$: ModalService
  ) { 
    this.activate$.params.subscribe(params => {
      if(params.hasOwnProperty('id') && params.id > 0) {
        this.id = params.id
        this.event$.admin.getPromotionDetail(this.id).subscribe((response: IHttpResponse) => {
          if(response.results) {

            for(let key in response.results) {
              const control = this.form.get(key)
              if(control) {
                if(key != "event")
                  control.setValue(response.results[key])
                // else
                //   control.setValue(response.results[key].id)
              }
            }
            this.element = response.results

            if(this.element.event.id) {
              this.event_id = this.element.event.id
            }

            setTimeout(() => {
              this.defaultValue.next(this.element)
            }, 1500)
          }
        })
      }
    })

    this.user$.user.subscribe(user => {
      if(typeof user == "object") {
        this.user = user
        this.event$.getList({user: user.id}).subscribe((response: IHttpResponse) => {
          if(Array.isArray(response.results)) {
            const arr: ISelectValue[] = []
            response.results.map((item: IEventItem) => {
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

  ngOnInit(): void {
  }

  delete() {
    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == id$) {
        this.event$.admin.deletePromotion(this.id).subscribe(respoense => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.event$.getPromotions()
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Промоакция успешно удалена'
            })
          }, 200)
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: id$,
      type: 'delete',
      text: 'Вы действительно хотите удалить промоакцию?',
      buttonText: 'Удалить'
    })
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('fieldsDefault', this.form)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      if(this.id <= 0) {
        this.event$.admin.addPromotion(this.form.value).subscribe(response => {
          this.message$.handle("Промоакция успешно добавлена", "success")
          this.router$.navigateByUrl("/account/promocode")
        })
      } else {
        this.event$.admin.updatePromotion(this.id, this.form.value).subscribe(response => {
          this.message$.handle("Промоакция успешно обновлена", "success")
          this.router$.navigateByUrl("/account/promocode")
        })
      }
    }
  }

}
