import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { PHONE_REG_EXP } from 'src/app/exports/constans';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-account-form]',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {

  user: IUserItem
  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  photo: any = false

  form = new FormGroup(
    {
      login: new FormControl(''),
      photo: new FormControl(''),
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
      birthday: new FormControl(null),
      email: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
    },
  )

  constructor(
    private user$: UserService,
    private account$: AccountService,
    private message$: MessageService,
    private modal$: ModalService
  ) { 
    this.account$.registerResponse.subscribe((response: IHttpResponse) => {
      //this.message$.handle("Настройки были успешно изменены", "success")
      this.modal$.open('notification-tiny', {
        type: 'success',
        text: 'Настройки были успешно изменены'
      })
      this.user$.reloadUser(true)
    })
    this.user$.user.subscribe(user => {
      if(user && typeof user == 'object' && 'id' in user) {
        this.user = user
        setTimeout(() => {
          this.defaultValue.next(user)
        }, 1000)
      }
    })
  }

  ngOnInit(): void {
    
  }

  // setPhoto(file: any) {
  //   console.log('file', file)
  //   this.photo = file
  //   console.log('this.photo', this.photo)
  // }

  getPhoto() {
    if(this.user.photo !== null)
      return this.user.photo.image.small

    return ''
  }

  isPhoto() {
    return !!this.user.photo
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
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
