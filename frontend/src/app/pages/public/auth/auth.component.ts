import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  authFormSubmit = new Subject()

  form = new FormGroup({
    login: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  })

  clear: any

  constructor(
    private account$: AccountService,
    private message$: MessageService,
    private router: Router
  ) { 
    const token = localStorage.getItem('token')
    if(token) {
      this.router.navigateByUrl("")
    }
  }

  ngOnInit(): void {
  }

  auth(data: any) {
    this.account$.getErrors().subscribe(errors => {
      ErrorHandlerClass.TryResponseFromServer(errors, this.form)
      this.authFormSubmit.next({})
      ErrorHandlerClass.TryResponseFromServer(errors, this.form, true)
    })

    this.account$.authResponse.subscribe((response: IHttpResponse) => {
      if(
        response.results &&
        response.results.hasOwnProperty('token')
      ) {
        localStorage.setItem('token', response.results.token)

        this.message$.handle('Вы успешно авторизовались', 'success')
        
        setTimeout(() => {

          const previousRoute = localStorage.getItem('previousRoute')
          //console.log('previousRoute', previousRoute)
          if(previousRoute && previousRoute != '/auth') {
            console.log('previousRoute', previousRoute)
            window.location.href = previousRoute
          }
          else {
            window.location.href = '/account'
          }
        }, 3000)
      } else
        this.message$.handle('Произошла неизвестная ошибка! Повторите попытку авторизации позже или обратитесь в администрацию')
    })
    clearTimeout(this.clear)
    this.clear = setTimeout(() => {
      this.account$.auth(data)
    }, 200)
  }

  submit() {
    this.authFormSubmit.next({})
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const data = this.form.value
      this.auth(data)
    }
  }

}
