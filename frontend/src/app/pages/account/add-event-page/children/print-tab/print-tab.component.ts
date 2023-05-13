import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { EVENT_SUBJECT, HTTP_PROTOCOL, SITE_URL } from 'src/app/exports/constans';
import { ConfigurateFormData } from 'src/app/exports/functions/ConfigurateFormData';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IImageItem } from 'src/app/exports/interfaces/IImageItem';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-print-tab]',
  templateUrl: './print-tab.component.html',
  styleUrls: ['./print-tab.component.css']
})
export class PrintTabComponent implements OnInit {

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  id = 0
  event: any = false

  image: any
  attention: string = ''
  returning: string = ''
  description: string = ''
  returning_text = `При переносе Мероприятия – возврат не осуществляется согласно постановлению Правительства РФ от 06 июня 2020г. №830, билеты остаются действительны.\n
  Сервисный сбор возврату не подлежит согласно оферте.\n
  Возврат или замена электронных билетов возможна в случае отмены, замены или переноса мероприятия на условиях , установленных офертой.\n
  За возвратом билета обращаться в ООО «Билет тут» bilet-tut.ru/account/return\n
  С условиями оферты вы можете ознакомится на сайте bilet-tut.ru/public-offert\n
  \n
  Сумма возврата, в случае отказа посетителя от посещения Мероприятия по его инициативе:\n
   ·  в случае обращения не позднее чем за 10 (десять) дней до даты мероприятия– 100% от номинальной стоимости билета;\n
   ·  в случае обращения менее чем за 10 (десять) но не позднее чем за 5 (пять) дней до даты мероприятия – 50% от номинальной стоимости билета;\n
   ·  в случае обращения менее чем за 5 (пять) но не позднее чем за 3 (три) дня до даты мероприятия – 30% от номинальной стоимости билета;\n
   ·  в случае обращения менее чем за 3 дня до даты мероприятия – денежные средства не возвращаются.`
  
  attention_text = `Вся страница является электронным билетом.\n
  ·  Вход на мероприятие по билету возможен только один раз и только одному человеку.\n
  ·  Не приобретайте электронные билеты с рук.\n
  ·  Не допускайте копирования электронного билета.\n
  ·  При посещении мероприятия организатор вправе потребовать предъявить паспорт или иной документ, удостоверяющий личность владельца билета.\n
  ·  На мероприятие запрещено проносить с собой и использовать профессиональную аудио и видеоаппаратуру, спиртные напитки, которые могут нанести вред другим посетителям мероприятия.`


  form = new FormGroup({
    image: new FormControl(null),
    attention: new FormControl<string>(''),
    is_attention: new FormControl(false),
    returning: new FormControl<string>(''),
    is_returning: new FormControl(false),
    description: new FormControl<string>(''),
    is_description: new FormControl(false),
  })

  constructor(
    private event$: EventService,
    //private message$: MessageService,
    private param$: ActivatedRoute,
    private modal$: ModalService,
    private dom$: DomSanitizer
  ) {

    this.param$.params.subscribe(par => {
      if(
        typeof par == "object" && 
        par.hasOwnProperty('event_id') &&
        par.event_id > 0
      ) {
        this.event = par.event_id
      }
    })

    this.form.controls.image.valueChanges.subscribe((val: any) => {
      this.image = val
    })
    this.form.controls.attention.valueChanges.subscribe((val: any) => {
      this.attention = val
    })
    this.form.controls.returning.valueChanges.subscribe((val: any) => {
      this.returning = val
    })
    this.form.controls.description.valueChanges.subscribe((val: any) => {
      this.description = val
    })

    this.event$.getMailTemplates({event: this.event}).subscribe((response: IHttpResponse) => {
      if(
        Array.isArray(response.results) && 
        response.results.length > 0 && 
        response.results[0].id
      ) {
        this.id = response.results[0].id

        //console.log('response.results[0]', response.results[0])

        setTimeout(() => {
          this.defaultValue.next(response.results[0])
        }, 1000)
        
      }
    })
  }

  ngOnInit(): void {
    setTimeout(() => {
      if(!this.id) {
        this.defaultValue.next({
          attention: this.attention_text,
          returning: this.returning_text
        })
      }
    }, 1000)
  }

  setText(text: any) {
    return text.replace(/\n/gi, "<br/>")
  }

  getImage() {
    if(this.image instanceof File) {
      return this.dom$.bypassSecurityTrustUrl(new String((window.URL ? URL : webkitURL).createObjectURL(this.image)).replace(HTTP_PROTOCOL + SITE_URL, "null"))
    } else if(this.image && typeof this.image == "object" && this.image.hasOwnProperty('id')) {
      const image: IImageItem = this.image
      return image.image.medium
    }

    return false
  }

  complete() {
    EVENT_SUBJECT.next({})
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

      const params: any = this.form.value
      if(this.id == 0 && this.event > 0) {
        params.event = this.event
      }

      const data: any = ConfigurateFormData(params)

      if(this.id == 0) { 
        this.event$.addMailTemplate(data).subscribe((response: IHttpResponse) => {
          if(response.results > 0) {
            this.id = response.results
          }
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Шаблон был успешно создан'
          })
        })
      } else {
        this.event$.updateMailTemplate(this.id, data).subscribe((response: IHttpResponse) => {
          if(response.results > 0) {
            this.id = response.results
          }
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Шаблон был успешно обновлен'
          })
        })
      }
    }
  }

}
