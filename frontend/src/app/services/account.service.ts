import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';
import { BilethttpService } from './bilethttp.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  authResponse: Subject<IHttpResponse> = new Subject()
  registerResponse: Subject<IHttpResponse>  = new Subject()

  init: boolean = false

  constructor(
    private http$: BilethttpService,
    private user$: UserService,
    private router$: Router
  ) { 
    http$.errors.subscribe(errors => {
      this.init = false
    })
  }

  getErrors() {
    return this.http$.getErrors()
  }


  //Форма регистрации
  register(data: {}, params = {}) {
    if(!this.init) {
      this.init = true
      this.http$.post('/api/user/register', data, params)
      .subscribe((response: IHttpResponse) => {
        this.init = false
        this.registerResponse.next(response)
      })
    }
  }
  

  //Обновление данных пользователя
  updateUser(id: number, data: {}) {
    if(!this.init) {
      this.init = true
      this.http$.put(`/api/user/${id}/`, data)
      .subscribe((response: IHttpResponse) => {
        this.init = false
        this.registerResponse.next(response)
      })
    }
  }

  //Активация аккаунта
  activateAccount(id: number, data: {}) {
    return this.http$.post(`/api/user/activate/${id}/`, data)
  }


  //Форма измененеия пароля
  changeAccountPassword(data = {}) {
    return this.http$.post("/api/user/password/change/", data)
  }


  //Логаут авторизированного пользователя
  logout() {
    localStorage.setItem('previousRoute', '')
    localStorage.setItem('token', '')
    this.user$.user.next(false)
    this.router$.navigateByUrl("")
  }


  //Получение списка избранных мероприятий пользователя
  getFavorites(data = {}) {
    return this.http$.get('/api/event/favorite/list/', data)
  }


  //Форма авторизации
  auth(data: {}) {
    if(!this.init) {
      this.init = true
      this.http$.post('/api/user/auth/', data)
      .subscribe((response: IHttpResponse) => {
        this.init = false
        if(
          typeof response.results == "object" && 
          response.results.hasOwnProperty('token') &&
          response.results.token
        )
          localStorage.setItem('token', response.results.token)
          
        this.authResponse.next(response)
      })
    }
  }
}
