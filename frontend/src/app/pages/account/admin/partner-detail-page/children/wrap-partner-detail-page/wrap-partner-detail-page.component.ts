import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { ORGANISATION_LIST, PHONE_REG_EXP } from 'src/app/exports/constans';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-partner-detail-page]',
  templateUrl: './wrap-partner-detail-page.component.html',
  styleUrls: ['./wrap-partner-detail-page.component.css']
})
export class WrapPartnerDetailPageComponent implements OnInit {

  user: IUserItem
  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  photo: any = false

  form = new FormGroup(
    {
      photo: new FormControl<string>(''),
      organisation_name: new FormControl<string>(''),
      ogrn: new FormControl<string>(''),
      inn: new FormControl<string>(''),
      kpp: new FormControl<string>(''),
      tax: new FormControl<number>(0),
      username: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      phone: new FormControl<string>('', [
        Validators.pattern(PHONE_REG_EXP),
        Validators.required
      ]),
      surname: new FormControl<string>('', [
        Validators.minLength(4),
      ]),
      lastname: new FormControl<string>('', [
        Validators.minLength(4),
      ]),
      email: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      org_name_pref: new FormControl(''),
    },
  )

  constructor(
    private params$: ActivatedRoute,
    private user$: UserService,
    private account$: AccountService,
    private message$: MessageService,
    private modal$: ModalService
  ) { 
    this.account$.registerResponse.subscribe(response => {
      this.modal$.open('notification-tiny', {
        type: 'success',
        text: 'Данные успешно обновлены'
      })
      //this.message$.handle('Данные успешно обновлены', 'success')
    })

    this.params$.params.subscribe(params => {
      if(typeof params == "object" && params.hasOwnProperty('id')) {
        this.user$.admin.getUserDetail(params.id)
          .subscribe((response: IHttpResponse) => {
            this.user = response.results
            setTimeout(() => {
              this.defaultValue.next(this.user)
            }, 1000)
          })
      }
    })
  }

  getOrganisationSelectDefault() {
    return ORGANISATION_LIST
  }

  ngOnInit(): void {
  }

  setActive(active: boolean, event: any) {
    event.preventDefault()
    
    this.account$.updateUser(this.user.id, {is_active: active})
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    //console.log('this.form.value', this.form.value)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const data = new FormData
      for(let f in this.form.value) {
        let fields: any = this.form.value
        data.append(f, fields[f])
      }
      
      this.account$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      this.account$.updateUser(this.user.id, data)
    }
  }

}
