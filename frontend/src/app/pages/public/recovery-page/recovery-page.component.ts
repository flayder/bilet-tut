import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-recovery-page',
  templateUrl: './recovery-page.component.html',
  styleUrls: ['./recovery-page.component.css']
})
export class RecoveryPageComponent implements OnInit {

  authFormSubmit = new Subject()
  authFormPhoneSubmit = new Subject()
  type: string = "email"
  smscode: boolean = false
  user_id: number = 0

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
  })

  formPhone = new FormGroup({
    phone: new FormControl('', [
      Validators.required
    ]),
  })
  
  constructor(
    private user$: UserService,
    private message$: MessageService,
    private router$: Router
  ) { }

  setType(type: string) {
    this.type = type
  }

  ngOnInit(): void {
  }

  submitPhone() {
    this.authFormPhoneSubmit.next({})
    if(!ErrorHandlerClass.AnyErrors(this.formPhone)) {
      const data = new FormData
      const phone: any = this.formPhone.value.phone
      data.append('phone', phone.replace(/[^0-9]/gi, ""))

      this.user$.recoveryPhone(data).subscribe((response: IHttpResponse) => {
        this.message$.handle('На указанный номер был выслан новый пароль', 'success')
        this.router$.navigate(["/auth"])
      })
    }
  }

  submit() {
    this.authFormSubmit.next({})
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const data = new FormData
      const email: any = this.form.value.email
      data.append('email', email)

      this.user$.recovery(data).subscribe((response: IHttpResponse) => {
        this.message$.handle('Если почта есть в базе, то на нее будет выслана инструкция по востановлению пароля', 'success')
      })
    }
  }

}
