import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PassConfValidation} from "../../../components/validations/passconfvalidation";
import {Subject} from "rxjs";
import {ErrorHandlerClass} from "../../../exports/classes/ErrorHandlerClass";
import { ModalService } from 'src/app/services/modal.service';
import { UserRoleType } from 'src/app/exports/types/RoleUserType';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { MessageService } from 'src/app/services/message.service';

type typingType = "email" | "phone" | "soc"

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  typing: typingType = "email"
  role: UserRoleType = "viewer"
  clear: any

  registerFormEmailSubmit: Subject<any> = new Subject()
  authFormEmailSubmit: Subject<any> = new Subject()
  errorsRegister: Subject<any> = new Subject()
  errorsAuth: Subject<any> = new Subject()
  smscode: boolean = false
  user_id: number = 0

  registerFormEmail = new FormGroup(
    {
      login: new FormControl<string>(''),
      username: new FormControl<string>('', [
        Validators.minLength(4)
      ]),
      surname: new FormControl<string>('', [
        Validators.minLength(4)
      ]),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email
      ]),
      birthday: new FormControl<any>(''),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      policy: new FormControl<boolean>(true, [
        Validators.required
      ])
    },
    [PassConfValidation.MatchValidator('password', 'confirmPassword')]
  )

  setRole(role: UserRoleType) {
    this.role = role
  }

  authFormEmail = new FormGroup(
    {
      login: new FormControl<string>(''),
      username: new FormControl<string>('', [
        Validators.minLength(4)
      ]),
      surname: new FormControl<string>('', [
        Validators.minLength(4)
      ]),
      phone: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(9)
      ]),
      birthday: new FormControl<any>(''),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      policy: new FormControl<boolean>(true, [
        Validators.required
      ])
    },
    [PassConfValidation.MatchValidator('password', 'confirmPassword')]
  )

  constructor(
    private account$: AccountService,
    private modal$: ModalService,
    private message$: MessageService,
    private router$: Router,
    private user$: UserService
  ) {
    const token = localStorage.getItem('token')
    if(token) {
      this.router$.navigateByUrl("")
    }
  }

  setType(typing: typingType) {
    this.typing = typing
  }

  signUp(data: any) {
    this.account$.getErrors().subscribe(errors => {
      if(errors.error)
        this.errorsRegister.next(errors.error)
    })
    this.account$.registerResponse
      .subscribe(response => {
        if(response && response.results) {
          
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Вы успешно зарегистрировались, письмо с данными о регистрации отправлено на указанную почту почту'
          })

          this.router$.navigate(["auth"])
        }
      })
    this.account$.register({
      ...data,
      role: this.role
    })
  }

  signAuthUp(data: any) {
    this.account$.getErrors().subscribe(errors => {
      if(errors.error)
        this.errorsAuth.next(errors.error)
    })

    this.account$.registerResponse
      .subscribe(response => {
        if(response && response.results) {
          if(response.results > 0) {
            this.user_id = response.results
            this.user$.sendSmsCode(this.user_id).subscribe((response: IHttpResponse) => {})
            
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Вы успешно зарегистрировались, смс с кодом отправлен на указанный номер'
            })
  
            this.smscode = true
          }

          //this.router$.navigate(["auth"])
        }
      })

    this.account$.register({
      ...data,
      role: this.role
    })
  }

  registerOnChange(value: any) {}

  ngOnInit(): void {
  }

  emailFormSubmit() {
    this.registerFormEmailSubmit.next({})
    if(!ErrorHandlerClass.AnyErrors(this.registerFormEmail)) {
      const data = this.registerFormEmail.value
      data.login = data.email
      this.signUp(data)
    }
  }

  sendSms(sms: any) {
    if(this.user_id > 0) {
      this.user$.checkSms(this.user_id, sms).subscribe((response: IHttpResponse) => {
        if(response.results) {
          this.message$.handle("Номер телефона успешно подтвержден", "success")
          this.router$.navigate(["auth"])
        }
      })
    }
  }

  repeatSms(sms: any) {
    if(this.user_id > 0) {
      this.user$.sendSmsCode(this.user_id).subscribe((response: IHttpResponse) => {})
    }
  }

  authFormSubmit() {
    this.authFormEmailSubmit.next({})
    if(!ErrorHandlerClass.AnyErrors(this.authFormEmail)) {
      const data: any = this.authFormEmail.value
      data.phone = data.phone.replace(/[^0-9]/gi, "")
      data.login = data.phone
      clearTimeout(this.clear)

      this.clear = setTimeout(() => {
        this.signAuthUp(data)
      }, 200)
    }
  }

}
