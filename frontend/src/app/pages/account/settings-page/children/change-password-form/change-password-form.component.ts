import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { PassConfValidation } from 'src/app/components/validations/passconfvalidation';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-change-password-form]',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.css']
})
export class ChangePasswordFormComponent implements OnInit {

  formSubmit = new Subject()
  defaultValue = new Subject()
  errors: Subject<object> = new Subject()
  user: IUserItem

  form = new FormGroup({
    oldpass: new FormControl<string>('', [
      Validators.required
    ]),
    password: new FormControl<string>('', [
      Validators.required
    ]),
    confirmPassword: new FormControl<string>('', [
      Validators.required
    ])
  },
  [PassConfValidation.MatchValidator('password', 'confirmPassword')]
  )

  constructor(
    private account$: AccountService,
    private user$: UserService,
    private message$: MessageService,
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
    this.user$.user.subscribe(user => {
      if(user && typeof user == 'object' && 'id' in user) {
        this.user = user
        setTimeout(() => {
          this.defaultValue.next(user)
        }, 1000)
      }
    })
  }

  deleteAccount() {
    this.account$.registerResponse.subscribe(response => {
      if(response.results) {
        //this.message$.handle("", "success")
        setTimeout(() => {
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Ваш аккаунт успешно удален, для того чтобы его восстановить обратитесь в администрацию'
          })
        }, 200)
        setTimeout(() => {
          this.account$.logout()
        }, 3000)
      }
    })

    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == id$) {
        this.account$.updateUser(this.user.id, {
          is_active: false
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: id$,
      type: 'delete',
      text: 'Вы действительно хотите удалить аккаунт?',
      buttonText: 'Удалить'
    })
    
    
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const data = this.form.value
      this.account$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      this.account$.changeAccountPassword(data).subscribe((response: IHttpResponse) => {
        if(response.results) {
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Пароль успешно изменен'
          })
          //this.message$.handle("Пароль успешно изменен", "success")
          this.form.controls.oldpass.setValidators([])
          this.form.controls.password.setValidators([])
          this.form.controls.confirmPassword.setValidators([])
          this.defaultValue.next({
            oldpass: '',
            password: '',
            confirmPassword: ''
          })
        }
      })
    }
  }

}
